import { Tokenize } from "./lexer/lexer.ts";
import Parser from "./parser/parser.ts";
import Enviornment from "./runtime/enviornment.ts";
import { evaluate } from "./runtime/interpreter.ts";
import { MK_NUMBER, MK_NULL, MK_BOOl } from "./runtime/values.ts";

let filecontents = ""
let loop = true

const enviornment = new Enviornment()
enviornment.declareVariable("ver", MK_NUMBER(0.1), true)
enviornment.declareVariable("true", MK_BOOl(true), true)
enviornment.declareVariable("false", MK_BOOl(false), true)
enviornment.declareVariable("null", MK_NULL(), true)

let asttree = false
let tokens = false
if (Deno.args.length < 1){ console.log("\nSoup v0.1"); }
if (Deno.args.length > 1){
    for (let index = 0; index < Deno.args.length-1; index++) {
        const element = Deno.args[index+1];

        if (element == "-tr"){ asttree = true }
        if (element == "-tk"){ tokens = true }
        if (element == "-v" || element == "-ver" || element == "-version"){ console.log("Current Soup Version :", 0.1)}
        
    }
} 

while (loop) {
    if (Deno.args.length < 1){
        filecontents = prompt("> ") || "";
        // Check for no user input or exit keyword.
        if (!filecontents || filecontents.includes("exit")) {
            Deno.exit(1);
        }
    }else{
        loop=false
        filecontents = Deno.readTextFileSync(Deno.args[0]);
    }

    const src = filecontents.split("");
    const parser = new Parser();
    const Tokens = Tokenize(src)
    const program = parser.produceAST(src)



    if (Deno.args.length > 0){
        if (tokens) { Deno.writeTextFileSync(Deno.args[0].replaceAll(".sp", ".tokens.json"), JSON.stringify(Tokens, null, 3)); }
        if (asttree) { Deno.writeTextFileSync(Deno.args[0].replaceAll(".sp", ".ast_tree.json"), JSON.stringify(program, null, 3)); }
    }

    console.log(evaluate(program, enviornment))
}