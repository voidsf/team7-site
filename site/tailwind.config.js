import { heroui } from "@heroui/react";

module.exports = {
    content: [
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    darkMode: "class",
    plugins: [heroui()],
}