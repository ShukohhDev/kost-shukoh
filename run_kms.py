"""
Kost Shukoh Management System (KMS) - Local Runner Script
Menjalankan server lokal untuk frontend Kost Shukoh.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Clean logging
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")

def main():
    os.chdir(DIRECTORY)
    print("=" * 65)
    print("      KOST SHUKOH MANAGEMENT SYSTEM (KMS) — LOCAL RUNNER")
    print("=" * 65)
    print(f"[*] Server berjalan pada port: {PORT}")
    print(f"[*] Direktori: {DIRECTORY}")
    print("-" * 65)
    print(" [1] Website Publik    : http://localhost:3000/")
    print(" [2] Formulir Booking  : http://localhost:3000/public/booking.html")
    print(" [3] Cek Status Booking: http://localhost:3000/public/booking-status.html")
    print(" [4] Halaman Login     : http://localhost:3000/public/login.html")
    print(" [5] Portal Admin      : http://localhost:3000/admin/index.html")
    print(" [6] Portal Penghuni   : http://localhost:3000/tenant/index.html")
    print("-" * 65)
    print("Tekan Ctrl + C untuk menghentikan server.")
    print("=" * 65)

    # Otomatis buka browser ke website publik
    try:
        webbrowser.open(f"http://localhost:{PORT}/")
    except Exception:
        pass

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[!] Server Kost Shukoh dihentikan.")
            sys.exit(0)

if __name__ == "__main__":
    main()
