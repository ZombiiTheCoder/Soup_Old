// deno-lint-ignore-file
import { NumericLiteral } from "../parser/ast.ts";
import { MAKE_BOOl, MAKE_NATIVE_FUNCTION, MAKE_NULL, MAKE_NUMBER, NullValue, NumeralValue, RuntimeValue } from "./values.ts";

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