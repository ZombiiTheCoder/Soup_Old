export enum TokenTypes{
    EOF,
    //Brakets [] {} <> [] ;
    LParen,
    RParen,
    LBrace,
    RBrace,
    LArrow,
    RArrow,
    LBracket,
    RBracket,
    Semicolon,

    //expressions, + - * / 0-9 =
    BinaryExpression,
    Numeral,
    Equals,

    //Keywords Identified, def, soup
    Identifier,
    Def,
    Mal,
    Soup,
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
        "Soup": TokenTypes.Soup
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

    return /^[A-Za-z]*$/.test(charr);

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
        "\n\r": true
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
        "{": true,
        "}": true,
        "=": true,
        ";": true,
        "+": true,
        "-": true,
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