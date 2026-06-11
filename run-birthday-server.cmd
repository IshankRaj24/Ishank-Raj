@echo off
set "PATH=C:\Program Files\nodejs;C:\Windows\system32;C:\Windows"
cd /d "E:\Final Year Project"
"C:\Program Files\nodejs\npm.cmd" run dev -- --host 127.0.0.1 --port 5173
