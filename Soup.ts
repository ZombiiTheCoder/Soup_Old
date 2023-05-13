import { ProcessFlags, RunFromConsole } from "./Console.ts";
import { Tokenize } from "./lexer/lexer.ts";
import Parser from "./parser/parser.ts";
import { RunInterpreter } from "./run.ts";
import { createGlobalEnviorment } from "./runtime/enviornment.ts";

const enviornment = createGlobalEnviorment()
const Flags = ProcessFlags(Deno.args)

if (Flags["-v"]){ console.log("Current Soup Version :", 0.1); Deno.exit() }
if (!Flags[".sp"]) { RunFromConsole(Flags["-constants:"], enviornment) }
if (Flags[".sp"]) {

    RunInterpreter(Flags["-constants:"], enviornment)
    RunInterpreter(Deno.readTextFileSync(Flags["file"]), enviornment)
}
const TOKENS = Tokenize(Deno.readTextFileSync(Flags["file"]).split(""))
const e = new Parser();
const ASTTREE = e.produceAST(Deno.readTextFileSync(Flags["file"]).split(""))

if (Flags[".sp"] && Flags["-tk"]) { Deno.writeTextFileSync(Flags["file"].replaceAll(".sp", ".tokens.json"), JSON.stringify(TOKENS, null, 3)); }
if (Flags[".sp"] && Flags["-tr"]) { Deno.writeTextFileSync(Flags["file"].replaceAll(".sp", ".ast_tree.json"), JSON.stringify(ASTTREE, null, 3)); }