import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@brave/leo': path.resolve(__dirname, '../../')
    }
  },
  server: {
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // your custom rules
        '../../node_modules'
      ]
    }
  }
})
