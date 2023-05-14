// deno-lint-ignore-file
import { IsNumerical } from "../../../lexer/tokens.ts";
import Enviornment from "../../enviornment.ts";
import { NullValue, RuntimeValue, NumeralValue, MAKE_NUMBER } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_negatate(enviornment: Enviornment){
    return func("negatate", (args: RuntimeValue[], _scope: Enviornment)=>{
        
        let value;
            if (args.length > 1){
                throw "Cannot Invert More Than One Value In Return"
            }
            if (IsNumerical(`${(args[0] as NullValue).value}`)){
                value = parseFloat((args[0] as NumeralValue).value.toString())
                value = value * -1

            }else{
                throw `Value is Not a Number ${(args[0] as NullValue).value}`
            }
            return MAKE_NUMBER(value)

    }, enviornment)
}