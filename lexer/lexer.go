package lexer

import (
	"os"
	"fmt"
)

func Tokenize(chars []string) []Token {
	var tokens []Token
	ip := 0
	for ip <= len(chars) {

		if (IsOneCharToken(chars[ip])){
			
			/* Check For OneCharTokens */
			if chars[ip] == "(" { tokens = BuildToken(tokens, chars[ip], LParen); ip++ }
			if chars[ip] == ")" { tokens = BuildToken(tokens, chars[ip], RParen); ip++ }
			if chars[ip] == "{" { tokens = BuildToken(tokens, chars[ip], LBrace); ip++ }
			if chars[ip] == "}" { tokens = BuildToken(tokens, chars[ip], RBrace); ip++ }
			if chars[ip] == "+" { tokens = BuildToken(tokens, chars[ip], Operator); ip++ }
			if chars[ip] == "-" { tokens = BuildToken(tokens, chars[ip], Operator); ip++ }
			if chars[ip] == "*" { tokens = BuildToken(tokens, chars[ip], Operator); ip++ }
			if chars[ip] == "/" { tokens = BuildToken(tokens, chars[ip], Operator); ip++ }
		
		}else {

			if IsNumerical(chars[ip]){
				Number := ""
				for IsNumerical(chars[ip]){
					Number += chars[ip]
				}

				tokens = BuildToken(tokens, Number, Numeral)
			}

			if IsAlphabetical(chars[ip]){
				String := ""
				for IsAlphabetical(chars[ip]){
					String += chars[ip]
				}
				tf, k := IsKeyword(String)
				if tf {
					tokens = BuildToken(tokens, String, k)
				}else{
					tokens = BuildToken(tokens, String, Identifier)
				}

			}

			if IsSkippable(chars[ip]){
				ip++
			}

			if !IsAlphabetical(chars[ip]) == !IsNumerical(chars[ip]) == !IsOneCharToken(chars[ip]) == !IsSkippable(chars[ip]){
				fmt.Errorf("Char That Cannot Be Handeled found in src %s", chars[ip])
				os.Exit(2)
			}

		}

	}
	
	return tokens

}