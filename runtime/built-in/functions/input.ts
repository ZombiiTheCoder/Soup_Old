// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { RuntimeValue, NullValue, MAKE_STRING, StringValue, getType, MAKE_NULL } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_input(enviornment: Enviornment){
    return func("input", (args: RuntimeValue[], _scope: Enviornment)=>{

        if (args.length > 1){
            throw "Cannot Prompt More Than One Argument"
        }
        let o;
        if(args[0].type == "String"){
            try {
                const out = prompt((args[0] as StringValue).value)
                if (typeof out == "string"){
                    o = MAKE_STRING(out.trim())
                }else{
                    o = MAKE_NULL()
                }
            } catch (error) {
                o = MAKE_STRING("ERROR")
            }
        }else{
            console.error(`String Is Required For This Function Not ${getType(args[0])} => input(${(args[0] as NullValue).value})`)
            o = MAKE_STRING("ERROR")
        }
                
        return o;

    }, enviornment)
}