// deno-lint-ignore-file
import { ProcessFlags } from "../Console.ts";
import { Tokenize } from "../lexer/lexer.ts";
import { Token, TokenTypes } from "../lexer/tokens.ts";
import { AssignmentExpression, BinaryExpression, BooleanExpression, CallExpression, Expression, FunctionDeclaration, Identifier, MemberExpression, NumericLiteral, ObjectLiteral, Program, Property, Statement, StringDeclaration, VariableDeclaration, IfStatement, BlockStatement, WhileStatement } from "./ast.ts";

export default class Parser {
    private Flags = ProcessFlags(Deno.args);
    private tokens: Token[] = [];
    private ip: number = 0;
    
    private expect(type: TokenTypes, error: any){
        this.ip++
        const prev = this.tokens[this.ip-1] as Token;
        // console.log(prev)

        if (!prev || prev.T_Type != type){
            console.error("Parse Error:\n", error, JSON.stringify(prev), " - Expecting: ", type)
            if (!this.Flags["-ig_parser"]) { Deno.exit(2) }
        }
        return prev
    }

    private not_eof(): boolean {
        return this.tokens[this.ip].T_Type != TokenTypes.EOF;
    }
    
    private at(){
        return this.tokens[this.ip] as Token
    }
    
    private advance(){
        this.ip++
        const prev = this.tokens[this.ip-1] as Token;
        // console.log(prev)
        return prev
    }

    public produceAST (chars: string[]): Program {

        this.tokens = Tokenize(chars)
        const program: Program = {
            kind: "Program",
            body: []
        }

        while (this.not_eof()){
            program.body.push(this.parse_statement())
        }

        return program

    }

    private parse_statement(): Statement {

        switch (this.at().T_Type) {
            case TokenTypes.Mal:
            case TokenTypes.Def:
                return this.parse_variable_declaration();
            case TokenTypes.Soup:
                return this.parse_function_declaration();
            case TokenTypes.if:
                return this.parse_if_statement()
            case TokenTypes.while:
                return this.parse_while_statement()
            case TokenTypes.LBrace:
                return this.parse_block_statement()
            
            default:
                return this.parse_expression();
        }
    }
    
    private parse_function_declaration(): Statement {
        this.advance();
        const name = this.expect(TokenTypes.Identifier, "Expected name for Soupy function").T_Value
        const argumentz = this.parse_arguments();
        const parameters: string[] = [];
        for (const argument of argumentz) {
            if (argument.kind !== "Identifier") {
                // console.log(argument);
                if (!this.Flags["-ig_parser"]) { throw "Inside Function Declaration parameters were not string" }
            }

            parameters.push((argument as Identifier).symbol)
        }

        const body: Statement[] = [];

        this.expect(TokenTypes.LBrace, "Expected body of function")

        while (this.at().T_Type !== TokenTypes.EOF && this.at().T_Type !== TokenTypes.RBrace){
            body.push(this.parse_statement())
        }
        this.expect(TokenTypes.RBrace, "Closing Brace expected inside function")

        const func = {
            kind: "FunctionDeclaration",
            parameters,
            name,
            body,
        } as FunctionDeclaration

        return func;
    }

    private parse_block_statement(): BlockStatement {
        let Statements: Statement[] = []
        this.expect(TokenTypes.LBrace, "Expected Opening Brace For The Block")
        
        while (this.not_eof() && this.at().T_Type != TokenTypes.RBrace){
            Statements.push(this.parse_statement())
        }

        this.expect(TokenTypes.RBrace, "Expected Closing Brace For The Block")

        const block = {
            kind: "BlockStatement",
            body: Statements
        } as BlockStatement

        return block
        
    }

    private parse_if_statement(): Statement {
        this.advance()
        this.expect(TokenTypes.LParen, "Expected Open Paren for if Statement")
        const condition = this.parse_statement()
        this.expect(TokenTypes.RParen, "Expected Closed Paren for if Statement")

        const consequent = this.parse_block_statement()
        
        let alternate: undefined | BlockStatement
        if (this.at().T_Type == TokenTypes.else) {
            this.advance()
            alternate = this.parse_block_statement()
        }
        
        const ifs = {
            kind: "IfStatement",
            condition,
            consequent,
            alternate
        } as IfStatement

        return ifs;
    }

    private parse_while_statement(): Statement {
        this.advance()
        this.expect(TokenTypes.LParen, "Expected Open Paren for while Statement")
        const condition = this.parse_statement()
        this.expect(TokenTypes.RParen, "Expected Closed Paren for while Statement")

        const consequent = this.parse_block_statement()
        
        const whilee = {
            kind: "WhileStatement",
            condition,
            consequent,
        } as WhileStatement

        return whilee;
    }

    private parse_variable_declaration(): Statement {

        const isConstant = this.advance().T_Type == TokenTypes.Def;
        const identifier = this.expect(
            TokenTypes.Identifier,
            "Expected Variable Name for the setting of the variable"
        ).T_Value;
    
        this.expect(
            TokenTypes.Equals,
            "Expected Equals Sign Following The Variable Name Provided"
        )

            const Declaration = {
                kind: "VariableDeclaration",
                value: this.parse_expression(),
                identifier,
                constant: isConstant,
            } as VariableDeclaration;


            // if (this.advance().T_Type == TokenTypes.Semicolon){}
            // this.expect(
            //     TokenTypes.Semicolon,
            //     "Semi Colon Was Expected After Variable Being Set"
            // )

            return Declaration;

    }

    private parse_expression(): Expression {
        return this.parse_assignment_expression();
    }

    private parse_assignment_expression(): Expression {
        const left = this.parse_object_expression();
        
        if (this.at().T_Type == TokenTypes.Equals) {
            this.advance()
            const value = this.parse_assignment_expression();
            return { kind: "AssignmentExpression", assigne: left, value } as AssignmentExpression
        }


        return left;
    }

    private parse_object_expression() {
        if (this.at().T_Type !== TokenTypes.LBrace) {
            return this.parse_additive_expression();
        }

        this.advance()
        const properties = new Array<Property>();

        while (this.not_eof() && this.at().T_Type != TokenTypes.RBrace){

            const key = this.expect(TokenTypes.Identifier, "Key For Object Expected").T_Value;

            if (this.at().T_Type == TokenTypes.Comma) {
                this.advance()
                properties.push({kind:"Property", key} as Property)
                continue;
            } else if (this.at().T_Type == TokenTypes.RBrace) {
                properties.push({kind:"Property", key})
                continue;
            
            }

            this.expect(TokenTypes.Colon, "Missing Colon following the key")
            const value = this.parse_expression();

            properties.push({kind:"Property", key, value});
            if (this.at().T_Type != TokenTypes.RBrace){
                this.expect(
                    TokenTypes.Comma,
                    "Comma Need or Closing Brace Following Value"
                )
            }


        }

        this.expect(TokenTypes.RBrace, "Object Missing Closing Brace")
        return { kind:"ObjectLiteral", properties } as ObjectLiteral;
    }
    
    private parse_additive_expression(): Expression {
        let left = this.parse_boolean_expression();

        while (this.at().T_Value == "+" || this.at().T_Value == "-") {
            const operator = this.advance().T_Value;
            const right = this.parse_boolean_expression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression

        }

        return left;
    }
    
    private parse_boolean_expression() {
        let left = this.parse_multiplicative_expression();

        while (
            this.at().T_Value == "==" ||
            this.at().T_Value == "!=" ||
            this.at().T_Value == "===" ||
            this.at().T_Value == "!==" ||
            this.at().T_Value == "<" ||
            this.at().T_Value == ">") {
            const operator = this.advance().T_Value;
            const right = this.parse_multiplicative_expression();
            left = {
                kind: "BooleanExpression",
                left,
                right,
                operator,
            } as BooleanExpression

        }

        return left;
    }

    private parse_multiplicative_expression(): Expression {
        
        let left = this.parse_call_member_expression();

        while (this.at().T_Value == "*" || this.at().T_Value == "%" || this.at().T_Value == "/") {
            const operator = this.advance().T_Value;
            const right = this.parse_call_member_expression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression

        }

        return left;
    }
    
    private parse_primary_expression() {
        const tkn = this.at().T_Type;
        switch (tkn){
            case TokenTypes.Identifier:
                return { kind: "Identifier", symbol: this.advance().T_Value } as Identifier;
                
            case TokenTypes.Numeral:
                return { kind: "NumericLiteral", value: parseFloat(this.advance().T_Value) } as NumericLiteral;
                
            case TokenTypes.string:
                return { kind: "StringDeclaration", value: this.advance().T_Value } as StringDeclaration
            
            case TokenTypes.LParen:
                this.advance();
                const value = this.parse_expression();
                this.expect(
                    TokenTypes.RParen,
                    "Unworthy token found inside parenthesised expression. Expected closing parenthesis"
                )
                return value;

            default:
                console.error(`Token That Cannot Be Handeled found during Parsing -> { ${JSON.stringify(this.at())} } at TokenNumber: ${this.ip+1}`)
                if (!this.Flags["-ig_parser"]) { Deno.exit(1) }
        }
    }

    private parse_call_member_expression() : Expression {
        
        const member = this.parse_member_expression();

        if (this.at().T_Type == TokenTypes.LParen) {
            return this.parse_call_expression(member)
        }

        return member;
    }

    private parse_call_expression(caller: Expression) : Expression  {
        let call_expression: Expression = {
            kind: "CallExpression",
            caller,
            argumentz: this.parse_arguments(),
        } as CallExpression;

        if (this.at().T_Type == TokenTypes.LParen){
            call_expression == this.parse_call_expression(call_expression);
        }

        return call_expression
    }

    private parse_arguments() : Expression[]  {
        this.expect(TokenTypes.LParen, "Expected Open paren")
        const argumentz = this.at().T_Type == TokenTypes.RParen ? [] : this.parse_arguments_list();
        if(this.tokens[this.ip-1].T_Type == TokenTypes.string){
            // console.log(JSON.stringify(this.advance()))
            this.expect(TokenTypes.RParen, "Arguments List Was Not Closed");
        }else{
            this.expect(TokenTypes.RParen, "Arguments List Was Not Closed");
        }
        return argumentz;
    }

    private parse_arguments_list() : Expression[] {
        const argumentz = [this.parse_expression()];

        while (this.not_eof() && this.at().T_Type == TokenTypes.Comma && this.advance()){
            argumentz.push(this.parse_assignment_expression())
        }

        return argumentz;
    }

    private parse_member_expression() : Expression {
        let object = this.parse_primary_expression();
        
        while (this.at().T_Type == TokenTypes.Period || this.at().T_Type == TokenTypes.LBracket) {
            
            const operator = this.advance();
            let property: Expression;
            let computed: boolean;

            if (operator.T_Type == TokenTypes.Period){
                computed = false;
                property = this.parse_primary_expression() as Expression;

                if (property.kind != "Identifier"){
                    
                    if (!this.Flags["-ig_parser"]) { throw `Cannot use period without right side being an identifier`}
                    
                }
            }else {
                    computed = true;
                    property = this.parse_expression();
                    
                    this.expect(TokenTypes.RBracket, "Missing closing symbol in non period value")
                    
            }
                
            object = {
                kind: "MemberExpression",
                object,
                property,
                computed
            } as MemberExpression
                 
        }

        return object  as Expression;
    }
}