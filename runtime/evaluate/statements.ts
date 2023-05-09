import { Identifier, Program, VariableDeclaration } from "../../parser/ast.ts";
import Enviornment from "../enviornment.ts";
import { evaluate } from "../interpreter.ts";
import { MK_NULL, RuntimeValue } from "../values.ts";

export function evaluate_program(program: Program, enviornment: Enviornment): RuntimeValue{

    let lastEvaluated: RuntimeValue = MK_NULL();

    for (const Statement of program.body){
        lastEvaluated = evaluate(Statement, enviornment);
    }

    return lastEvaluated;

}

export function evaluate_identifier (identifier: Identifier, enviornment: Enviornment): RuntimeValue {
    const value = enviornment.lookupVariable(identifier.symbol);
    return value;
}

export function evaluate_variable_declaration(declaration: VariableDeclaration, enviornment: Enviornment): RuntimeValue {

    const value = declaration.value ? evaluate(declaration.value, enviornment) : MK_NULL()
    return enviornment.declareVariable(declaration.identifier, value, declaration.constant)

}