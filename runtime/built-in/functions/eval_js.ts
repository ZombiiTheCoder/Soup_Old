// deno-lint-ignore-file
import { IsString } from "../../../lexer/tokens.ts";
import Enviornment from "../../enviornment.ts";
import { RuntimeValue,NullValue,StringValue,MAKE_STRING, getType } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_eval_js(enviornment: Enviornment){
    return func("eval_js", (args: RuntimeValue[], _scope: Enviornment)=>{
        
        let value;
        if (args.length > 1){
            throw "Cannot Evaluate More Than One Argument"
        }
        if(args[0].type == "String"){
            value = eval((args[0] as StringValue).value)
        }else{
            console.error(`String Is Required For This Function Not ${getType(args[0])} => eval_js(${(args[0] as NullValue).value})`)
            value = "Error"
        }

        return MAKE_STRING(value)

    }, enviornment)
}