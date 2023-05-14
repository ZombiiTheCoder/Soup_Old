// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { RuntimeValue, MAKE_NUMBER, NumeralValue, BooleanValue, MAKE_BOOl, MAKE_NULL, NullValue, MAKE_STRING, StringValue } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_return(enviornment: Enviornment){
    return func("return", (args: RuntimeValue[], _scope: Enviornment)=>{

        if (args.length > 1){
            throw "Cannot Return More Than One Value In Return"
        }
        let o:RuntimeValue = MAKE_NULL();
        switch (args[0].type) {

            case "Null":
                o = MAKE_NULL()

            case "Numeral":
                o = MAKE_NUMBER((args[0] as NumeralValue).value)

            case "Boolean":
                o = MAKE_BOOl((args[0] as BooleanValue).value)

            case "String":
                o = MAKE_STRING((args[0] as StringValue).value)

        }

    return o

    }, enviornment)
}