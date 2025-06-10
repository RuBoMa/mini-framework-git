import js from '@eslint/js' // ESLint's default JavaScript config
import globals from 'globals' // Predefined global variables (e.g., browser, Node)
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js },
        extends: ['js/recommended'], // Enables rules from @eslint/js for good practices
        rules: {
            // Style rules:
            semi: ['error', 'never'], // No semicolons (change to "always" to enforce them)
            indent: ['error', 4], // 2 or 4 spaces or "tab"
            quotes: ['error', 'single'],
        }
    },
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: { globals: globals.browser }, // Allows 'window', 'document', etc.
    },

])
