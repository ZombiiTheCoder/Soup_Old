// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { RuntimeValue, MAKE_STRING } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_getCurrentDate(enviornment: Enviornment){
    return func("getCurrentDate", (_args: RuntimeValue[], _scope: Enviornment)=>{
        
        const q = new Date
        return MAKE_STRING(`${q.getFullYear()}/${q.getMonth()+1}/${q.getDay()+1}`)

    }, enviornment)
}