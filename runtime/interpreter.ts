// deno-lint-ignore-file
import { RuntimeValue, NullValue, NumeralValue, MAKE_NULL, StringValue } from "./values.ts";
import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression, ObjectLiteral, CallExpression, FunctionDeclaration, BooleanExpression, StringDeclaration, IfStatement, BlockStatement, WhileStatement } from "../parser/ast.ts";
import Enviornment from "./enviornment.ts";
import { evaluate_assignment, evaluate_binary_expression, evaluate_boolean_expression, evaluate_call_expression, evaluate_identifier, evaluate_object_expression } from "./evaluate/expressions.ts";
import { evaluate_block_statement, evaluate_function_declaration, evaluate_if_statement, evaluate_program, evaluate_string_declaration, evaluate_variable_declaration, evaluate_while_statement } from "./evaluate/statements.ts";

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

        case "BooleanExpression":
            return evaluate_boolean_expression(astNode as BooleanExpression, enviornment)

        case "Program":
            return evaluate_program(astNode as Program, enviornment)

        case "VariableDeclaration":
            return evaluate_variable_declaration(astNode as VariableDeclaration, enviornment)

        case "ObjectLiteral":
            return evaluate_object_expression(astNode as ObjectLiteral, enviornment)

        case "CallExpression":
            return evaluate_call_expression(astNode as CallExpression, enviornment)

        case "FunctionDeclaration":
            return evaluate_function_declaration(astNode as FunctionDeclaration, enviornment)

        case "StringDeclaration":
            return evaluate_string_declaration(astNode as StringDeclaration, enviornment)

        case "IfStatement":
            return evaluate_if_statement(astNode as IfStatement, enviornment)

        case "WhileStatement":
            return evaluate_while_statement(astNode as WhileStatement, enviornment)

        case "BlockStatement":
            return evaluate_block_statement(astNode as BlockStatement, enviornment)

        // case "MemberExpression":
        //     return evaluate_member_expression(astNode as CallExpression, enviornment)

        default:
            console.error("This Node Does Not Exist Or Has Not Been Setup In Interpreter ", astNode)
            Deno.exit(1)

    }

}