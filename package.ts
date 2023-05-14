import { RunInterpreter } from "./run.ts";  
import { createGlobalEnviorment } from "./runtime/enviornment.ts";  
const enviornment = createGlobalEnviorment()  
RunInterpreter(`$file`, enviornment)  
