@echo off

cls
echo {file}.sp = The Filename.sp you input intend to run
echo -tk = 'Produce Tokens File'
echo -tr = 'Produce Ast Tree File'
echo -v = 'Get Soup Version And Ends Program'
echo -ig_lexer = 'Prevents Program Closing From Errors When Throwing Lexical Errors'
echo -ig_parser = 'Prevents Program Closing From Errors When Throwing Parse Errors'
echo -help or help = 'Shows This help Menu'
echo Recommended Format: soup.exe {file}.sp {arguments}

set /p "f=file: "
set /p "args=args: "

deno run -A --allow-run Soup.ts %f% %args%