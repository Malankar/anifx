import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// The site itself (index.html + one html per event) is the old
// frontend/*.html + shared.css + shared.js, copied over unchanged — Vite
// just builds/serves it as a multi-page app. Only intentional edit: the
// header nav's "On campus" + "FAQ" links became a single "Home" link.
//
// react()/tailwindcss() stay configured for the paused Firebase-backed
// dashboard/auth work (src/) — not used by these static pages.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        valorant: path.resolve(__dirname, "valorant.html"),
        fc26: path.resolve(__dirname, "fc26.html"),
        gameJam: path.resolve(__dirname, "game-jam.html"),
        filmFestival: path.resolve(__dirname, "film-festival.html"),
        characterDesign: path.resolve(__dirname, "character-design.html"),
      },
    },
  },
})
