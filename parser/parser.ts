// deno-lint-ignore-file
// deno-lint-ignore-file no-case-declarations
import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression, Property, ObjectLiteral, CallExpression, MemberExpression, FunctionDeclaration } from "./ast.ts";
import { Tokenize } from "../lexer/lexer.ts";
import { Token, TokenTypes } from "../lexer/tokens.ts";

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].T_Type != TokenTypes.EOF;
    }

    private at(){
        return this.tokens[0] as Token
    }

    private advance(){
        const prev = this.tokens.shift() as Token;
        return prev
    }

    // deno-lint-ignore no-explicit-any
    private expect(type: TokenTypes, error: any){
        const prev = this.tokens.shift() as Token;
        if (!prev || prev.T_Type != type){
            console.error("Parse Error:\n", error, JSON.stringify(prev), " - Expecting: ", type)
            Deno.exit(2)
        }
        return prev
    }

    // private next(){
    //     let prev = this.tokens[this.ip-1] as Token;
    //     if (prev == undefined){
    //         prev = this.tokens[this.ip] as Token;
    //     }
    //     return prev
    // }

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
                console.log(argument);
                throw "Inside Function Declaration parameters were not string"
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

    private parse_variable_declaration(): Statement {
        const isConstant = this.advance().T_Type == TokenTypes.Def;
        const identifier = this.expect(
            TokenTypes.Identifier,
            "Expected Variable Name for the setting of the variable"
            ).T_Value;
        
            if (this.at().T_Type == TokenTypes.Semicolon) {
                this.advance()
                if (isConstant){
                    throw "Value Must Be Assigned to Def Statement"
                }

                return {
                    kind: "VariableDeclaration",
                    identifier,
                    constant: false,
                } as VariableDeclaration
            }

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


            if (this.advance().T_Type == TokenTypes.Semicolon){}
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
        let left = this.parse_multiplicative_expression();

        while (this.at().T_Value == "+" || this.at().T_Value == "-") {
            const operator = this.advance().T_Value;
            const right = this.parse_multiplicative_expression();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator,
            } as BinaryExpression

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
    
    private parse_primary_expression(): Expression {
        const tkn = this.at().T_Type;
        
        switch (tkn){
            case TokenTypes.Identifier:
                return { kind: "Identifier", symbol: this.advance().T_Value } as Identifier;
                
            case TokenTypes.Numeral:
                return { kind: "NumericLiteral", value: parseFloat(this.advance().T_Value) } as NumericLiteral;
                    
            case TokenTypes.LParen:
                this.advance();
                const value = this.parse_expression();
                this.expect(
                    TokenTypes.RParen,
                    "Unworthy token found inside parenthesised expression. Expected closing parenthesis"
                )
                return value;

            default:
                console.error("Token That Cannot Be Handeled found during Parsing -> { "+JSON.stringify(this.at())+" }")
                Deno.exit(3)
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
        this.expect(TokenTypes.RParen, "Arguments List Was Not Closed");
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
                property = this.parse_primary_expression();

                if (property.kind != "Identifier"){
                    
                    throw `Cannot use period without right side being an identifier`
                    
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

        return object;
    }
}