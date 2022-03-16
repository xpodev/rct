#!/usr/bin/env node

import path from "path";
import { handle } from "./lib/handler";
import { closeRct, error, setTypescript } from "./lib/utils";

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
    if (!packageJSON.dependencies || !packageJSON.dependencies.react) {
        closeRct(error("Cannot run rct in a non-react project folder"));
    }
    setTypescript(!!packageJSON.dependencies.typescript);
    handle(argv);
} catch (e) {
    closeRct(error("Cannot run rct in a non-react project folder"));
}