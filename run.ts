import { removeComments } from "./commentReducer.ts";
import Parser from "./parser/parser.ts";
import Enviornment from "./runtime/enviornment.ts";
import { evaluate } from "./runtime/interpreter.ts";

export function RunInterpreter(filecontents: string, enviornment:Enviornment){

    const src = removeComments(filecontents);
    const parser = new Parser();
    // const Tokens = Tokenize(src)
    const AstTree = parser.produceAST(src)
    return evaluate(AstTree, enviornment)

}