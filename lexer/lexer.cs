using System;
using System.Collections.Generic;
using System.Text;
namespace Lexer
{
    public class lexer{

        public static List<Tokens.Token> Tokenize(string[] chars){
            
            List<Tokens.Token> tokens = new List<Tokens.Token>();
            int ip = 0;
            while (ip <= chars.Length-1){

                if (Tokens.IsOneCharToken(chars[ip])){

                    if (chars[ip] == "("){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.LParen);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == ")"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.RParen);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "{"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.LBrace);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "}"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.RBrace);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "<"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.LArrow);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == ">"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.RArrow);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "["){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.LBracket);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "]"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.RBracket);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "="){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.Equals);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "+"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.Operator);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "-"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.Operator);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "*"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.Operator);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    if (chars[ip] == "/"){tokens=Tokens.BuildToken(tokens, chars[ip], Tokens.TokenTypes.Operator);if (ip+1>(chars.Length-1)){break;}else{ip++;}}
                    
                }else{

                    if (Tokens.IsNumerical(chars[ip])){

                        String Number = "";
                        while (Tokens.IsNumerical(chars[ip])){
                            
                            Number += chars[ip];
                            if (ip+1>(chars.Length-1)){break;}else{ip++;}

                        }
                        tokens = Tokens.BuildToken(tokens, Number, Tokens.TokenTypes.Numeral);

                    }

                    if (Tokens.IsAlphabetical(chars[ip])){

                        string String = "";
                        while (Tokens.IsAlphabetical(chars[ip])){
                            String += chars[ip];
                            if (ip+1>(chars.Length-1)){break;}else{ip++;}
                        }
                        bool tf = Tokens.IsKeyword(String)[0];
                        Tokens.TokenTypes k = Tokens.IsKeyword(String)[1];
                        if (tf){
                            tokens = Tokens.BuildToken(tokens, String, k);
                        }else{
                            tokens = Tokens.BuildToken(tokens, String, Tokens.TokenTypes.Identifier);
                        }

                    }


                    if (Tokens.IsSkippable(chars[ip])){
                        if (ip+1>(chars.Length-1)){break;}else{ip++;}
                    }

                    if (!Tokens.IsAlphabetical(chars[ip]) == !Tokens.IsNumerical(chars[ip]) == !Tokens.IsOneCharToken(chars[ip]) == !Tokens.IsSkippable(chars[ip])){
                        Console.WriteLine("Char That Cannot Be Handeled found in src -> { "+ BitConverter.ToString(Encoding.UTF8.GetBytes("e"))+ " }");
                        Environment.Exit(2);
                    }

                }

                // if (ip == chars.Length-1){
                //     break;
                // }

            }

            tokens = Tokens.BuildToken(tokens, "EndOfFile", Tokens.TokenTypes.EOF);

            return tokens;

        }

    }
    
}