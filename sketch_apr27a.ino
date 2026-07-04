#include <WiFi.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <Adafruit_MLX90614.h>

// =======================================================
// PENGATURAN KONEKSI & BROKER (SUDAH DISESUAIKAN)
// =======================================================
const char* ssid = "your wifi";             // Nama Hotspot Laptop 
const char* password = "Password";     // Password Hotspot Laptop 
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* topic_suhu = "iot/suhu";   // Harus sama dengan yang di server.js

WiFiClient espClient;
PubSubClient client(espClient);
Adafruit_MLX90614 mlx = Adafruit_MLX90614();

unsigned long terakhirKirim = 0;
const long jedaWaktu = 30000; // Data dikirim otomatis tiap 30 detik sekali

void setup() {
  Serial.begin(115200);
  
  // Mengunci pin I2C fisik ESP32 (D21 sebagai SDA, D22 sebagai SCL)
  Wire.begin(21, 22); 
  
  // Inisialisasi Sensor MLX90614
  if (!mlx.begin()) {
    Serial.println("Sensor MLX90614 Gagal Diinisialisasi! Cek kabel fisik kamu.");
    while (1);
  }

  // Menjalankan fungsi koneksi Wi-Fi
  setup_wifi();
  
  // Set konfigurasi alamat MQTT Broker
  client.setServer(mqtt_server, mqtt_port);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Menghubungkan ke Wi-Fi Hotspot: ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWi-Fi Berhasil Terhubung!");
}

void reconnect() {
  // Perulangan sampai ESP32 benar-benar terhubung ke MQTT Broker
  while (!client.connected()) {
    Serial.print("Mencoba menyambungkan ke Broker MQTT...");
    
    // Membuat ID Client Acak agar tidak bentrok di Broker Publik
    String clientId = "ESP32_Pasien_";
    clientId += String(random(0xffff), HEX);
    
    if (client.connect(clientId.c_str())) {
      Serial.println("SUKSES Terhubung!");
    } else {
      Serial.print("GAGAL, rc=");
      Serial.print(client.state());
      Serial.println(" Mencoba kembali dalam 5 detik...");
      delay(5000);
    }
  }
}

void loop() {
  // Jika koneksi ke Broker putus, lakukan fungsi reconnect
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long sekarang = millis();
  
  // Logika pengiriman data berkala tanpa menggunakan delay() blocker
  if (sekarang - terakhirKirim >= jedaWaktu) {
    terakhirKirim = sekarang;

    // Membaca suhu objek (tubuh manusia) dalam satuan Celcius
    float suhuTubuh = mlx.readObjectTempC();

    // Pengecekan validasi data (jika sensor eror/tidak menghasilkan nilai NaN)
    if (!isnan(suhuTubuh)) {
      Serial.print("Suhu Tubuh Terbaca: ");
      Serial.print(suhuTubuh);
      Serial.println(" *C");

      // Konversi tipe data angka (float) ke teks (string) agar bisa dikirim via MQTT
      char stringSuhu[8];
      dtostrf(suhuTubuh, 1, 1, stringSuhu);

      // Menembakkan/Publish data suhu ke Broker HiveMQ
      client.publish(topic_suhu, stringSuhu);
      Serial.println("-> Data berhasil ter-publish ke dashboard web!");
    }
  }
}