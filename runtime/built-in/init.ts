import { ProcessFlags } from "../../Console.ts";
import Enviornment from "../enviornment.ts";
import { vari_const } from "./declare.ts";
import { fn_cmd } from "./functions/cmd.ts";
import { fn_eval } from "./functions/eval.ts";
import { fn_eval_js } from "./functions/eval_js.ts";
import { fn_getCurrentDate } from "./functions/getCurrentDate.ts";
import { fn_getCurrentMilisecond } from "./functions/getCurrentMilisecond.ts";
import { fn_getRandom } from "./functions/getRandom.ts";
import { fn_input } from "./functions/input.ts";
import { fn_negatate } from "./functions/negatate.ts";
import { fn_print } from "./functions/print.ts";
import { fn_return } from "./functions/return.ts";
import { fn_toString } from "./functions/toString.ts";

export function DeclareGlobal(){

    // const Flags = ProcessFlags(Deno.args)

    let enviornment = new Enviornment();

    enviornment = vari_const("ver", "0.1.3", enviornment)
    enviornment = vari_const("true", true, enviornment)
    enviornment = vari_const("false", false, enviornment)
    enviornment = vari_const("null", null, enviornment)
    enviornment = vari_const("undefined", undefined, enviornment)

    enviornment = fn_eval_js(enviornment)
    enviornment = fn_getCurrentDate(enviornment)
    enviornment = fn_getCurrentMilisecond(enviornment)
    enviornment = fn_getRandom(enviornment)
    enviornment = fn_negatate(enviornment)
    enviornment = fn_print(enviornment)
    enviornment = fn_return(enviornment)
    enviornment = fn_cmd(enviornment)
    enviornment = fn_eval(enviornment)
    enviornment = fn_input(enviornment)
    enviornment = fn_toString(enviornment)

    return enviornment

}