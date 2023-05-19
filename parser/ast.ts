export type NodeType = 
    // Statements    
    | "Program"
    | "VariableDeclaration"
    | "FunctionDeclaration"
    | "StringDeclaration"
    | "IfStatement"
    | "WhileStatement"
    | "BlockStatement"
    
    // Expressions
    | "CallExpression"
    | "MemberExpression"
    | "BinaryExpression"
    | "AssignmentExpression"
    | "BooleanExpression"
    | "IfRetExpression"
    
    // Literals
    | "Property"
    | "Identifier"
    | "ObjectLiteral"
    | "NumericLiteral"

export interface Statement {
    kind: NodeType;
}

export interface BlockStatement extends Statement{
    kind: "BlockStatement",
    body: Statement[];
}

export interface Program extends Statement{
    kind: "Program",
    body: Statement[];
}

export interface VariableDeclaration extends Statement{
    kind: "VariableDeclaration",
    constant: boolean,
    identifier: string,
    value?: Expression;
}

// deno-lint-ignore no-empty-interface
export interface Expression extends Statement{}


export interface AssignmentExpression extends Expression {
    kind: "AssignmentExpression",
    assigne: Expression,
    value: Expression;
}

export interface BinaryExpression extends Expression{
    kind: "BinaryExpression",
    left: Expression,
    right: Expression,
    operator: string;
}

export interface BooleanExpression extends Expression{
    kind: "BooleanExpression",
    left: Expression,
    right: Expression,
    operator: string;
}

export interface Identifier extends Expression{
    kind: "Identifier",
    symbol: string;
}

export interface StringDeclaration extends Expression{
    kind: "StringDeclaration",
    value: string;
}

export interface NumericLiteral extends Expression{
    kind: "NumericLiteral",
    value: number;
}

export interface Property extends Expression{
    kind: "Property",
    key: string,
    value?: Expression
}

export interface ObjectLiteral extends Expression{
    kind: "ObjectLiteral",
    properties: Property[]
}

export interface CallExpression extends Expression{
    kind: "CallExpression",
    argumentz: Expression[],
    caller: Expression,
}

export interface MemberExpression extends Expression{
    kind: "MemberExpression",
    object: Expression,
    property: Expression,
    computed: boolean;
}

export interface FunctionDeclaration extends Expression{
    kind: "FunctionDeclaration",
    parameters: string[],
    name: string,
    body: Statement[];
}

export interface IfStatement extends Statement{
    kind: "IfStatement",
    condition: Expression,
    consequent: BlockStatement,
    alternate?: BlockStatement;
}

export interface WhileStatement extends Expression{
    kind: "WhileStatement",
    condition: Expression,
    consequent: BlockStatement
}