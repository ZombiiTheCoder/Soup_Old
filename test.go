package main

import (
	lex "Soup/lexer"
	"fmt"
	"io/ioutil"
	"os"
	str "strings"
)

func main()  {

	if (len(os.Args) < 2) { fmt.Println("Argument Error: Soup.exe <File.sp> <Debug Arg [-to, -tr] >"); os.Exit(1) }
	// flags := ProccessFlag(os.Args[2:])
	fmt.Println(os.Args[1])
	fileContents, _ := ioutil.ReadFile(os.Args[1])
	fmt.Println(string(fileContents))
	src := str.Split(string(fileContents), "")
	tokens:=lex.Tokenize(src)
	for _, v := range tokens{
		fmt.Println("{",v.T_Value, ",", v.T_Type,"}")
	}

}