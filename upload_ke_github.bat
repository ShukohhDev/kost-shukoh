@echo off
title Upload Kost Shukoh ke GitHub
color 0b
echo ========================================================
echo        UPLOAD KOST SHUKOH KE REPOSITORY GITHUB
echo ========================================================
echo.
echo Memastikan branch aktif adalah main...
git branch -M main
echo.
echo Mengunggah seluruh kode ke GitHub (origin main)...
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo Berhasil diunggah ke GitHub!
) else (
    echo Terjadi kendala saat upload. Pastikan Anda sudah membuat repository 'kost-shukoh' di GitHub (https://github.com/new).
)
echo.
pause
