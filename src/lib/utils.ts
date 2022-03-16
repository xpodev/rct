import * as font from "./console-font";

export function closeRct(message: string) {
    console.log(message);
    process.exit(1);
}

export function error(message: string) {
    return `${font.FgRed}ERROR: ${message}${font.Reset}`;
}

export function success(message: string) {
    return `${font.FgGreen}${message}${font.Reset}`;
}

export function warning(message: string) {
    return `${font.FgYellow}WARNING: ${message}${font.Reset}`;
}

export function toCamelCase(text: string) {
    return text.replace(/-\w/g, clearAndUpper);
}

export function toPascalCase(text: string) {
    return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

function clearAndUpper(text: string) {
    return text.replace(/-/, "").toUpperCase();
}

let typescript: boolean = false;
export function isTypescript() {
    return typescript;
}

export function setTypescript(value: boolean) {
    typescript = value;
}