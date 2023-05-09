@echo off

cls
set /p "f={file}.sp : "
echo "-tk = 'Produce Tokens File'"
echo "-tr = 'Produce Ast Tree File'"
set /p "args=args (-tk -tr) "

deno run -A Soup.ts %f% %args%