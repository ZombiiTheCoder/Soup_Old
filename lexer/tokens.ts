export enum TokenTypes{
    EOF,
    //Brakets [] {} <> []
    LParen,
    RParen,
    LBrace,
    RBrace,
    LArrow,
    RArrow,
    LBracket,
    RBracket,
    
    // Symbols ; : , . &
    Semicolon,
    Colon,
    Comma,
    Period,
    
    //expressions, + - * / 0-9 =
    BinaryExpression,
    Numeral,
    Equals,
    // SameValue,
    // NotSameValue,
    // SameTypeValue,
    // NotSameTypeValue,

    //Keywords Identified, def, soup
    Identifier,
    Def,
    Mal,
    Soup,
    string,
    if,
    else,
    while
}

export interface Token{
    T_Value: string;
    T_Type: TokenTypes;
}

// deno-lint-ignore no-explicit-any
export function BuildToken(tokens: Token[], TokenValue: string, TokenType: any){
    const e = tokens;
    e.push({T_Value: TokenValue, T_Type: TokenType})
    return e;
}

export function IsKeyword(String: string){
    let o = false;
    let t = undefined;
    const Keywords: Record<string, TokenTypes>={
        "def": TokenTypes.Def,
        "mal": TokenTypes.Mal,
        "soup": TokenTypes.Soup,
        "Soup": TokenTypes.Soup,
        "if": TokenTypes.if,
        "else": TokenTypes.else,
        "while": TokenTypes.while,
        "&": TokenTypes.BinaryExpression,
        "=": TokenTypes.Equals,
        "==": TokenTypes.BinaryExpression,
        "!=": TokenTypes.BinaryExpression,
        "===": TokenTypes.BinaryExpression,
        "!==": TokenTypes.BinaryExpression,
        // "<": TokenTypes.BinaryExpression,
        // ">": TokenTypes.BinaryExpression,
        "toString": TokenTypes.Identifier,
        // "": TokenTypes.BinaryExpression
        };

    try{
        // o = Keywords[String];

        if (Keywords[String] != undefined){
            o=true;
            t=Keywords[String];
        }
    }catch{
        o=false;
    }


    return [o, t];
}

export function IsAlphabetical(charr: string) {

    return /^[A-Za-z_]*$/.test(charr);

}

export function IsAlphaNumerical(charr: string) {
    
    return /^[a-zA-Z0-9_]*$/.test(charr)

}

export function IsSymbol(charr: string){
    return /^[=!&]*$/.test(charr)
}

export function IsStringSingle(charr: string) {

    return /^[^']*$/.test(charr);

}

export function IsStringDouble(charr: string) {

    return /^[^"]*$/.test(charr);

}

export function IsStringSpecial(charr: string) {

    return /^[^`]*$/.test(charr);

}

export function IsNumerical(charr: string) {

    return /^[0-9]*$/.test(charr);

}

export function IsSkippable(charr: string){

    let o = false;
    
    const SKE: Record<string, boolean> = {
        " ": true, // Space
        "\n": true, // NEWLINE
        "\t": true, //TAB
        "\r": true, //EOF
        "\n\r": true, //EOF WINDOWS
        '"': true, "'": true, "`": true // Quotes
    };

    if (SKE[charr] != undefined){
        o = SKE[charr];
    }else{
        o = false
    }

    return o;

}

export function IsOneCharToken (charr: string) {

    let o = false;

    const OCT: Record<string, boolean> = {
        "(": true,
        ")": true,
        "[": true,
        "]": true,
        "{": true,
        "}": true,
        "<": true,
        ">": true,
        ";": true,
        ",": true,
        ":": true,
        "+": true,
        "-": true,
        ".": true,
        "*": true,
        "%": true,
        "/": true,
    };

    try{
        o = OCT[charr];
    }catch{
        o=false;
    }

    return o;

}