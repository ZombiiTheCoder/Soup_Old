// deno-lint-ignore-file
import { DeclareGlobal } from "./built-in/init.ts";
import { RuntimeValue } from "./values.ts";

export function createGlobalEnviorment(parent?: Enviornment) {

    const enviornment=DeclareGlobal(parent)

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