import { Tokenize } from "./lexer/lexer.ts";
import Parser from "./parser/parser.ts";

const filecontents = Deno.readTextFileSync(Deno.args[0]);
const src = filecontents.split("");
const parser = new Parser();
const Tokens = Tokenize(src)

for (let index = 0; index < Tokens.length; index++) {
    const item = Tokens[index];
    console.log("Value: '"+item.T_Value + "' Token: " + item.T_Type);
    
}

const program = parser.produceAST(src)
console.log(program)

Deno.writeTextFileSync(Deno.args[0].replaceAll(".sp", ".tokens.json"), JSON.stringify(Tokens, null, 3));
Deno.writeTextFileSync(Deno.args[0].replaceAll(".sp", ".ast_tree.json"), JSON.stringify(program, null, 3));