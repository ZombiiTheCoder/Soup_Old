// deno-lint-ignore-file
import { RuntimeValue, NullValue, NumeralValue, MK_NULL } from "./values.ts";
import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression, ObjectLiteral } from "../parser/ast.ts";
import Enviornment from "./enviornment.ts";
import { evaluate_assignment, evaluate_binary_expression, evaluate_identifier, evaluate_object_expression } from "./evaluate/expressions.ts";
import { evaluate_program, evaluate_variable_declaration } from "./evaluate/statements.ts";

export function evaluate (astNode: Statement, enviornment: Enviornment): RuntimeValue {

    switch (astNode.kind) {

        case "NumericLiteral":
            return {
                type: "Numeral",
                value: ((astNode as NumericLiteral).value),
            } as NumeralValue;

        case "Identifier":
            return evaluate_identifier(astNode as Identifier, enviornment)

        case "AssignmentExpression":
            return evaluate_assignment(astNode as AssignmentExpression, enviornment)

        case "BinaryExpression":
            return evaluate_binary_expression(astNode as BinaryExpression, enviornment)

        case "Program":
            return evaluate_program(astNode as Program, enviornment)

        case "VariableDeclaration":
            return evaluate_variable_declaration(astNode as VariableDeclaration, enviornment)

        case "ObjectLiteral":
            return evaluate_object_expression(astNode as ObjectLiteral, enviornment)
    
        default:
            console.error("This Node Does Not Exist Or Has Not Been Setup In Interpreter ", astNode)
            Deno.exit(1)

    }

}