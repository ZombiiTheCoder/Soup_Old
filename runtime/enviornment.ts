// deno-lint-ignore-file
import { IsNumerical, IsString, TokenTypes } from "../lexer/tokens.ts";
import { NumericLiteral } from "../parser/ast.ts";
import { MAKE_BOOl, MAKE_NATIVE_FUNCTION, MAKE_NULL, MAKE_NUMBER, NullValue, NumeralValue, BooleanValue, RuntimeValue, StringValue, MAKE_STRING } from "./values.ts";

export function createGlobalEnviorment() {
    const enviornment = new Enviornment();

    // Makes Native Variables
    enviornment.declareVariable("ver", MAKE_NUMBER(0.1), true)
    enviornment.declareVariable("true", MAKE_BOOl(true), true)
    enviornment.declareVariable("false", MAKE_BOOl(false), true)
    enviornment.declareVariable("null", MAKE_NULL(), true)
    enviornment.declareVariable("undefined", MAKE_NULL(), true)
    enviornment.declareVariable("nil", MAKE_NULL(), true)

    // Makes Native Functions
    enviornment.declareVariable(
        "print",
        MAKE_NATIVE_FUNCTION((argumentz, _scope) => {
            const values = new Array<any>
            for (let i = 0; i<argumentz.length; i++){
                values.push((argumentz[i] as NullValue).value)
            }
            console.log(...values)
        return MAKE_NULL()
    }), true)

    enviornment.declareVariable(
        "eval_js",
        MAKE_NATIVE_FUNCTION((argumentz, _scope) => {
            let value;
            if (argumentz.length > 1){
                throw "Cannot Evaluate More Than One Argument"
            }
            if (IsString(`${(argumentz[0] as NullValue).value}`)){
                value = eval((argumentz[0] as StringValue).value)

            }

        return MAKE_STRING(value)
    }), true)

    enviornment.declareVariable(
        "loadString",
        MAKE_NATIVE_FUNCTION((argumentz, _scope) => {
            let value;
            if (argumentz.length > 1){
                throw "Cannot Evaluate More Than One Argument"
            }
            if (IsString(`${(argumentz[0] as NullValue).value}`)){
                value = (argumentz[0] as StringValue).value

            }

        return MAKE_STRING(value)
    }), true)

    enviornment.declareVariable(
        "negatate",
        MAKE_NATIVE_FUNCTION((argumentz, _scope) => {
            let value;
            if (argumentz.length > 1){
                throw "Cannot Invert More Than One Value In Return"
            }
            if (IsNumerical(`${(argumentz[0] as NullValue).value}`)){
                value = parseFloat((argumentz[0] as NumeralValue).value.toString())
                value = value * -1

            }else{
                throw `Value is Not a Number ${(argumentz[0] as NullValue).value}`
            }
            return MAKE_NUMBER(value)
    }), true)

    enviornment.declareVariable(
        "return",
        MAKE_NATIVE_FUNCTION((argumentz, _scope) => {
            const value = (argumentz[0] as NullValue).value
            if (argumentz.length > 1){
                throw "Cannot Return More Than One Value In Return"
            }
            let o:RuntimeValue = MAKE_NULL();
            switch (argumentz[0].type) {

                case "Null":
                    o = MAKE_NULL()

                case "Numeral":
                    o = MAKE_NUMBER((argumentz[0] as NumeralValue).value)

                case "Boolean":
                    o = MAKE_BOOl((argumentz[0] as BooleanValue).value)

            }

        return o
    }), true)

    enviornment.declareVariable(
        "getRandom",
        MAKE_NATIVE_FUNCTION((argumentz, _scope) => {
            const values = new Array<any>
            for (let i = 0; i<argumentz.length; i++){
                const v = (argumentz[i] as NumeralValue).value.toString()
                values.push(parseFloat(v))
            }
            const random = Math.ceil(Math.random() * (values[0] - values[1]) + values[1])
            return MAKE_NUMBER(random)
    }), true)

    enviornment.declareVariable(
        "getCurrentMilisecond",
        MAKE_NATIVE_FUNCTION((_argumentz, _scope) => {
            return MAKE_NUMBER(Date.now())
    }), true)

    // enviornment.declareVariable(
    //     "DateIn_Years",
    //     MAKE_NATIVE_FUNCTION((_argumentz, _scope) => {
    //         const q = new Date
    //         return MAKE_STRING(`${q.getMonth}/${q.getDay()}/${q.getFullYear()+25}`)
    // }), true)

    return enviornment;
}

export default class Enviornment {

    private parent?: Enviornment;
    private variables: Map<string, RuntimeValue>;
    private constants: Set<string>;
    
    constructor (parentEnviorment?: Enviornment) {
        const global = parentEnviorment ? true : false;
        this.parent = parentEnviorment
        this.variables = new Map();
        this.constants = new Set();
    }

    public declareVariable (variableName: string, value: RuntimeValue, constant: boolean): RuntimeValue {

        if (this.variables.has(variableName)) {
            throw `Cannot decare variable ${variableName}. Because It Already Exist`
        }

        this.variables.set(variableName, value)
        if (constant){
            this.constants.add(variableName)
        }
        return value
    }

    public assignVariable (variableName: string, value: RuntimeValue) {
        const enviornment = this.resolve(variableName);
        if (enviornment.constants.has(variableName)){
            throw `Cannot Reassign Value To Def ${variableName}`
        }
        enviornment.variables.set(variableName, value);
        return value
    }

    public lookupVariable (variableName: string): RuntimeValue {
        const enviornment = this.resolve(variableName);
        return enviornment.variables.get(variableName) as RuntimeValue;
    }

    public resolve(variableName: string): Enviornment {
        if (this.variables.has(variableName)) {
            return this;
        }

        if (this.parent == undefined) {
            throw `Cannot Find ${variableName} because it does not exist.`;
        }

        return this.parent.resolve(variableName);
    }

}