// deno-lint-ignore-file
import { FunctionDeclaration, Identifier, Program, StringDeclaration, VariableDeclaration, IfStatement, BlockStatement, WhileStatement } from "../../parser/ast.ts";
import Enviornment, { createGlobalEnviorment } from "../enviornment.ts";
import { evaluate } from "../interpreter.ts";
import { BooleanValue, FunctionValue, MAKE_NULL, NumeralValue, RuntimeValue, StringValue, isTrue } from "../values.ts";

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

export function evaluate_block_statement(Block: BlockStatement, enviornment: Enviornment): RuntimeValue {
    
    const newEnviornment = createGlobalEnviorment(enviornment);
    
    for (const Statement of Block.body){
        evaluate(Statement, newEnviornment)
    }
    
    return MAKE_NULL() as RuntimeValue
}

export function evaluate_if_statement(ifs: IfStatement, enviornment: Enviornment): RuntimeValue {
    const condition = evaluate(ifs.condition, enviornment)
    if (isTrue(condition)) {
        evaluate(ifs.consequent, enviornment)
    } else {
        if (ifs.alternate) {
            evaluate(ifs.alternate, enviornment)
        }
    }

    return MAKE_NULL() as RuntimeValue
}

export function evaluate_while_statement(ifs: WhileStatement, enviornment: Enviornment): RuntimeValue {
    let condition = evaluate(ifs.condition, enviornment)

    while (isTrue(condition)) {
        condition=evaluate(ifs.condition, enviornment)
        evaluate(ifs.consequent, enviornment)
    }

    return MAKE_NULL() as RuntimeValue
}