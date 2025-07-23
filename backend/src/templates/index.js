// templateLoader.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templates = {};
let defaultBuilder = null;

const entries = fs.readdirSync(__dirname, { withFileTypes: true });

for (const entry of entries) {
    if (entry.isDirectory()) {
        const folderName = entry.name;
        const builderPath = path.join(__dirname, folderName, "index.js");

        console.log("FolderName:", folderName);
        console.log("builderPath:", builderPath);

        if (fs.existsSync(builderPath)) {
            try {
                const module = await import(`./${folderName}/index.js`);

                console.log(`Imported keys for [${folderName}]:`, Object.keys(module));

                const builderFn =
                    module.default ||
                    module.buildLatex ||
                    module[`build${folderName.charAt(0).toUpperCase() + folderName.slice(1)}Latex`];

                if (builderFn) {
                    templates[folderName.toLowerCase()] = builderFn;
                    console.log(`Template registered: ${folderName}`);

                    if (folderName.toLowerCase() === "templateone") {
                        defaultBuilder = builderFn;
                        console.log(`Default template set to: ${folderName}`);
                    }
                } else {
                    console.log(`No valid builder found in ${folderName}`);
                }
            } catch (err) {
                console.error(`Failed to import ${builderPath}:`, err);
            }
        } else {
            console.log(`Builder not found: ${builderPath}`);
        }
    }
}

// Fallback: force default if none found but templateOne exists
if (!defaultBuilder && templates["templateone"]) {
    defaultBuilder = templates["templateone"];
    console.log(`Fallback default template set to: templateOne`);
}

export { templates, defaultBuilder };
