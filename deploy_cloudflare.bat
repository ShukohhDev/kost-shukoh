@echo off
title Deploy Kost Shukoh ke Cloudflare Pages
color 0a
echo ========================================================
echo    DEPLOY KOST SHUKOH KE CLOUDFLARE PAGES (KOST-SHUKOH)
echo ========================================================
echo.
echo Mengompilasi Tailwind CSS & Asset Produksi...
call npm run build:css
call npm run build
echo.
echo Mengunggah ke Cloudflare Pages...
call npx wrangler pages deploy dist --project-name kost-shukoh --branch main
echo.
echo Selesai! Website Kost Shukoh telah diperbarui di Cloudflare Pages.
pause
