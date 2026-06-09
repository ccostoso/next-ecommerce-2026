import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import stylistic from "@stylistic/eslint-plugin"

const eslintConfig = defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
    ]),
    {
        plugins: {
            "@stylistic": stylistic,
        },
        rules: {
            semi: "off",
            "@stylistic/semi": ["error", "never"],
            "no-extra-semi": "error",
            "@stylistic/member-delimiter-style": [
                "error",
                {
                    multiline: { delimiter: "none", requireLast: false },
                    singleline: { delimiter: "comma", requireLast: false },
                    multilineDetection: "brackets",
                },
            ],
        },
    },
])

export default eslintConfig
