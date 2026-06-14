/**
 * dynamic-scan.ts
 *
 * Companion to scan.ts. Where scan.ts answers "is this file a client or
 * server component?", this answers a harder question:
 *
 *     "Which of my pages are forced to render dynamically — and why?"
 *
 * A Next.js route can only be prerendered if NOTHING in its render tree —
 * the page, its ancestor layouts, and every server component they import
 * (transitively) — touches a Dynamic API: cookies(), headers(), draftMode(),
 * connection(), searchParams, or an explicit `export const dynamic`.
 *
 * So a per-file grep isn't enough: it finds the SOURCE of dynamism but not
 * the PAGES it poisons. This script propagates dynamism up the import graph
 * and through layout nesting, then reports each page as static or dynamic and
 * traces the chain back to the culprit.
 *
 * Run from your project root:  node utils/dynamic-scan.ts   (Node 22.18+)
 *                          or: pnpm tsx utils/dynamic-scan.ts
 */

import fs from "node:fs"
import path from "node:path"

// ---- config -------------------------------------------------------------

const PROJECT_ROOT = path.join(import.meta.dirname, "..")
const SCAN_DIRS = ["app", "components", "lib"]
// Path-alias resolution. Adjust if your tsconfig maps "@/*" somewhere else.
const ALIASES: Record<string, string> = { "@/": PROJECT_ROOT + path.sep }
const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"]

const RED = "\x1b[31m"
const GREEN = "\x1b[32m"
const YELLOW = "\x1b[33m"
const DIM = "\x1b[2m"
const RESET = "\x1b[0m"

// ---- file collection ----------------------------------------------------

function collectFiles(dir: string, acc: string[] = []): string[] {
    let entries: fs.Dirent[]
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
        return acc // directory doesn't exist; skip it
    }
    for (const entry of entries) {
        if (entry.name === "node_modules" || entry.name.startsWith(".")) continue
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) collectFiles(full, acc)
        else if (EXTENSIONS.includes(path.extname(entry.name))) acc.push(full)
    }
    return acc
}

// ---- per-file analysis --------------------------------------------------

type FileInfo = {
    isClient: boolean
    directSources: string[] // why THIS file is itself a dynamic source
    imports: string[] // resolved absolute paths of local imports
}

function firstNonEmptyLine(src: string): string {
    for (const line of src.split("\n")) {
        const t = line.trim()
        if (t) return t
    }
    return ""
}

function isClientComponent(src: string): boolean {
    return /^['"`]use client['"`];?$/.test(firstNonEmptyLine(src))
}

function detectDirectSources(src: string, filePath: string): string[] {
    const reasons: string[] = []
    const importsHeaders = /from\s+['"]next\/headers['"]/.test(src)
    const importsServer = /from\s+['"]next\/server['"]/.test(src)
    const importsAuthModule = /from\s+['"][^'"]*\/lib\/auth['"]/.test(src)

    if (importsHeaders && /\bcookies\s*\(/.test(src)) reasons.push("cookies()")
    if (importsHeaders && /\bheaders\s*\(/.test(src)) reasons.push("headers()")
    if (importsHeaders && /\bdraftMode\s*\(/.test(src)) reasons.push("draftMode()")
    if (importsServer && /\bconnection\s*\(/.test(src)) reasons.push("connection()")
    if (importsAuthModule && /\bauth\s*\(/.test(src)) reasons.push("auth() via lib/auth")

    if (/export\s+const\s+dynamic\s*=\s*['"]force-dynamic['"]/.test(src))
        reasons.push(`export const dynamic = "force-dynamic"`)
    if (/export\s+const\s+revalidate\s*=\s*0\b/.test(src))
        reasons.push("export const revalidate = 0")

    // searchParams is a dynamic prop, but only meaningful inside a page.
    if (path.basename(filePath).startsWith("page.") && /\bsearchParams\b/.test(src))
        reasons.push("searchParams (prop)")

    return reasons
}

// Additional build-time rules that can force a page to be dynamic, even if nothing in the render tree 
// touches a Dynamic API. For example, a dynamic segment page ([slug].tsx) without generateStaticParams() 
// must be dynamic because Next.js has no way to know which paths to prerender.
function detectPageBuildRules(pageFile: string, src: string): string[] {
    const rules: string[] = []
    const isDynamicSegmentPage = pageFile.includes(`${path.sep}[`)
    const hasGenerateStaticParams = /export\s+(?:async\s+)?function\s+generateStaticParams\b/.test(src)
        || /export\s+const\s+generateStaticParams\b/.test(src)

    if (isDynamicSegmentPage && !hasGenerateStaticParams) {
        rules.push("dynamic segment page without generateStaticParams")
    }

    return rules
}

// ---- import resolution --------------------------------------------------

function resolveImport(spec: string, fromFile: string): string | null {
    let base: string | null = null

    if (spec.startsWith(".")) {
        base = path.resolve(path.dirname(fromFile), spec)
    } else {
        for (const [alias, target] of Object.entries(ALIASES)) {
            if (spec.startsWith(alias)) {
                base = path.join(target, spec.slice(alias.length))
                break
            }
        }
    }
    if (!base) return null // bare import (next, react, ...) — not local, ignore

    for (const ext of EXTENSIONS) if (fs.existsSync(base + ext)) return base + ext
    for (const ext of EXTENSIONS) {
        const idx = path.join(base, "index" + ext)
        if (fs.existsSync(idx)) return idx
    }
    if (fs.existsSync(base) && fs.statSync(base).isFile()) return base
    return null
}

function extractImports(src: string, fromFile: string): string[] {
    const specs: string[] = []
    const re = /(?:import|export)[^'"]*?from\s+['"]([^'"]+)['"]/g
    let m: RegExpExecArray | null
    while ((m = re.exec(src))) {
        const resolved = resolveImport(m[1], fromFile)
        if (resolved) specs.push(resolved)
    }
    return specs
}

// ---- build the model ----------------------------------------------------

const files = SCAN_DIRS.flatMap((d) => collectFiles(path.join(PROJECT_ROOT, d)))
const info = new Map<string, FileInfo>()
const sourceByFile = new Map<string, string>()

for (const file of files) {
    const src = fs.readFileSync(file, "utf8")
    sourceByFile.set(file, src)
    const isClient = isClientComponent(src)
    info.set(file, {
        isClient,
        // A client component can't call server Dynamic APIs, so it's never a source.
        directSources: isClient ? [] : detectDirectSources(src, file),
        imports: extractImports(src, file),
    })
}

// ---- transitive dynamism ------------------------------------------------
// A server file is dynamic if it is a direct source, OR it imports (through
// other server files) a dynamic file. Propagation STOPS at client components:
// a "use client" boundary runs separately and never makes the server render
// dynamic. Returns the chain of files from here down to the source, or null.

const cache = new Map<string, string[] | null>()

function rel(p: string): string {
    return path.relative(PROJECT_ROOT, p)
}

function dynamicChain(file: string, stack: Set<string>): string[] | null {
    if (cache.has(file)) return cache.get(file)!
    if (stack.has(file)) return null // cycle guard

    const f = info.get(file)
    if (!f || f.isClient) {
        cache.set(file, null)
        return null
    }
    if (f.directSources.length > 0) {
        const chain = [`${rel(file)}  ${DIM}— ${f.directSources.join(", ")}${RESET}`]
        cache.set(file, chain)
        return chain
    }

    stack.add(file)
    for (const imp of f.imports) {
        const sub = dynamicChain(imp, stack)
        if (sub) {
            stack.delete(file)
            const chain = [rel(file), ...sub]
            cache.set(file, chain)
            return chain
        }
    }
    stack.delete(file)
    cache.set(file, null)
    return null
}

// A page renders dynamically if the page OR any ancestor layout is dynamic.
function ancestorLayouts(pageFile: string): string[] {
    const layouts: string[] = []
    const appRoot = path.join(PROJECT_ROOT, "app")
    let dir = path.dirname(pageFile)
    while (dir.startsWith(appRoot)) {
        for (const ext of EXTENSIONS) {
            const layout = path.join(dir, "layout" + ext)
            if (fs.existsSync(layout)) layouts.push(layout)
        }
        if (dir === appRoot) break
        dir = path.dirname(dir)
    }
    return layouts
}

// ---- report -------------------------------------------------------------

const pages = files.filter((f) => path.basename(f).startsWith("page.")).sort()

console.log(`\n${"=".repeat(64)}`)
console.log(` Dynamic-render scan — ${pages.length} pages`)
console.log(`${"=".repeat(64)}`)

let dynamicCount = 0

for (const page of pages) {
    const culprits: { where: string, chain: string[] }[] = []
    const buildRules = detectPageBuildRules(page, sourceByFile.get(page) ?? "")

    const pageChain = dynamicChain(page, new Set())
    if (pageChain) culprits.push({ where: "page", chain: pageChain })

    for (const layout of ancestorLayouts(page)) {
        const lChain = dynamicChain(layout, new Set())
        if (lChain) culprits.push({ where: `layout · ${rel(layout)}`, chain: lChain })
    }

    const isDynamic = culprits.length > 0 || buildRules.length > 0
    if (isDynamic) dynamicCount++

    const tag = isDynamic ? `${RED}ƒ dynamic${RESET}` : `${GREEN}○ static ${RESET}`
    console.log(`\n${tag}  ${rel(page)}`)

    for (const c of culprits) {
        console.log(`   ${YELLOW}↳ via ${c.where}${RESET}`)
        c.chain.forEach((step, i) => {
            const arrow = i === c.chain.length - 1 ? "→ " : ""
            console.log(`     ${DIM}${"  ".repeat(i)}${RESET}${arrow}${step}`)
        })
    }

    if (buildRules.length > 0) {
        console.log(`   ${YELLOW}↳ build rules${RESET}`)
        for (const rule of buildRules) {
            console.log(`     → ${rule}`)
        }
    }
}

console.log(`\n${"=".repeat(64)}`)
console.log(` ${dynamicCount} dynamic / ${pages.length - dynamicCount} static / ${pages.length} pages`)
console.log(`${"=".repeat(64)}\n`)