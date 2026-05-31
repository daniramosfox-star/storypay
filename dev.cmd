@echo off
set PATH=C:\Program Files\nodejs;%PATH%
cd /d "%~dp0"
node_modules\.bin\next.cmd dev
