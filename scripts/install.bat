@echo off
set "ver=_0.0.6a"
if exist "bin\" ( echo ) else ( mkdir "bin\" )
deno compile -A --allow-run --output bin/Soup%ver%.exe Soup.ts
cls
set "MY_PATH=C:\Users\%USERNAME%\MuBin"
if exist %MY_PATH% ( echo ) else ( mkdir %MY_PATH% )
echo f | xcopy /f /y "bin/Soup%ver%.exe" "%MY_PATH%\soup.exe"
setx path "%MY_PATH%;%PATH%"
cls
echo Soup Has Been installed For %USERNAME%.
call "%MY_PATH%/soup.exe"