// =======================================================
// FULL INTEGRATED SERVER.JS (Telegram Bot + MQTT + Database)
// =======================================================

const express = require('express');
const mysql = require('mysql2');
const mqtt = require('mqtt');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// CONFIG TELEGRAM
const TELEGRAM_TOKEN = '8874826239:AAGYY4k8AMh72BPBj1ImV_nvE4sgZFmzUSY'; 
const TELEGRAM_CHAT_ID = '8946229850'; 

function kirimPesanTelegram(pesan) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    const data = JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: pesan, parse_mode: 'Markdown' });
    const req = https.request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, (res) => { res.on('data', () => {}); });
    req.on('error', (e) => console.error('Gagal kirim Telegram:', e.message));
    req.write(data); req.end();
}

let offset = 0;
function cekPerintahTelegram() {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${offset}&timeout=10`;
    https.get(url, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            try {
                const json = JSON.parse(body);
                if (json.ok && json.result.length > 0) {
                    json.result.forEach((update) => {
                        offset = update.update_id + 1;
                        if (update.message && update.message.text) {
                            const command = update.message.text.trim();
                            const chatId = update.message.chat.id;
                            const balasPesan = (teks) => {
                                const u = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
                                const d = JSON.stringify({ chat_id: chatId, text: teks, parse_mode: 'Markdown' });
                                const r = https.request(u, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(d) } });
                                r.write(d); r.end();
                            };

                            if (command === '/help' || command === '/start') {
                                balasPesan("🤖 *Daftar Perintah Bot:*\n\n/terbaru - Cek suhu terkini\n/hariini - Rekap suhu hari ini (per menit)\n/kemarin - Rekap suhu kemarin\n/tanggal YYYY-MM-DD - Cari data tanggal tertentu");
                            } else if (command === '/terbaru') {
                                db.query("SELECT suhu, waktu FROM log_suhu ORDER BY id DESC LIMIT 1", (err, res) => {
                                    if (err || res.length === 0) balasPesan("❌ Data tidak ditemukan.");
                                    else balasPesan(`🌡️ *Suhu Terkini:* ${res[0].suhu} °C\n⏰ ${new Date(res[0].waktu).toLocaleString('id-ID')}`);
                                });
                            } else if (command === '/hariini') {
                                db.query("SELECT AVG(suhu) AS rata, MAX(suhu) AS maks, MIN(suhu) AS min FROM log_suhu WHERE DATE(waktu) = CURDATE()", (err, res) => {
                                    if (err || !res[0].maks) balasPesan("❌ Belum ada data hari ini.");
                                    else {
                                        db.query("SELECT DATE_FORMAT(waktu, '%H:%i') AS menit, ROUND(AVG(suhu), 1) AS s FROM log_suhu WHERE DATE(waktu) = CURDATE() GROUP BY HOUR(waktu), MINUTE(waktu) ORDER BY waktu DESC LIMIT 40", (err2, res2) => {
                                            let list = res2.map(r => `• ${r.menit} ➡️ *${r.s}°C*`).join('\n');
                                            balasPesan(`📊 *REKAP HARI INI*\n📈 Maks: ${parseFloat(res[0].maks).toFixed(1)}°C\n📉 Min: ${parseFloat(res[0].min).toFixed(1)}°C\nAvg: ${parseFloat(res[0].rata).toFixed(1)}°C\n\n📋 *30 Data Terakhir (Per Menit):*\n${list}\n\n⏰ _Update: ${new Date().toLocaleTimeString('id-ID')}_`);
                                        });
                                    }
                                });
                            } else if (command === '/kemarin') {
                                db.query("SELECT AVG(suhu) AS rata, MAX(suhu) AS maks, MIN(suhu) AS min FROM log_suhu WHERE DATE(waktu) = SUBDATE(CURDATE(), 1)", (err, res) => {
                                    if (err || !res[0].maks) balasPesan("❌ Data kemarin tidak ditemukan.");
                                    else balasPesan(`📉 *REKAP KEMARIN*\n📈 Maks: ${parseFloat(res[0].maks).toFixed(1)}°C\n📉 Min: ${parseFloat(res[0].min).toFixed(1)}°C\nAvg: ${parseFloat(res[0].rata).toFixed(1)}°C`);
                                });
                            } else if (command.startsWith('/tanggal')) {
                                const tgl = command.replace('/tanggal', '').trim();
                                db.query("SELECT AVG(suhu) AS rata, MAX(suhu) AS maks, MIN(suhu) AS min FROM log_suhu WHERE DATE(waktu) = ?", [tgl], (err, res) => {
                                    if (err || !res[0].maks) balasPesan("❌ Data tanggal tersebut tidak ada.");
                                    else {
                                        db.query("SELECT DATE_FORMAT(waktu, '%H:%i') AS menit, ROUND(AVG(suhu), 1) AS s FROM log_suhu WHERE DATE(waktu) = ? GROUP BY HOUR(waktu), MINUTE(waktu) ORDER BY waktu DESC LIMIT 15", [tgl], (err2, res2) => {
                                            let list = res2.map(r => `• ${r.menit} ➡️ *${r.s}°C*`).join('\n');
                                            balasPesan(`📅 *REKAP TANGGAL ${tgl}*\n📈 Maks: ${parseFloat(res[0].maks).toFixed(1)}°C\n📉 Min: ${parseFloat(res[0].min).toFixed(1)}°C\nAvg: ${parseFloat(res[0].rata).toFixed(1)}°C\n\n📋 *15 Data Terakhir (pasien):*\n${list}`);
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            } catch (e) {}
            setTimeout(cekPerintahTelegram, 1000);
        });
    }).on('error', () => setTimeout(cekPerintahTelegram, 5000));
}

// 1. KONEKSI DATABASE
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dashboard-suhu'
});

db.connect((err) => {
    if (err) { console.error('Koneksi database GAGAL:', err.message); return; }
    console.log('Koneksi ke database MySQL SUKSES!');
    cekPerintahTelegram(); 
});

// 2. KONEKSI MQTT
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com');
const topicSuhu = 'iot/suhu';

mqttClient.on('connect', () => {
    console.log('Terhubung ke Broker MQTT HiveMQ!');
    mqttClient.subscribe(topicSuhu, (err) => {
        if (!err) console.log(`Sukses subscribe ke topik: ${topicSuhu}`);
    });
});

// 3. TANGKAP & SIMPAN DATA
mqttClient.on('message', (topic, message) => {
    const suhu = parseFloat(message.toString());
    // Filter suhu: hanya simpan suhu 30-45°C[cite: 3]
    if (isNaN(suhu) || suhu < 30 || suhu > 45) return;

    db.query("INSERT INTO log_suhu (suhu, waktu) VALUES (?, NOW())", [suhu], (err) => {
        if (!err) console.log(`[DATA MASUK] Suhu: ${suhu}°C disimpan.`);
    });

    io.emit('dataSuhuBaru', { suhu, waktu: new Date().toLocaleTimeString('id-ID') });

    if (suhu > 37.5) {
        kirimPesanTelegram(`🚨 *PERINGATAN! Suhu tinggi:* ${suhu}°C`);
    }
});

// 4. JALANKAN SERVER
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server HTTP berjalan di http://localhost:${PORT}`);
    console.log(`Sistem Bot Telegram Native HTTP siap!`);
});