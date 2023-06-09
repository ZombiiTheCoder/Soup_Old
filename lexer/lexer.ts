import { ProcessFlags } from "../Console.ts";
import { TokenTypes, Token, BuildToken, IsKeyword, IsNumerical, IsOneCharToken, IsSkippable, IsStringSingle, IsStringDouble, IsStringSpecial, IsAlphaNumerical, IsSymbol } from "./tokens.ts";

export function Tokenize(chars: string[]){

    const Flags = ProcessFlags(Deno.args)
    
    let EOF = 0;
    let tokens = new Array<Token>;
    let ip = 0;
    function checkNext(charr: string[], ip: number){
        let o;
        try {
            o=charr[ip+1]
        }catch{
            o=charr[ip]
        }
        return o
    }
    while (ip <= chars.length-1){

        if (EOF){
            break;
        }

        if (IsOneCharToken(chars[ip])){

            if (chars[ip] == "("){tokens=BuildToken(tokens, chars[ip], TokenTypes.LParen);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == ")"){tokens=BuildToken(tokens, chars[ip], TokenTypes.RParen);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "{"){tokens=BuildToken(tokens, chars[ip], TokenTypes.LBrace);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "}"){tokens=BuildToken(tokens, chars[ip], TokenTypes.RBrace);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "<"){tokens=BuildToken(tokens, chars[ip], TokenTypes.BinaryExpression);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == ">"){tokens=BuildToken(tokens, chars[ip], TokenTypes.BinaryExpression);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
        // "==": TokenTypes.BinaryExpression,
        // "!=": TokenTypes.BinaryExpression,
        // "===": TokenTypes.BinaryExpression,
        // "!==": TokenTypes.BinaryExpression,
            if (chars[ip] == "["){tokens=BuildToken(tokens, chars[ip], TokenTypes.LBracket);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "]"){tokens=BuildToken(tokens, chars[ip], TokenTypes.RBracket);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == ";"){tokens=BuildToken(tokens, chars[ip], TokenTypes.Semicolon);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == ":"){tokens=BuildToken(tokens, chars[ip], TokenTypes.Colon);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == ","){tokens=BuildToken(tokens, chars[ip], TokenTypes.Comma);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
            if (chars[ip] == "."){tokens=BuildToken(tokens, chars[ip], TokenTypes.Period);if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}}
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

            if (IsAlphaNumerical(chars[ip])){

                let String = "";
                while (IsAlphaNumerical(chars[ip])){
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

            if (IsSymbol(chars[ip])){

                let String = "";
                while (IsSymbol(chars[ip])){
                    String += chars[ip];
                    if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}
                }
                const tf = IsKeyword(String)[0];
                const k = IsKeyword(String)[1];
                if (tf){
                    tokens = BuildToken(tokens, String, k);
                }

            }

            if (
                chars[ip].includes("'") || 
                chars[ip].includes('"') || 
                chars[ip].includes('`') 
            ){
                // deno-lint-ignore prefer-const
                let strValidate = IsStringSingle;
                if (chars[ip].includes("'")) {strValidate == IsStringSingle}
                if (chars[ip].includes('"')) {strValidate == IsStringDouble}
                if (chars[ip].includes("`")) {strValidate == IsStringSpecial}
                if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}

                let String = "";
                while (strValidate(chars[ip])){
                    String += chars[ip];
                    if (checkNext(chars, ip) == '"'){ip++; break;}
                    if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}
                }
                tokens = BuildToken(tokens, String, TokenTypes.string);

            }


            if (IsSkippable(chars[ip])){
                if (ip+1>(chars.length-1)){EOF=1; break;}else{ip++;}
            }

            if (!IsAlphaNumerical(chars[ip]) && !IsNumerical(chars[ip]) && !IsOneCharToken(chars[ip]) && !IsSkippable(chars[ip]) && !IsSymbol(chars[ip])){
                if (!Flags["-ig_lexer"]) { throw `Char That Cannot Be Handeled found in src -> ${chars[ip]}`}
            }

        }

    }

    tokens = BuildToken(tokens, "EOF", TokenTypes.EOF)

    return tokens;

}