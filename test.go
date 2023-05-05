package main

import (
	lex "Soup/lexer"
	"fmt"
	"io/ioutil"
	"os"
	str "strings"
)

func main()  {

	if (len(os.Args) < 2) { fmt.Println("Argument Error: Soup.exe <File.sp> <Debug Arg [-t] >"); os.Exit(1) }
	// flags := ProccessFlag(os.Args[2:])
	fileContents, _ := ioutil.ReadFile(os.Args[1])
	src := str.Split(string(fileContents), "")
	lex.Tokenize(src)

}