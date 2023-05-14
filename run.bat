@echo off
echo [1] cli
echo [2] file
echo [3] compile
echo [4] install
set /p "q=[?]: "

if %q% == 1 call scripts/runCli.bat
if %q% == 2 call scripts/runFile.bat
if %q% == 3 call scripts/compile.bat
if %q% == 4 call scripts/install.bat