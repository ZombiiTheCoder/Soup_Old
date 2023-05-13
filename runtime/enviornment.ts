import { MK_BOOl, MK_NULL, MK_NUMBER, RuntimeValue } from "./values.ts";

export function createGlobalEnviorment() {
    const enviornment = new Enviornment();
    enviornment.declareVariable("ver", MK_NUMBER(0.1), true)
    enviornment.declareVariable("true", MK_BOOl(true), true)
    enviornment.declareVariable("false", MK_BOOl(false), true)
    enviornment.declareVariable("null", MK_NULL(), true)

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