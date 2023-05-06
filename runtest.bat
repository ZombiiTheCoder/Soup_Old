RMDIR bin /Q /S
RMDIR obj /Q /S
cls
dotnet run . test\test.sp
pause
cls
RMDIR bin /Q /S
RMDIR obj /Q /S
cls