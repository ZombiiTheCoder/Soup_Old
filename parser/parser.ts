// deno-lint-ignore-file no-case-declarations
import { Statement, Program, Expression, BinaryExpression, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpression, Property, ObjectLiteral } from "./ast.ts";
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
            
            default:
                return this.parse_expression();
        }
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
        let left = this.parse_primary_expression();

        while (this.at().T_Value == "*" || this.at().T_Value == "%" || this.at().T_Value == "/") {
            const operator = this.advance().T_Value;
            const right = this.parse_primary_expression();
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
}