/** @type {import('next').NextConfig} */
// Load the CommonJS config and re-export as ESM to stay compatible with tools
import cjsConfig from './next.config.cjs';
export default cjsConfig;
