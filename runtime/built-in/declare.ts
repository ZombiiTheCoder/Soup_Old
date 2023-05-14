// deno-lint-ignore-file
import Enviornment from "../enviornment.ts";
import { MAKE_BOOl, MAKE_NATIVE_FUNCTION, MAKE_NULL, MAKE_NUMBER, MAKE_STRING, RuntimeValue } from "../values.ts";

export function func(name: string, funct: any, enviornment:Enviornment){
    enviornment.declareVariable(
        name,
        MAKE_NATIVE_FUNCTION(
            (args, scope) => {
                return funct(args, scope)
            }
        )
    ,true)

    return enviornment
}

export function vari_const(name: string, value: any, enviornment:Enviornment){
    let o: any = MAKE_NULL();

    if (typeof value == "number") { o = MAKE_NUMBER(value) }
    if (typeof value == "string") { o = MAKE_STRING(value) }
    if (typeof value == "boolean") { o = MAKE_BOOl(value) }
    if (value == undefined || value == null) o = MAKE_NULL()
    
    enviornment.declareVariable(name, o, true)

    return enviornment
}

export function vari_let(name: string, value: any, enviornment:Enviornment){
    let o: any = MAKE_NULL();

    if (typeof value == "number") { o = MAKE_NUMBER(value) }
    if (typeof value == "string") { o = MAKE_STRING(value) }
    if (typeof value == "boolean") { o = MAKE_BOOl(value) }
    if (value == undefined || value == null) o = MAKE_NULL()
    
    enviornment.declareVariable(name, o, false)

    return enviornment
}