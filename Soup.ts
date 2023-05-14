import { ProcessFlags, RunFromConsole } from "./Console.ts";
import { Tokenize } from "./lexer/lexer.ts";
import Parser from "./parser/parser.ts";
import { RunInterpreter } from "./run.ts";
import { createGlobalEnviorment } from "./runtime/enviornment.ts";

const enviornment = createGlobalEnviorment()

// throw Deno.args;
const Flags = ProcessFlags(Deno.args)

if (Flags["-v"]){ console.log("Current Soup Version :", 0.1); Deno.exit() }
if (Flags["help"] || Flags["-help"]){
    console.log(`
    {file}.sp = The Filename.sp you input intend to run
    -tk = 'Produce Tokens File'
    -tr = 'Produce Ast Tree File'
    -v = 'Get Soup Version And Ends Program'
    -ig_lexer = 'Prevents Program Closing From Errors When Throwing Lexical Errors'
    -ig_parser = 'Prevents Program Closing From Errors When Throwing Parse Errors'
    -help or help = 'Shows This help Menu'
    Recommended Format: soup.exe {file}.sp {arguments}`)

    Deno.exit(0)
}
let TOKENS
let ASTTREE
if (Flags[".soup"] && Flags["-tk"]) { TOKENS = Tokenize(Deno.readTextFileSync(Flags["file"]).split(""))}
if (Flags[".soup"] && Flags["-tk"]) { Deno.writeTextFileSync(Flags["file"].replaceAll(".soup", ".tokens.json"), JSON.stringify(TOKENS, null, 3)); }

if (!Flags[".soup"]) { RunFromConsole(Flags["-constants:"], enviornment) }
if (Flags[".soup"]) {
    RunInterpreter(Deno.readTextFileSync(Flags["file"]), enviornment)
}

const e = new Parser();
if (Flags[".soup"] && Flags["-tr"]) {ASTTREE = e.produceAST(Deno.readTextFileSync(Flags["file"]).split(""))}

if (Flags[".soup"] && Flags["-tr"]) { Deno.writeTextFileSync(Flags["file"].replaceAll(".soup", ".ast_tree.json"), JSON.stringify(ASTTREE, null, 3)); }