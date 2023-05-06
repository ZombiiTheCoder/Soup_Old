using System;
using System.Collections.Generic;
using System.IO;
using Lexer;
class Program{
    
    public static string[] ToStringArray(char[] s){
        string[] e = new string[s.Length+1];
        for (int i = 0; i < s.Length; i++)
        {
            e[i] = s[i].ToString();
        }
        e[s.Length]="\r";
        return e;
    }

    static void Main(string[] args){

        if (args.Length < 2) {Console.WriteLine("Argument Error: Soup.exe <File.sp> <Debug Arg [-to, -tr] >"); Environment.Exit(1);}
        string fileContents = File.ReadAllText(args[1]);
        string[] src = ToStringArray(fileContents.ToCharArray());

        List<Tokens.Token> tokens=lexer.Tokenize(src);

        foreach (var item in tokens){
            
            Console.WriteLine("Value: '"+item.T_Value + "' Token: " + item.T_Type);

        }

    }

}