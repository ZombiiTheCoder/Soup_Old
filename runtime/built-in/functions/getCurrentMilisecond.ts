// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { RuntimeValue, MAKE_NUMBER } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_getCurrentMilisecond(enviornment: Enviornment){
    return func("getCurrentMilisecond", (_args: RuntimeValue[], _scope: Enviornment)=>{
        
        return MAKE_NUMBER(Date.now())

    }, enviornment)
}