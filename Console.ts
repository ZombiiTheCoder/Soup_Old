// deno-lint-ignore-file no-explicit-any
import { RunInterpreter } from "./run.ts";
import Enviornment from "./runtime/enviornment.ts";

export function RunFromConsole(C: string, enviornment:Enviornment){
    console.log("\nSoup v0.1.1");
    console.log(C)
    RunInterpreter(C, enviornment)
    while (true) {
        
        const filecontents = prompt("> ") || "";
        if (!filecontents || filecontents.includes("exit")) { Deno.exit(1); }
        RunInterpreter(filecontents, enviornment)


    }
}

export function ProcessFlags(args: string[]): Record<string, any>{
    const Flags: Record<string, any> = {
        "file": "",
        ".sp": false,
        "-tr": false,
        "-tk": false,
        "-v": false,
        "-constants":false,
        "-constants>":""
    }

    const CLI_FLAGS: Record<string, boolean> = {
        ".sp": false,
        "-tr": false,
        "-tk": false,
        "-v": true,
        "-constants":true,
        "-constants:":true,
    }
    
    const lastFlag: Map<string, string> = new Map();
    for (let i = 0; i < args.length; i++) {
        const Flag = args[i];
        
        if (!Flag.includes(".sp") && Flags[Flag] == undefined && !Flag.includes("-constants")){ throw `Flag "${Flag}" Does Not Exist` }
        if (Flag.includes(".sp")){ Flags[".sp"] = true, Flags["file"] = Flag }
        if (Flags[Flag] != undefined){ Flags[Flag] = true }
        if (lastFlag.get(Flag) == Flag){ throw `Flag "${Flag}" had been used twice or more`}
        lastFlag.set(Flag, Flag)
        if (Flag.includes("-constants")){ Flags["-constants"] = true; Flags["-constants:"] = Flag.replaceAll("-constants:", "").replaceAll("_", " ").replaceAll("!", "\n"); }
    }

    for (let i = 0; i < args.length; i++) {
        const Flag = args[i];
        if (!Flags[".sp"] && !Flag.includes(".sp") && !CLI_FLAGS[Flag] && !Flag.includes("-constants")) { throw `Flags may be used if a file is provided` }

    }

    return Flags
}