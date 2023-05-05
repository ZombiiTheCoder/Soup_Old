package lexer

type Token_Type int64

const (
	InvalidToken Token_Type = iota
	//Brakets [] {}
	LParen
	RParen
	LBrace
	RBrace

	//expressions, + - * / 0-9 =
	Operator
	Numeral
	Equals
	
	//Keywords Identified, def, soup
	Identifier
	Def
	Soup
)

type Token struct {
	T_Value string
	T_Type  Token_Type
}

func BuildToken(tokens []Token, TokenValue string, TokenType Token_Type) []Token {
	t := append(tokens, Token{T_Value: TokenValue, T_Type: TokenType})
	return t

}

type Keywords map[string]Token_Type

func IsKeyword(String string) (bool, Token_Type) {
	o:=false
	t:=InvalidToken
	Reserved := Keywords{
		"@@Invalid": InvalidToken,
		"def": Def,
		"soup": Soup,
	}

	if (Reserved[String] != InvalidToken){
		o=true
		t=Reserved[String]
	}

	return o, t
}