# 🌡️ Implementasi Platform Monitoring Suhu Tubuh Berbasis IoT

Proyek Internet of Things (IoT) untuk pemantauan suhu tubuh secara otomatis menggunakan mikrokontroler ESP32, sensor suhu inframerah, dan pengiriman pesan peringatan via Telegram Bot. Proyek ini diimplementasikan dengan protokol MQTT dan penyimpanan riwayat log ke database MySQL.

## 👥 Tim Pengembang
* **Ali Razky Ramadhan** (1124160065)
* **Dava Adi Prastya** (1124160106)
* **Pramgalang Basokoro Kristiaji** (1124160192)

## 🎯 Latar Belakang & Tujuan
Pengukuran suhu tubuh umumnya masih menggunakan termometer biasa, sehingga hasil pengukuran harus dicatat secara manual. Cara ini kurang efisien karena berisiko terjadi kesalahan pencatatan dan menyulitkan dalam memantau perubahan suhu[cite: 1]. 

Tujuan dari sistem ini adalah:
* Membuat alat monitoring suhu tubuh secara otomatis tanpa kontak fisik[cite: 1].
* Menampilkan data suhu secara *real-time* pada dashboard web[cite: 1].
* Menyimpan riwayat pengukuran secara permanen ke database[cite: 1].
* Mengirimkan notifikasi darurat via Telegram apabila suhu tubuh melebihi batas normal[cite: 1].

## 🛠️ Teknologi yang Digunakan
* **Hardware:** ESP32, Sensor MLX90614[cite: 1]
* **Protokol Jaringan:** MQTT (Broker HiveMQ)[cite: 1]
* **Backend:** Node.js & Express.js[cite: 1]
* **Database:** MySQL (XAMPP)[cite: 1]
* **Notifikasi:** Telegram Bot API (HTTPS)[cite: 1]
* **Frontend/Real-time:** HTML, CSS, Socket.io[cite: 1]

## ⚙️ Cara Menjalankan Server Lokal
1. Pastikan **XAMPP** sudah terinstal. Jalankan modul **Apache** dan **MySQL**.
2. Buat database baru bernama `dashboard-suhu` di phpMyAdmin.
3. Import file `database_suhu.sql` ke dalam database tersebut (atau buat tabel `log_suhu` secara manual).
4. Buka terminal/command prompt di direktori proyek ini.
5. Jalankan perintah `npm install` untuk mengunduh semua *library* (mqtt, mysql2, express, socket.io, axios).
6. Sesuaikan konfigurasi Token Bot Telegram dan Chat ID di dalam file `.env` atau `server.js`.
7. Jalankan server dengan perintah:
   ```bash
   node server.js

## 🚀 Panduan Menjalankan Project (Getting Started)

Untuk menjalankan sistem ini secara lokal di komputer, pastikan Anda telah menginstal **Node.js**, **XAMPP**, dan **Arduino IDE**. Ikuti langkah-langkah berikut:

### Tahap 1: Persiapan Database (MySQL)
1. Buka **XAMPP Control Panel** dan klik **Start** pada modul **Apache** dan **MySQL**.
2. Buka browser dan akses `http://localhost/phpmyadmin`.
3. Buat database baru dengan nama `dashboard-suhu`.
4. Pilih database tersebut, lalu klik tab **Import**. 
5. Masukkan file `database_suhu.sql` yang ada di dalam *repository* ini, lalu klik **Go** untuk mengeksekusi pembuatan tabel.
*(Catatan: Tabel log_suhu sudah dikonfigurasi menggunakan CURRENT_TIMESTAMP untuk pencatatan waktu otomatis).*

### Tahap 2: Konfigurasi Server (Node.js)
1. Buka folder *project* ini menggunakan teks editor (misalnya **Visual Studio Code**).
2. Buka terminal baru (Ctrl + `) dan jalankan perintah berikut untuk menginstal semua *library* yang dibutuhkan:
   ```bash
   npm install
