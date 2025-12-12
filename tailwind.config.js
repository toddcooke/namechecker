/** @type {import('tailwindcss').Config} */
// Re-export the CommonJS config as ESM so the project can run with "type": "module"
import cjs from './tailwind.config.cjs';
export default cjs;
