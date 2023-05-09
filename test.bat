@echo off

cls
set /p "f={file}.sp : "
echo "-tk = 'Produce Tokens File'"
echo "-tr = 'Produce Ast Tree File'"
echo "-v, -ver, -version = 'Get Soup Version And Ends Program'"
set /p "args=args (-tk -tr -v) "

deno run -A Soup.ts %f% %args%