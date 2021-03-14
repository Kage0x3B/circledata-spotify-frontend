import fs from "fs";
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import preprocess from "svelte-preprocess";
import json from "@rollup/plugin-json";
import { config } from "dotenv";
import replace from "@rollup/plugin-replace";
import html, { makeHtmlAttributes } from "@rollup/plugin-html";
import css from "rollup-plugin-css-chunks";

const production = !process.env.ROLLUP_WATCH;

function serve() {
    let server;

    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
                stdio: ["ignore", "inherit", "inherit"],
                shell: true
            });

            process.on("SIGTERM", toExit);
            process.on("exit", toExit);
        }
    };
}

function generateHtmlTemplate(templateFile, { attributes, files, meta, publicPath, title }) {
    let htmlTemplate = fs.readFileSync(templateFile, "utf-8");

    files.js = files.js || [];
    files.js.unshift({ fileName: "//cdn.jsdelivr.net/npm/eruda" });

    const templateData = {
        scripts: files.js.map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.script);
            let path;

            if (fileName.startsWith("http") || fileName.startsWith("//")) {
                path = fileName;
            } else {
                path = `/${publicPath}${fileName}`;
            }
            return `<script src="${path}"${attrs}></script>`;
        }).join("\n"),
        links: (files.css || []).map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.link);
            let path;

            if (fileName.startsWith("http") || fileName.startsWith("//")) {
                path = fileName;
            } else {
                path = `/${publicPath}${fileName}`;
            }

            return `<link href="${path}" rel="stylesheet"${attrs}>`;
        }).join("\n")
    };

    return htmlTemplate.replace(/%(\w*)%/g, (_, key) => templateData.hasOwnProperty(key) ? templateData[key] : "");
}

export default {
    input: "src/main.js",
    output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        dir: "public",
        entryFileNames: production ? "build/[name].[hash].js" : "build/[name].js"
    },
    plugins: [
        svelte({
            dev: !production,
            preprocess: preprocess(),
            emitCss: true
        }),
        css({
            entryFileNames: production ? "build/[name].[hash].css" : "build/[name].css"
        }),
        json(),
        replace({
            appEnv: JSON.stringify({
                DEV: !production,
                ...config().parsed
            }),
            preventAssignment: true
        }),
        resolve({
            browser: true,
            dedupe: ["svelte"]
        }),
        commonjs(),
        html({
            template: (data) => generateHtmlTemplate("src/template.html", data),
            attributes: {
                script: {
                    defer: ""
                }
            }
        }),
        !production && serve(),
        !production && livereload("public"),
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
};
