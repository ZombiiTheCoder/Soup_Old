// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { RuntimeValue, NullValue, MAKE_STRING, StringValue, getType, MAKE_NULL, NumeralValue, MAKE_NUMBER } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_toInt(enviornment: Enviornment){
    return func("toInt", (args: RuntimeValue[], _scope: Enviornment)=>{

        if (args.length > 1){
            throw "Cannot Convert More Than One Argument To Int"
        }

        return MAKE_NUMBER(parseFloat((args[0] as StringValue).value))

    }, enviornment)
}