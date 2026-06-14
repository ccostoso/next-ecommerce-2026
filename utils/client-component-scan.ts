/**
 * This utility scans the "app" and "components" directories for files that contain the "use client" directive,
 * which indicates that they are client components. It builds a tree of the file structure, marking each
 * file as client or server, and then prints the tree to the console with a summary of how many client
 * and server files there are. This can help you understand the distribution of client and server components
 * in your Next.js project and identify any unexpected client components that might be causing dynamic rendering.
 *
 * Note: This is a simple heuristic based on the presence of "use client" (either double quotes, single 
 * quotes or backticks) at the top of the file. It does not account for dynamic imports or other ways that 
 * a file might become dynamic. However, it should give a good starting point for understanding your 
 * project's component structure.
 *
 * Run from your project root:  node utils/client-component-scan.ts   (Node 22.18+)
 *                          or: pnpm tsx utils/client-component-scan.ts
 */

import fs from "fs"
import path from "path"

const ROOT = path.join(import.meta.dirname, "..")
const SCAN_DIRS = ["app", "components"]
const EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"]

type FileNode = {
    name: string
    relativePath: string
    isClient: boolean
    children?: FileNode[]
    isDir?: boolean
}

function hasUseClient(filePath: string): boolean {
    const content = fs.readFileSync(filePath, "utf-8")
    // Must be at the top of the file — skip blank lines and block comments
    const firstMeaningfulLine = content
        .split("\n")
        .find(line => line.trim() !== "")
    return /^['"`]use client['"`];?$/.test(firstMeaningfulLine?.trim() ?? "")
}

function scanDir(dir: string): FileNode[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    const nodes: FileNode[] = []

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        const relativePath = path.relative(ROOT, fullPath)

        if (entry.isDirectory()) {
            const children = scanDir(fullPath)
            if (children.length > 0) {
                nodes.push({ name: entry.name, relativePath, isClient: false, isDir: true, children })
            }
        } else if (EXTENSIONS.some(ext => entry.name.endsWith(ext))) {
            nodes.push({
                name: entry.name,
                relativePath,
                isClient: hasUseClient(fullPath),
            })
        }
    }

    return nodes
}

function printTree(nodes: FileNode[], prefix = "") {
    nodes.forEach((node, i) => {
        const isLast = i === nodes.length - 1
        const connector = isLast ? "└── " : "├── "
        const childPrefix = prefix + (isLast ? "    " : "│   ")

        if (node.isDir) {
            console.log(`\x1b[2m${prefix}${connector}${node.name}/\x1b[0m`)
            printTree(node.children!, childPrefix)
        } else {
            const tag = node.isClient ? "\x1b[38;2;0;255;255m[C]\x1b[0m" : "\x1b[38;2;180;40;30m[S]\x1b[0m"
            console.log(`${prefix}${connector}${tag} ${node.name}`)
        }
    })
}

function summarize(nodes: FileNode[]): { total: number, client: number } {
    let total = 0, client = 0
    for (const node of nodes) {
        if (node.isDir) {
            const sub = summarize(node.children!)
            total += sub.total; client += sub.client
        } else {
            total++
            if (node.isClient) client++
        }
    }
    return { total, client }
}

// ── main ──────────────────────────────────────────────────────
const allNodes: FileNode[] = []

for (const dir of SCAN_DIRS) {
    const fullDir = path.join(ROOT, dir)
    if (!fs.existsSync(fullDir)) continue
    allNodes.push({
        name: dir,
        relativePath: dir,
        isClient: false,
        isDir: true,
        children: scanDir(fullDir),
    })
}

console.log("\n\x1b[38;2;0;255;255m[C]\x1b[0m client   \x1b[38;2;180;40;30m[S]\x1b[0m server\n")
printTree(allNodes)

const { total, client } = summarize(allNodes)
console.log(`\n${client} client / ${total - client} server / ${total} total\n`)
