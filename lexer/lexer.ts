import { TokenTypes, Token, BuildToken, IsKeyword, IsAlphabetical, IsNumerical, IsOneCharToken, IsSkippable } from "./tokens.ts";

export function Tokenize(chars: string[]){

    let EOF = 0;
    let tokens = new Array<Token>;
    let ip = 0;
    while (ip <= chars.length-1){

        if (EOF){
            break;
        }

        if (IsOneCharToken(chars[ip])){

            if (chars[ip] == "("){tokens=BuildToken(tokens, chars[ip], TokenTypes.LParen);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == ")"){tokens=BuildToken(tokens, chars[ip], TokenTypes.RParen);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "{"){tokens=BuildToken(tokens, chars[ip], TokenTypes.LBrace);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "}"){tokens=BuildToken(tokens, chars[ip], TokenTypes.RBrace);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "<"){tokens=BuildToken(tokens, chars[ip], TokenTypes.LArrow);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == ">"){tokens=BuildToken(tokens, chars[ip], TokenTypes.RArrow);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "["){tokens=BuildToken(tokens, chars[ip], TokenTypes.LBracket);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "]"){tokens=BuildToken(tokens, chars[ip], TokenTypes.RBracket);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "="){tokens=BuildToken(tokens, chars[ip], TokenTypes.Equals);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "+"){tokens=BuildToken(tokens, chars[ip], TokenTypes.BinaryExpression);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "-"){tokens=BuildToken(tokens, chars[ip], TokenTypes.BinaryExpression);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "*"){tokens=BuildToken(tokens, chars[ip], TokenTypes.BinaryExpression);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "%"){tokens=BuildToken(tokens, chars[ip], TokenTypes.BinaryExpression);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "/"){tokens=BuildToken(tokens, chars[ip], TokenTypes.BinaryExpression);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            
        }else{
        
            if (IsNumerical(chars[ip])){

                let Number = "";
                while (IsNumerical(chars[ip])){
                    
                    Number += chars[ip];
                    if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}

                }
                tokens = BuildToken(tokens, Number, TokenTypes.Numeral);

            }

            if (IsAlphabetical(chars[ip])){

                let String = "";
                while (IsAlphabetical(chars[ip])){
                    String += chars[ip];
                    if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}
                }
                const tf = IsKeyword(String)[0];
                const k = IsKeyword(String)[1];
                if (tf){
                    tokens = BuildToken(tokens, String, k);
                }else{
                    tokens = BuildToken(tokens, String, TokenTypes.Identifier);
                }

            }


            if (IsSkippable(chars[ip])){
                if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}
            }

            if (!IsAlphabetical(chars[ip]) == !IsNumerical(chars[ip]) == !IsOneCharToken(chars[ip]) == !IsSkippable(chars[ip])){
                console.log("Char That Cannot Be Handeled found in src -> { "+chars[ip]+" }");
                Deno.exit(2);
            }

        }

    }

    tokens = BuildToken(tokens, "EOF", TokenTypes.EOF)

    return tokens;

}