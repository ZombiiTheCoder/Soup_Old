using System;
using System.Collections.Generic;

namespace Lexer
{
    public static class Tokens{

        public enum TokenTypes{
            InvalidToken,
            EOF,
            //Brakets [] {} <> []
            LParen,
            RParen,
            LBrace,
            RBrace,
            LArrow,
            RArrow,
            LBracket,
            RBracket,

            //expressions, + - * / 0-9 =
            Operator,
            Numeral,
            Equals,

            //Keywords Identified, def, soup
            Identifier,
            Def,
            Soup,
        }

        public struct Token{
            public string T_Value;
            public TokenTypes T_Type;
        }

        public static List<Token> BuildToken(List<Token> tokens, string TokenValue, TokenTypes TokenType){
            List<Token> e = tokens;
            Token tkn;
            tkn.T_Value = TokenValue;
            tkn.T_Type = TokenType;
            e.Add(tkn);

            return e;
        }

        public static List<dynamic> IsKeyword(string String){
            bool o = false;
            TokenTypes t=TokenTypes.InvalidToken;
            var Keywords = new Dictionary<string, TokenTypes>(){
                {"@@Invalid", TokenTypes.InvalidToken},
                {"def", TokenTypes.Def},
                {"Soup", TokenTypes.Soup}
            };

            try{
                // o = Keywords[String];

                if (Keywords[String] != TokenTypes.InvalidToken){
                    o=true;
                    t=Keywords[String];
                }
            }catch{
                o=false;
            }


            // return o;

            List<dynamic> q = new List<dynamic>();
            q.Add(o);
            q.Add(t);

            return q;
        }

        public static bool IsAlphabetical(string charr) {

            bool tf = false;
            tf = Char.IsLetter(Convert.ToChar(charr));
            return tf;

        }

        public static bool IsNumerical(string charr) {

            bool tf = false;
            tf = Char.IsNumber(Convert.ToChar(charr));
            return tf;

        }

        public static bool IsSkippable(string charr){

            bool o = false;
            
            var SKE = new Dictionary<string, bool>(){
                {"913278480927138094780921734", false},
                {" ", true},
                {"\n", true}, // NEWLINE
                {"\t", true}, //TAB
                {"\r", true}, //EOF
            };

            try{
                o = SKE[charr];
            }catch{
                o=false;
            }

            return o;

        }

        public static bool IsOneCharToken (string charr) {

            bool o = false;

            var OCT = new Dictionary<string, bool>(){
                {"!&*!(*@&*(#&!(@*&#*(@!#@!U#*(!&@&*#)!*@#()))))",false},
                {"(",true},
                {")",true},
                {"{",true},
                {"}",true},
                {"=",true},
                {"+",true},
                {"-",true},
                {"*",true},
                {"/",true},
            };

            try{
                o = OCT[charr];
            }catch{
                o=false;
            }

            return o;

        }

    }
    
}