import { ProcessFlags, RunFromConsole } from "./Console.ts";  
import { Tokenize } from "./lexer/lexer.ts";  
import Parser from "./parser/parser.ts";  
import { RunInterpreter } from "./run.ts";  
import { createGlobalEnviorment } from "./runtime/enviornment.ts";  
const enviornment = createGlobalEnviorment()  
RunInterpreter(`$file`, enviornment)  
