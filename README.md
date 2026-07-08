🌡️ Implementasi Platform Monitoring Suhu Tubuh Berbasis IoT

Proyek Internet of Things (IoT) untuk pemantauan suhu tubuh secara otomatis menggunakan mikrokontroler ESP32, sensor suhu inframerah, dan pengiriman pesan peringatan via Telegram Bot. Proyek ini diimplementasikan dengan protokol MQTT dan penyimpanan riwayat log ke database MySQL.

👥 Tim Pengembang

Ali Razky Ramadhan (1124160065)

Dava Adi Prastya (1124160106)

Pramgalang Basokoro Kristiaji (1124160192)

🎯 Latar Belakang & Tujuan

Pengukuran suhu tubuh umumnya masih menggunakan termometer biasa, sehingga hasil pengukuran harus dicatat secara manual. Cara ini kurang efisien karena berisiko terjadi kesalahan pencatatan dan menyulitkan dalam memantau perubahan suhu.

Tujuan utama sistem ini adalah:

Membuat alat monitoring suhu tubuh otomatis tanpa kontak fisik.

Menampilkan data suhu secara real-time pada dashboard web.

Menyimpan riwayat pengukuran secara permanen ke database MySQL.

Mengirimkan notifikasi darurat via Telegram apabila terdeteksi suhu demam (>37.5°C).

🛠️ Teknologi yang Digunakan

Hardware: Board ESP32, Sensor Suhu Inframerah (MLX90614)

Protokol Jaringan: MQTT (Broker publik: broker.hivemq.com)

Backend: Node.js & Express.js

Database: MySQL (via XAMPP)

Notifikasi: Telegram Bot API (HTTPS)

Frontend / Real-time: HTML, CSS, Javascript, Socket.io

🚀 Panduan Lengkap Menjalankan Project (Lokal / Pengujian)

Panduan ini ditujukan bagi dosen/penguji yang ingin menjalankan, membedah, dan menguji coba sistem secara lokal.

Prasyarat Sistem (Pastikan aplikasi berikut sudah terinstal):

XAMPP (Untuk menjalankan server Apache & MySQL lokal)

Node.js (Untuk menjalankan server backend)

Arduino IDE (Untuk upload program ke hardware ESP32)

Tahap 1: Persiapan Database (MySQL)

Buka aplikasi XAMPP Control Panel.

Klik tombol Start pada modul Apache dan MySQL hingga indikatornya berwarna hijau.

Buka browser web (Chrome/Edge/Firefox) dan akses URL: http://localhost/phpmyadmin

Di panel sebelah kiri, klik New untuk membuat database baru.

Beri nama database: iot_monitoring, lalu klik tombol Create/Buat.

Pilih database iot_monitoring yang baru saja dibuat.

Masuk ke tab Import (di deretan menu atas).

Klik Choose File, lalu cari dan pilih file database_suhu.sql yang terdapat di dalam folder project ini.

Scroll ke paling bawah dan klik tombol Go/Kirim (Tunggu hingga muncul pesan notifikasi hijau bahwa import berhasil).

Tahap 2: Pengaturan Kredensial Telegram Bot

Untuk menjaga privasi dan keamanan sistem, kami telah mengosongkan Token API Bot milik kami. Agar fitur peringatan otomatis ke Telegram dapat diuji coba, silakan gunakan bot penguji:

Buka aplikasi Telegram, cari bot @BotFather, ketik /newbot dan ikuti instruksi hingga Anda mendapatkan Token API (Contoh: 12345:ABCdef...).

Cari bot @userinfobot, klik /start untuk melihat angka Chat ID Anda.

Buka file server.js menggunakan code editor (seperti Visual Studio Code atau Notepad++).

Pada bagian atas kode, temukan dan lengkapi variabel berikut dengan data Anda:

const TELEGRAM_TOKEN = 'MASUKKAN_TOKEN_BOTFATHER_DI_SINI'; 
const CHAT_ID = 'MASUKKAN_CHAT_ID_DI_SINI';


Simpan (Ctrl + S) file tersebut.

Tahap 3: Instalasi & Menjalankan Server Node.js

(Catatan: Folder node_modules sengaja tidak kami sertakan dalam file .zip untuk memperkecil ukuran).

Buka folder utama project ini menggunakan Visual Studio Code.

Buka terminal terintegrasi (Pilih menu Terminal -> New Terminal atau tekan `Ctrl + ``).

Ketik perintah berikut untuk mengunduh semua library pendukung secara otomatis, lalu tekan Enter:

npm install


Tunggu beberapa detik hingga instalasi selesai. Setelah itu, jalankan server dengan perintah:

node server.js


Jika berhasil, terminal akan menampilkan konfirmasi berurutan:

✅ Server berjalan di http://localhost:3000

✅ Terhubung ke database MySQL.

✅ Terhubung ke MQTT Broker.

✅ Sukses subscribe ke topik: iot/suhu

Tahap 4: Konfigurasi Hardware (ESP32)

Buka file berekstensi .ino (contoh: sketch_apr27a.ino) menggunakan Arduino IDE.

Penting: Pastikan Anda telah menginstal library berikut di Arduino IDE (Sketch -> Include Library -> Manage Libraries):

Adafruit MLX90614 Library

PubSubClient (oleh Nick O'Leary)

Pada baris awal program, ubah kredensial WiFi agar ESP32 dapat terhubung ke hotspot atau WiFi yang Anda gunakan saat ini:

const char* ssid = "NAMA_WIFI_ATAU_HOTSPOT_ANDA";
const char* password = "PASSWORD_WIFI_ANDA";


Hubungkan board ESP32 ke komputer menggunakan kabel USB tipe Micro.

Pastikan konfigurasi Board (DOIT ESP32 DEVKIT V1) dan Port COM sudah benar di menu Tools.

Klik tombol Upload (Tanda panah ke kanan) dan tunggu hingga proses kompilasi mencapai 100%.

Tahap 5: Pengujian Akhir & Simulasi Monitoring

Buka browser web dan akses URL dashboard utama: http://localhost:3000

Arahkan sensor MLX90614 (pada rangkaian ESP32) ke arah dahi Anda atau sumber panas lain (misal: secangkir air hangat).

Validasi Dashboard: Perhatikan angka suhu pada layar dashboard, data akan diperbarui secara real-time tanpa perlu me-refresh halaman web.

Validasi Database: Cek tabel log_suhu di phpMyAdmin, data terbaru beserta keterangan waktu otomatis (timestamp) akan tersimpan di sana.

Validasi Sistem Darurat: Jika pembacaan sensor mendeteksi suhu melebihi 37.5°C, periksa aplikasi Telegram penguji. Sistem akan seketika mengeksekusi API untuk mengirim pesan peringatan darurat.

🛠️ Pemecahan Masalah (Troubleshooting) Singkat

Gagal terkoneksi ke MySQL: Pastikan XAMPP dalam keadaan aktif dan database sudah diberi nama iot_monitoring.

Port 3000 In Use: Jika server gagal berjalan karena port terpakai, matikan aplikasi lain yang menggunakan port tersebut atau ubah angka port 3000 di bagian paling bawah kode server.js.

Sensor membaca "NAN" atau anomali (-252.8): Cek kembali pemasangan kabel jumper I2C. Pin SDA (sensor) ke GPIO21 (ESP32) dan pin SCL (sensor) ke GPIO22 (ESP32).

📡 Ringkasan Alur Kerja Sistem (Data Flow)

Sensor MLX90614 ➡️ ESP32 ➡️ MQTT HiveMQ (Internet) ➡️ Node.js Server ➡️ (Bercabang: Simpan ke MySQL & Kirim ke Dashboard Web via Socket.io) ➡️ (Trigger Khusus: Bot Telegram jika suhu > 37.5°C).
