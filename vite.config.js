import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true
  },
  // This line below is only required when not hosting from a custom domain
  base: process.env.NODE_ENV === "production" ? '/flow-invoice/' : '/',
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version)
  }
})
