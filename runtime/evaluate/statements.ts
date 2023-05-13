// deno-lint-ignore-file
import { FunctionDeclaration, Identifier, Program, StringDeclaration, VariableDeclaration } from "../../parser/ast.ts";
import Enviornment from "../enviornment.ts";
import { evaluate } from "../interpreter.ts";
import { FunctionValue, MAKE_NULL, RuntimeValue, StringValue } from "../values.ts";

export function evaluate_program(program: Program, enviornment: Enviornment): RuntimeValue{

    let lastEvaluated: RuntimeValue = MAKE_NULL();

    for (const Statement of program.body){
        lastEvaluated = evaluate(Statement, enviornment);
    }

    return lastEvaluated;

}

export function evaluate_variable_declaration(declaration: VariableDeclaration, enviornment: Enviornment): RuntimeValue {

    const value = declaration.value ? evaluate(declaration.value, enviornment) : MAKE_NULL()
    return enviornment.declareVariable(declaration.identifier, value, declaration.constant)

}

export function evaluate_function_declaration(declaration: FunctionDeclaration, enviornment: Enviornment): RuntimeValue {

    const func = {
        type: "Function",
        name: declaration.name,
        parameters: declaration.parameters,
        declarationEnviornment: enviornment,
        body: declaration.body,
    } as  FunctionValue

    return enviornment.declareVariable(declaration.name, func, true)

}

export function evaluate_string_declaration(stringr: StringDeclaration, enviornment: Enviornment): RuntimeValue {

    return ({
        type:"String",
        value: stringr.value
    } as StringValue)

}