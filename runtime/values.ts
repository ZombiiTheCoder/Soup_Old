import { Statement } from "../parser/ast.ts";
import Enviornment from "./enviornment.ts";

export type ValueTypes = "Null" | "Numeral" | "Boolean" | "Object" | "Native-Function" | "Function";

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
export interface ObjectValue extends RuntimeValue {
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

export function MAKE_NATIVE_FUNCTION(call: FunctionCall) {
    return { type: "Native-Function", call } as NativeFunctionValue
}