export type ValueTypes = "Null" | "Numeral" | "Boolean" | "Object";

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
    type: "Object"
    properties: Map<string, RuntimeValue>
}

export function MK_NUMBER(n=0) {
    return { type: "Numeral", value: n } as NumeralValue
}

export function MK_NULL() {
    return { type: "Null", value: null } as NullValue
}

export function MK_BOOl(b=true) {
    return { type: "Boolean", value: b } as BooleanValue
}