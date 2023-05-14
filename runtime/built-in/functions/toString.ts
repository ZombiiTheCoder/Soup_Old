// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { RuntimeValue, NullValue, MAKE_STRING, StringValue, getType, MAKE_NULL } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_toString(enviornment: Enviornment){
    return func("toString", (args: RuntimeValue[], _scope: Enviornment)=>{

        if (args.length > 1){
            throw "Cannot Stringifiy More Than One Argument"
        }

        return MAKE_STRING((args[0] as StringValue).value.toString())

    }, enviornment)
}