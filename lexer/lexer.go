package lexer

import (
	"unicode/utf8"
	"os"
	"fmt"
)


func Tokenize(chars []string) []Token {

	var tokens []Token
	ip := 0
	for ip <= len(chars)-1 {

		fmt.Println(chars[ip])
		if (ip == len(chars)){
			break
		}

		if (IsOneCharToken(chars[ip])){
			
			/* Check For OneCharTokens */
			if chars[ip] == "(" { tokens = BuildToken(tokens, chars[ip], LParen); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == ")" { tokens = BuildToken(tokens, chars[ip], RParen); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == "{" { tokens = BuildToken(tokens, chars[ip], LBrace); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == "}" { tokens = BuildToken(tokens, chars[ip], RBrace); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == "=" { tokens = BuildToken(tokens, chars[ip], Equals); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == "+" { tokens = BuildToken(tokens, chars[ip], Operator); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == "-" { tokens = BuildToken(tokens, chars[ip], Operator); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == "*" { tokens = BuildToken(tokens, chars[ip], Operator); if (ip+1>(len(chars)-1)){break}else{ip++} }
			if chars[ip] == "/" { tokens = BuildToken(tokens, chars[ip], Operator); if (ip+1>(len(chars)-1)){break}else{ip++} }
		
		}else {

			if IsNumerical(chars[ip]){
				Number := ""
				for IsNumerical(chars[ip]){
					Number += chars[ip]
					if (ip+1>(len(chars)-1)){break}else{ip++}

				}

				tokens = BuildToken(tokens, Number, Numeral)
			}

			if IsAlphabetical(chars[ip]){
				
				String := ""
				for IsAlphabetical(chars[ip]){
					String += chars[ip]					
					if (ip+1>(len(chars)-1)){break}else{ip++}
				}
				tf, k := IsKeyword(String)
				if tf {
					tokens = BuildToken(tokens, String, k)
				}else{
					tokens = BuildToken(tokens, String, Identifier)
				}

			}

			if IsSkippable(chars[ip]){
				if (ip+1>(len(chars)-1)){break}else{ip++}
			}

			if !IsAlphabetical(chars[ip]) == !IsNumerical(chars[ip]) == !IsOneCharToken(chars[ip]) == !IsSkippable(chars[ip]){
				f, _ := utf8.DecodeRuneInString(chars[ip])
				fmt.Println("Char That Cannot Be Handeled found in src ->", f)
				os.Exit(2)
			}

		}

	}
	
	return tokens

}