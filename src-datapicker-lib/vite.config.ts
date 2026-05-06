import { defineConfig, PluginOption } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
        }) as PluginOption,
    ],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "DataPickerLib",
            fileName: "datapicker-lib",
        },
    },
});
