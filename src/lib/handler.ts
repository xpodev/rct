import { generate } from "../generate/generate";
import * as colors from "./console-font";

export async function handle(argv: any) {
    try {
        switch (argv[0]) {
            case "g":
            case "generate":
                await generate(argv)
                break;
            default:
                console.log(`Unknown command '${argv[0]}'`);
        }
    } catch (e) {
        console.log(`${colors.FgRed}${e.message}${colors.Reset}`);
        process.exit(1);
    }
}