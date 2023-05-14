// deno-lint-ignore-file
import Enviornment from "../../enviornment.ts";
import { RuntimeValue, MAKE_NUMBER, NumeralValue } from "../../values.ts";
import { func } from "../declare.ts";

export function fn_getRandom(enviornment: Enviornment){
    return func("getRandom", (args: RuntimeValue[], _scope: Enviornment)=>{
        
        const values = new Array<any>
            for (let i = 0; i<args.length; i++){
                const v = (args[i] as NumeralValue).value.toString()
                values.push(parseFloat(v))
            }
            const random = Math.ceil(Math.random() * (values[0] - values[1]) + values[1])
            return MAKE_NUMBER(random)

    }, enviornment)
}