import path from "path"
import { defineConfig } from "vite"

// The site itself (index.html + one html per event) is the old
// frontend/*.html + shared.css + shared.js, copied over unchanged — Vite
// just builds/serves it as a multi-page app. Only intentional edit: the
// header nav's "On campus" + "FAQ" links became a single "Home" link.
export default defineConfig({
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
