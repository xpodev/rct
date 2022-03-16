#!/usr/bin/env node
import path from "path";
import { handle } from "./handler";

const DEV = false;

function closeRCT(message: string) {
    console.log(message);
    process.exit(1);
}

const argv: any = {};
const itrArgs = process.argv.slice(2);
for (let i = 0; i < itrArgs.length; i++) {
    const arg = itrArgs[i];
    if (arg.startsWith("--")) {
        if (itrArgs[i + 1] && ~(itrArgs[i + 1].startsWith("-"))) {
            argv[arg.replace("--", "")] = itrArgs[i + 1];
        } else {
            argv[arg.replace("--", "")] = true;
        }
    } else if (arg.startsWith("-")) {
        if (itrArgs[i + 1] && !(itrArgs[i + 1].startsWith("-"))) {
            argv[arg.replace("-", "")] = itrArgs[i + 1];
        } else {
            argv[arg.replace("-", "")] = true;
        }
    }
    argv[i] = arg;
}

try {
    const packageJSON = require(path.join(process.cwd(), "package.json"));
    if (!DEV) {
        if (!packageJSON.dependencies || !packageJSON.dependencies.react) {
            closeRCT("Cannot run rct on a non-react project folder");
        }
    }
    __typescript = packageJSON.dependencies.typescript ? true : false;
    handle(argv);
} catch (e) {
    closeRCT("Cannot run rct on a non-react project folder");
}