import Parser from "./parser/parse2.0.ts";
import Enviornment from "./runtime/enviornment.ts";
import { evaluate } from "./runtime/interpreter.ts";

export function RunInterpreter(filecontents: string, enviornment:Enviornment){

    const src = filecontents.split("");
    const parser = new Parser();
    // const Tokens = Tokenize(src)
    const AstTree = parser.produceAST(src)
    return evaluate(AstTree, enviornment)

}