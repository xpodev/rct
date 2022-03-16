@echo off

cd ..
call npm install
call npm run build
xcopy /e /y src\generate\templates bin\generate\templates\