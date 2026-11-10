@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Музей вычислительной техники

echo.
echo  Музей вычислительной техники
echo  ----------------------------
echo  Собираю сайт...
call npm run build >nul
if errorlevel 1 (
  echo.
  echo  Не получилось собрать сайт.
  echo  Проверьте, что установлен Node.js и в этой папке один раз выполнена команда: npm install
  pause
  exit /b 1
)

echo  Открываю сайт в браузере: http://localhost:4173
echo  Интернет не нужен. Чтобы выключить сайт, просто закройте это окно.
echo.
call npm run preview -- --open
