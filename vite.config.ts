import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const isDev = process.env.NODE_ENV === "development";
// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        exclude: isDev ? ["datapicker-lib"] : [],
    },
    server: {
        watch: {
            ignored: isDev ? ["!**/node_modules/datapicker-lib/**"] : [],
        },
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
    },
});
