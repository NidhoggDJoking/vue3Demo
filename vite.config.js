import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vue3Demo",
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: "@antv/x6",
        replacement: "@antv/x6/lib",
      },
      {
        find: "@antv/x6-vue-shape",
        replacement: "@antv/x6-vue-shape/lib",
      },
    ],
  }
});
