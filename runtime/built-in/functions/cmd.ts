// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { execSync } from "node:child_process";
import { RuntimeValue, NullValue, MAKE_STRING, StringValue, getType } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_cmd(enviornment: Enviornment){
    return func("cmd", (args: RuntimeValue[], _scope: Enviornment)=>{

        if (args.length > 1){
            throw "Cannot Proccess More Than One Argument"
        }
        let o;
        if(args[0].type == "String"){
            try {
                const out: string = execSync((args[0] as StringValue).value).toString();
                o = MAKE_STRING(out.trim())
            } catch (error) {
                o = MAKE_STRING("ERROR")
            }
        }else{
            console.error(`String Is Required For This Function Not ${getType(args[0])} => CMD(${(args[0] as NullValue).value})`)
            o = MAKE_STRING("ERROR")
        }
                
        return o;

    }, enviornment)
}