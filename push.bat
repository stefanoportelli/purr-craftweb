@echo off
setlocal
set "t=%TIME: =0%"
set "msg=%~1"
if "%msg%"=="" set "msg=fix %t:~0,5%"

git add .
git diff --cached --quiet
if %errorlevel%==0 (
    echo Nessuna modifica da salvare.
    exit /b 0
)

git commit -m "%msg%"
if %errorlevel% neq 0 exit /b %errorlevel%

git push