import path from "path"
import { fileURLToPath } from "url"
import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const requiredEnv = ["VITE_SUPABASE_URL", "VITE_SUPABASE_KEY"] as const

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, rootDir, "VITE_")

  if (mode === "production") {
    const missing = requiredEnv.filter((key) => !env[key])
    if (missing.length > 0) {
      throw new Error(
        `Missing ${missing.join(", ")}. Set them as build environment variables before deploying.`,
      )
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "./src"),
      },
    },
  }
})
