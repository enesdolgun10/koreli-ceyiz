@echo off
cd /d "%~dp0"
"%~dp0venv\Scripts\python.exe" "%~dp0keep_alive.py" >> "%~dp0keep_alive_log.txt" 2>&1
