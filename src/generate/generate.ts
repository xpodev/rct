import fs from "fs";
import path from "path";
import { isTypescript, success, toCamelCase, toPascalCase } from "../lib/utils";

import * as colors from "../lib/console-font";

const templatesFolder = path.join(__dirname, "templates");

const templates = {
    component: {
        scriptES5: () => fs.readFileSync(`${templatesFolder}/component/script.es5.rctmplt`).toString(),
        scriptES6: () => fs.readFileSync(`${templatesFolder}/component/script.es6.rctmplt`).toString(),
        templateES5: () => fs.readFileSync(`${templatesFolder}/component/template.es5.rctmplt`).toString(),
        templateES6: () => fs.readFileSync(`${templatesFolder}/component/template.es6.rctmplt`).toString(),
        css: () => fs.readFileSync(`${templatesFolder}/component/css.rctmplt`).toString()
    },
    service: {
        script: () => fs.readFileSync(`${templatesFolder}/service/es6.rctmplt`).toString()
    }
}

const pathRegex = /^[^\-\/].*[^\/]$/;
const typescriptRegex = /{@@typescript:\n*\r*((.*?\n*\r*)*?)@}/gm;

export async function generate(argv: string[]) {
    switch (argv[1]) {
        case "c":
        case "component":
            await generateComponent(argv[2], argv);
            break;
        case "s":
        case "service":
            await generateService(argv[2], argv);
            break;
        default:
            throw new Error(`Unknown argument '${argv[1]}'`);
    }
}

async function generateComponent(componentPath: string, args: any) {
    if (pathRegex.test(componentPath)) {
        // Path data
        const fileData = makeFileData(componentPath);

        // Script
        fs.writeFileSync(
            `${fileData.fullpath}.${fileData.ext}`,
            renderTemplate(
                args.functional ? templates.component.scriptES5() : templates.component.scriptES6(),
                { name: toPascalCase(fileData.basename) }
            )
        );
        logCreated(`${componentPath}.${fileData.ext}`);

        // HTML template (it's actually jsx/tsx but it's fine)
        fs.writeFileSync(
            `${fileData.fullpath}.render.${fileData.ext}`,
            renderTemplate(
                args.functional ? templates.component.templateES5() : templates.component.templateES6(),
                { name: toPascalCase(fileData.basename) }
            )
        );
        logCreated(`${componentPath}.render.${fileData.ext}`);

        // CSS
        fs.writeFileSync(
            `${fileData.fullpath}.css`,
            renderTemplate(
                templates.component.css(),
                {}
            )
        );
        logCreated(componentPath + ".css");
    } else {
        throw new Error("Invalid component path");
    }
}

async function generateService(servicePath: string, args: object) {
    if (pathRegex.test(servicePath)) {
        // Path data
        const fileData = makeFileData(servicePath);
        fileData.ext = isTypescript() ? "ts" : "js";
        // Script
        fs.writeFileSync(`${fileData.fullpath}.${fileData.ext}`,
            renderTemplate(templates.service.script(),
                {
                    name: toPascalCase(fileData.basename),
                    camelCaseName: toCamelCase(fileData.basename)
                }
            )
        );
        logCreated(`${servicePath}.${fileData.ext}`);
    } else {
        throw new Error("Invalid service path");
    }
}

function makeFileData(filePath: string) {
    const basename = filePath.split(/[\/|\\]/).pop();
    const dirname = path.join(process.cwd(), "src", filePath);
    if (fs.existsSync(dirname)) {
        throw new Error(`Directory '${dirname}' already exists`);
    }
    fs.mkdirSync(dirname, { recursive: true });
    const fullpath = path.join(dirname, toPascalCase(basename));
    return {
        basename,
        dirname,
        fullpath,
        ext: isTypescript() ? "tsx" : "jsx"
    };
}

function renderTemplate(template: string, obj: any) {
    template = template.replace(typescriptRegex, (substring, code) => {
        return isTypescript() ? code : "";
    });
    for (const k in obj) {
        template = template.replace(new RegExp(`{{${k}}}`, "gm"), obj[k]);
    }
    return template;
}

function logCreated(filename: string) {
    console.log(`[${success("CREATED")}] ${colors.FgYellow}${filename}${colors.Reset}`);
}
