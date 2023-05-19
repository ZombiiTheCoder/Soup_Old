// deno-lint-ignore-file
import { RunInterpreter } from "../../../run.ts";
import Enviornment from "../../enviornment.ts";
import { RuntimeValue,NullValue,StringValue,MAKE_STRING, getType } from "../../values.ts";
import { func } from "../declare.ts";
import { DeclareGlobal } from "../init.ts";

export function fn_eval(enviornment: Enviornment){
    return func("eval", (args: RuntimeValue[], _scope: Enviornment)=>{
        
        let value;
        if (args.length > 1){
            throw "Cannot Evaluate More Than One Argument"
        }
        if(args[0].type == "String"){
            const env = DeclareGlobal();
            value = (RunInterpreter((args[0] as StringValue).value, env) as StringValue).value
        }else{
            console.error(`String Is Required For This Function Not ${getType(args[0])} => eval(${(args[0] as NullValue).value})`)
            value = "Error"
        }

        return MAKE_STRING(value)

    }, enviornment)
}