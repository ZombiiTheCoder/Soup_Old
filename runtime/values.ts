// deno-lint-ignore-file
// deno-lint-ignore-file no-case-declarations
import { Expression, FunctionDeclaration, Identifier, ObjectLiteral, Property, Statement, StringDeclaration } from "../parser/ast.ts";
import Enviornment from "./enviornment.ts";

export type ValueTypes = 
| "Null"
| "Numeral"
| "Boolean"
| "Object"
| "Native-Function"
| "Function"
| "String"

export interface RuntimeValue {
    type: ValueTypes;
}

export interface NullValue extends RuntimeValue {
    type: "Null"
    value: null;
}

export interface NumeralValue extends RuntimeValue {
    type: "Numeral"
    value: number;
}

export interface BooleanValue extends RuntimeValue {
    type: "Boolean"
    value: boolean;
}

export interface StringValue extends RuntimeValue {
    type: "String"
    value: string;
}

export interface ObjectValue extends RuntimeValue {
    type: "Object",
    properties: Map<string, RuntimeValue>;
}

export interface MemberValue extends RuntimeValue {
    type: "Object",
    properties: Map<string, RuntimeValue>;
}

export type FunctionCall = (arumentz: RuntimeValue[], enviornment: Enviornment) => RuntimeValue;

export interface NativeFunctionValue extends RuntimeValue {
    type: "Native-Function";
    call: FunctionCall;
}

export interface FunctionValue extends RuntimeValue {
    type: "Function",
    name: string,
    parameters: string[],
    declarationEnviornment: Enviornment,
    body: Statement[],
}

export function MAKE_NUMBER(n=0) {
    return { type: "Numeral", value: n } as NumeralValue
}

export function MAKE_NULL() {
    return { type: "Null", value: null } as NullValue
}

export function MAKE_BOOl(b=true) {
    return { type: "Boolean", value: b } as BooleanValue
}

export function MAKE_STRING(str="") {
    return { type: "String", value: str } as StringValue
}

export function MAKE_NATIVE_FUNCTION(call: FunctionCall) {
    return { type: "Native-Function", call } as NativeFunctionValue
}

export function getType(f: RuntimeValue){

    switch (f.type){
        case "Null":
            return "Null"
        case "Numeral":
            return "Number"
        case "Boolean":
            return "Boolean"
        case "Object":
            return "Object"
        case "Native-Function":
            return "Native_function"
        case "Function":
            return "Function"
        case "String":
            return "String"
    }

}

export function isTrue(condition: RuntimeValue): boolean{
    switch (condition.type){
        case "Null":
            return false
        case "Numeral":
            if ((condition as NumeralValue).value != 0){
                return true
            }else {
                return false
            }
        case "Boolean":
            return (condition as BooleanValue).value
        case "Native-Function":
            return true
        case "Function":
            return true
        case "String":
            if ((condition as StringValue).value.trim() != ""){
                return true
            }else{
                return false
            }

        default:
            return false
    }
}

// deno-lint-ignore no-explicit-any
export function ToValue(t: any){

    switch (t.type) {
        case "Null":
            return null
        case "Numeral":
            return (t as NumeralValue).value
        case "Boolean":
            return (t as BooleanValue).value
        case "String":
            return (t as StringValue).value
        case "Object":
            interface SuperObj {
                [key: string]: any;
              }
        
            const obj: SuperObj = {};

            for (const property of (t as ObjectValue).properties) {
                obj[property[0]] = ToValue(property[1]);
            }

            // console.log(obj)

            return obj;
            
        case "Native-Function":
            return `Function: Native(any){ The Natives }`
        case "Function":
            return (`Soup: ${(t as FunctionDeclaration).name} (${((t as FunctionDeclaration).parameters).join(" ")}) { The Non Natives }}`)
    
        // default:
            // return MAKE_NULL()
    }

}