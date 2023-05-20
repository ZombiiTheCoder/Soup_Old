// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { NullValue, MAKE_NULL, RuntimeValue, ToValue } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_print(enviornment: Enviornment){
    return func("print", (args: RuntimeValue[], _scope: Enviornment)=>{
        
        const values = new Array<any>
            for (let i = 0; i<args.length; i++){
                values.push(ToValue(args[i]))
                // (args[i] as NullValue).value
            }
            // alert(JSON.stringify(values))
            console.log(...values)
        return MAKE_NULL()

    }, enviornment)
}