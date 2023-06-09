// deno-lint-ignore-file
import { AssignmentExpression, BinaryExpression, BooleanExpression, CallExpression, Expression, Identifier, IfStatement, MemberExpression, ObjectLiteral, Property, Statement, StringDeclaration } from "../../parser/ast.ts";
import Enviornment from "../enviornment.ts";
import { evaluate } from "../interpreter.ts";
import { BooleanValue, FunctionValue, MAKE_BOOl, MAKE_NULL, MAKE_NUMBER, MAKE_STRING, NativeFunctionValue, NumeralValue, ObjectValue, RuntimeValue, isTrue } from "../values.ts";

export function evaluate_numeric_binary_expression(left: NumeralValue, right: NumeralValue, operator: string, _enviornment: Enviornment): NumeralValue {
    let result = 0;
    if (operator == "+"){result = left.value + right.value;}
    if (operator == "-"){result = left.value - right.value;}
    if (operator == "*"){result = left.value * right.value;}
    if (operator == "/"){result = left.value / right.value;}
    if (operator == "%"){result = left.value % right.value;}
    
    return { type: "Numeral", value: result }
}

export function evaluate_numeric_boolean_expression(left: any, right: any, operator: string, _enviornment: Enviornment): BooleanValue {
    let result = false;
    if (left.type == "Numeral" && right.type == "Numeral"){
        if (operator == ">"){result = (left.value > right.value);}
        if (operator == "<"){result = (left.value < right.value);}
        if (operator == "=="){result = (left.value == right.value);}
        if (operator == "!="){result = (left.value != right.value);}
        if (operator == "==="){result = (left.value === right.value);}
        if (operator == "!=="){result = (left.value !== right.value);}
    }else{
        if (operator == "=="){result = (left.value == right.value);}
        if (operator == "!="){result = (left.value != right.value);}
        if (operator == "==="){result = (left.value === right.value);}
        if (operator == "!=="){result = (left.value !== right.value);}
    }
    return { type: "Boolean", value: result }
}

export function evaluate_boolean_expression(binop: BooleanExpression, enviornment: Enviornment): RuntimeValue {

    const left = evaluate(binop.left, enviornment);
    const right = evaluate(binop.right, enviornment);

    // if (left.type == "Numeral" && right.type == "Numeral"){
        return evaluate_numeric_boolean_expression(left, right, binop.operator, enviornment);
    // }

    // return MAKE_NULL();
    
}

export function evaluate_binary_expression(binop: BinaryExpression, enviornment: Enviornment): RuntimeValue {

    const left = evaluate(binop.left, enviornment);
    const right = evaluate(binop.right, enviornment);

    if (left.type == "Numeral" && right.type == "Numeral"){
        return evaluate_numeric_binary_expression(left as NumeralValue, right as NumeralValue, binop.operator, enviornment);
    }

    return MAKE_NULL();
    
}

export function evaluate_assignment (node: AssignmentExpression, enviornment: Enviornment): RuntimeValue{
    if (node.assigne.kind !== "Identifier") {
        throw `Invalid Identifier ${JSON.stringify(node.assigne)}`
    }
    const variableName = (node.assigne as Identifier).symbol;
    return enviornment.assignVariable(variableName, evaluate(node.value, enviornment));

}

export function evaluate_identifier (identifier: Identifier, enviornment: Enviornment): RuntimeValue {
    const value = enviornment.lookupVariable(identifier.symbol);
    return value;
}

export function evaluate_object_expression (object: ObjectLiteral, enviornment: Enviornment): RuntimeValue {
    const object2 = { type:"Object", properties: new Map() } as ObjectValue
    for (const { key, value } of object.properties) {
        
        const runtimevalue = (value == undefined) ? enviornment.lookupVariable(key) : evaluate(value, enviornment)
        
        object2.properties.set(key, runtimevalue)
        
        
    }

    return object2;
}

export function evaluate_call_expression (expression: CallExpression, enviornment: Enviornment) : RuntimeValue {
    const argumentz = expression.argumentz.map((argument) => evaluate(argument, enviornment));
    const func = evaluate(expression.caller, enviornment)

    if (func.type == "Native-Function"){
        const result = (func as NativeFunctionValue).call(argumentz, enviornment)
        return result;
    }else if (func.type == "Function"){
        const funct = func as FunctionValue;
        const scope = new Enviornment(funct.declarationEnviornment);

        for (let i = 0; i < funct.parameters.length; i++) {
            const varname = funct.parameters[i]
            scope.declareVariable(varname, argumentz[i], false)
        }

        let result: RuntimeValue = MAKE_NULL();

        for (const statement of funct.body){
            result = evaluate(statement, scope)
        }

        return result;
    }else{
        throw `Invalid Function ${JSON.stringify(func)}`
    }

}

export function evaluate_member_expression (expression: MemberExpression, enviornment: Enviornment) : RuntimeValue {

    var nn = false
    var nc = false
    var keys = new Array()
    var expr: any = expression
    let nest: any
    while(!nn){

        nc = !!expr["object"] ? false : true
        if (!nc){
            expr = expr["object"]
            const p = expr["property"]
            // console.log(p)
            try{
                keys.push((p as Identifier).symbol)
            }catch{
                // keys.push()
                keys.unshift((expression["property"] as Identifier).symbol)
            }
        }else{
            const parent = evaluate(expr, enviornment)
            nest = (parent as ObjectValue)

            for (let i = 0; i < keys.length; i++) {
                if (nest.properties != undefined){
                    // console.log(nest)
                    nest = nest.properties.get(keys[(keys.length-1)-i])
                    try {
                        throw nest.properties.get((expression["property"] as Identifier).symbol).value
                    } catch {
                        nn=true
                    }
                }
            }
            nn=true
            // console.log(evaluate(expr, enviornment))
            // console.log(keys)
        }
        
    }
    
    // console.log(nest)
    const parent = evaluate(expr, enviornment)
    switch (nest.type) {
        case "Object":
            return parent
    
        default:
            return nest
    }

    return nest
    // return MAKE_STRING(nest.value)
    // return {} as RuntimeValue

}
