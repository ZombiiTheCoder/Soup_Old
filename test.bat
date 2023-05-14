@echo off

cls
echo "{file}.sp = The Filename.sp you input intend to run"
echo "-tk = 'Produce Tokens File'"
echo "-tr = 'Produce Ast Tree File'"
echo "-v = 'Get Soup Version And Ends Program'"
echo "-ig_lexer = 'Does Not Exit When Throwing Lexical Error'"
echo "-ig_parser = 'Does Not Exist When Throwing Parse Error'"
echo "Recommended Format: {file}.sp {arguments}"
set /p "args=args: "

deno run -A --allow-run Soup.ts %f% %args%