import { AssignmentExpression, BinaryExpression, Identifier } from "../../parser/ast.ts";
import Enviornment from "../enviornment.ts";
import { evaluate } from "../interpreter.ts";
import { MK_NULL, NumeralValue, RuntimeValue } from "../values.ts";

export function evaluate_numeric_binary_expression(left: NumeralValue, right: NumeralValue, operator: string, enviornment: Enviornment): NumeralValue {
    let result = 0;
    result = left.value + right.value;
    if (operator == "+"){result = left.value + right.value;}
    if (operator == "-"){result = left.value - right.value;}
    if (operator == "*"){result = left.value * right.value;}
    if (operator == "/"){result = left.value / right.value;}
    if (operator == "%"){result = left.value % right.value;}
    
    return { type: "Numeral", value: result }
}

export function evaluate_binary_expression(binop: BinaryExpression, enviornment: Enviornment): RuntimeValue {

    const left = evaluate(binop.left, enviornment);
    const right = evaluate(binop.right, enviornment);

    if (left.type == "Numeral" && right.type == "Numeral"){
        return evaluate_numeric_binary_expression(left as NumeralValue, right as NumeralValue, binop.operator, enviornment);
    }

    return MK_NULL();
    
}

export function evaluate_assignment (node: AssignmentExpression, enviornment: Enviornment): RuntimeValue{
    if (node.assigne.kind !== "Identifier") {
        throw `Invalid Identifier ${JSON.stringify(node.assigne)}`
    }
    const variableName = (node.assigne as Identifier).symbol;
    return enviornment.assignVariable(variableName, evaluate(node.value, enviornment));

}