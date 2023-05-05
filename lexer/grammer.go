package lexer

import (
	un "unicode"
)

func IsAlphabetical(char string) bool {

	tf := false
	tf = un.IsLetter([]rune(char)[0])
	return tf

}

func IsNumerical(char string) bool {

	tf := false
	tf = un.IsDigit([]rune(char)[0])
	return tf

}

func IsSkippable(char string) bool {

	type Skippable map[string]bool

	SKE:=Skippable{
		"913278480927138094780921734":false,
		// Space
		" ":true,
		// New Line
		"\n":true,
		// Tab
		"\t":true,
		// EOF
		"\r":true,
	}

	return SKE[char]

}

func IsOneCharToken(char string) bool {
	
	type OneCharToken map[string]bool

	OCT:=OneCharToken{
		"!&*!(*@&*(#&!(@*&#*(@!#@!U#*(!&@&*#)!*@#()))))":false,
		"(":true,
		")":true,
		"{":true,
		"}":true,
		"=":true,
		"+":true,
		"-":true,
		"*":true,
		"/":true,
	}

	return OCT[char]

}