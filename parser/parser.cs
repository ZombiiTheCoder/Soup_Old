using ast;
using System;
using System.Collections.Generic;
using Lexer;

namespace parser
{

    public class Parser {
        private List<Tokens.Token> tokens = new List<Tokens.Token>();

        private bool not_eof () {
            return this.tokens[0].T_Type != Tokens.TokenTypes.EOF;
        } 

        private Tokens.Token at(){
            return this.tokens[0];
        }

        public ast.Program produceAST(string[] sourceCode){
            this.tokens = lexer.Tokenize(sourceCode);
            var program = new ast.Program(){};
            program.Kind = "Program";
            program.Body = new List<ast.Statement>();

            while (this.not_eof){
                


            }

            return program;
        }

        private ast.Statement parser_stmt(){
            return this.parser_expr();
        }

        private ast.Expression parser_expr(){}

        private ast.Expression parser_primary_expr(){
            var tk = at().T_Type;

            switch (tk){

                case Tokens.TokenTypes.Identifier:
                    var indnt = ast.Identifier;
                    indnt.Kind = "Identifier";
                    indnt.Symbol = this.at().T_Value;
                    return indnt;
            
            }
        }
    }    

}