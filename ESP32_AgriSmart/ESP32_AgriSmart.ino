/*
 * AgriSmart ESP32 Firmware
 * 
 * This firmware reads data from NPK, pH, soil moisture, DHT22, and GPS sensors
 * and sends it to Supabase Edge Function.
 * 
 * If sensors are not connected, it generates simulated values in normal farm ranges.
 * 
 * Toggle SIMULATION_MODE to switch between real sensors and simulated data.
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ===== CONFIGURATION =====
#define SIMULATION_MODE true  // Set to false when using real sensors

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Supabase Edge Function URL
const char* serverUrl = "YOUR_SUPABASE_URL/functions/v1/iot-upload";
const char* apiKey = "YOUR_SUPABASE_ANON_KEY";

// GPS coordinates (set to your farm location or use GPS module)
float farmLatitude = 17.4065;   // Example: Hyderabad, India
float farmLongitude = 78.4772;

// Sensor pins (adjust based on your wiring)
#define SOIL_MOISTURE_PIN 34
#define DHT_PIN 25

// Timing
unsigned long lastUpload = 0;
const unsigned long uploadInterval = 15000; // 15 seconds

// ===== SIMULATED SENSOR VALUES =====
float simulatedN = 0;
float simulatedP = 0;
float simulatedK = 0;
float simulatedPH = 0;
float simulatedMoisture = 0;
float simulatedTemp = 0;
float simulatedHumidity = 0;

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== AgriSmart ESP32 Starting ===");
  
  if (SIMULATION_MODE) {
    Serial.println("Mode: SIMULATION");
  } else {
    Serial.println("Mode: REAL SENSORS");
    // Initialize real sensors here
    pinMode(SOIL_MOISTURE_PIN, INPUT);
    // Initialize DHT, NPK, pH sensors as needed
  }
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWiFi Connection Failed!");
  }
  
  // Initialize random seed for simulation
  randomSeed(analogRead(0));
  
  // Initialize simulated values to realistic starting points
  if (SIMULATION_MODE) {
    simulatedN = 40.0;
    simulatedP = 25.0;
    simulatedK = 150.0;
    simulatedPH = 6.8;
    simulatedMoisture = 50.0;
    simulatedTemp = 28.0;
    simulatedHumidity = 60.0;
    Serial.println("Simulation values initialized");
  }
}

void loop() {
  unsigned long currentTime = millis();
  
  // Upload data every 15 seconds
  if (currentTime - lastUpload >= uploadInterval) {
    lastUpload = currentTime;
    
    if (WiFi.status() == WL_CONNECTED) {
      sendSensorData();
    } else {
      Serial.println("WiFi not connected. Reconnecting...");
      WiFi.begin(ssid, password);
    }
  }
  
  delay(100);
}

void sendSensorData() {
  HTTPClient http;
  http.setTimeout(10000); // 10 second timeout
  
  // Read or simulate sensor values
  float n_value, p_value, k_value, soil_ph, soil_moisture, temperature, humidity;
  
  if (SIMULATION_MODE) {
    // Generate realistic simulated values with slight variations
    n_value = generateSimulatedN();
    p_value = generateSimulatedP();
    k_value = generateSimulatedK();
    soil_ph = generateSimulatedPH();
    soil_moisture = generateSimulatedMoisture();
    temperature = generateSimulatedTemp();
    humidity = generateSimulatedHumidity();
  } else {
    // Read from real sensors
    n_value = readNPK_N();
    p_value = readNPK_P();
    k_value = readNPK_K();
    soil_ph = readSoilPH();
    soil_moisture = readSoilMoisture();
    temperature = readTemperature();
    humidity = readHumidity();
  }
  
  // Create JSON payload
  StaticJsonDocument<512> doc;
  doc["n_value"] = n_value;
  doc["p_value"] = p_value;
  doc["k_value"] = k_value;
  doc["soil_ph"] = soil_ph;
  doc["soil_moisture"] = soil_moisture;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["latitude"] = farmLatitude;
  doc["longitude"] = farmLongitude;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Send HTTP POST request
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", apiKey);
  
  Serial.println("\n--- Sending Data ---");
  Serial.println(jsonString);
  
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Retrying in next cycle...");
  }
  
  http.end();
}

// Note: For HTTPS Supabase URLs, you may need to add certificate handling
// or use http.setInsecure() for testing (not recommended for production)

// ===== SIMULATED SENSOR FUNCTIONS =====
float generateSimulatedN() {
  // NPK N: 20-60 mg/kg (normal range)
  simulatedN += random(-3, 4) * 0.5;
  simulatedN = constrain(simulatedN, 20, 60);
  if (simulatedN == 0) simulatedN = 40;
  return simulatedN;
}

float generateSimulatedP() {
  // NPK P: 15-40 mg/kg
  simulatedP += random(-2, 3) * 0.5;
  simulatedP = constrain(simulatedP, 15, 40);
  if (simulatedP == 0) simulatedP = 25;
  return simulatedP;
}

float generateSimulatedK() {
  // NPK K: 100-250 mg/kg
  simulatedK += random(-5, 6) * 1.0;
  simulatedK = constrain(simulatedK, 100, 250);
  if (simulatedK == 0) simulatedK = 150;
  return simulatedK;
}

float generateSimulatedPH() {
  // Soil pH: 6.0-7.5 (slightly acidic to neutral)
  simulatedPH += random(-2, 3) * 0.05;
  simulatedPH = constrain(simulatedPH, 6.0, 7.5);
  if (simulatedPH == 0) simulatedPH = 6.8;
  return simulatedPH;
}

float generateSimulatedMoisture() {
  // Soil moisture: 30-70%
  simulatedMoisture += random(-5, 6) * 1.0;
  simulatedMoisture = constrain(simulatedMoisture, 30, 70);
  if (simulatedMoisture == 0) simulatedMoisture = 50;
  return simulatedMoisture;
}

float generateSimulatedTemp() {
  // Temperature: 20-35°C
  simulatedTemp += random(-2, 3) * 0.3;
  simulatedTemp = constrain(simulatedTemp, 20, 35);
  if (simulatedTemp == 0) simulatedTemp = 28;
  return simulatedTemp;
}

float generateSimulatedHumidity() {
  // Humidity: 40-80%
  simulatedHumidity += random(-3, 4) * 1.0;
  simulatedHumidity = constrain(simulatedHumidity, 40, 80);
  if (simulatedHumidity == 0) simulatedHumidity = 60;
  return simulatedHumidity;
}

// ===== REAL SENSOR FUNCTIONS (Implement based on your sensors) =====
float readNPK_N() {
  // TODO: Implement NPK N sensor reading
  // Example: Use RS485 Modbus to read from NPK sensor
  return 0;
}

float readNPK_P() {
  // TODO: Implement NPK P sensor reading
  return 0;
}

float readNPK_K() {
  // TODO: Implement NPK K sensor reading
  return 0;
}

float readSoilPH() {
  // TODO: Implement pH sensor reading
  // Example: Read analog value and convert to pH
  return 0;
}

float readSoilMoisture() {
  // TODO: Implement soil moisture sensor reading
  int rawValue = analogRead(SOIL_MOISTURE_PIN);
  // Convert to percentage (calibrate based on your sensor)
  float moisture = map(rawValue, 0, 4095, 0, 100);
  return moisture;
}

float readTemperature() {
  // TODO: Implement DHT22 temperature reading
  // Example: Use DHT library
  return 0;
}

float readHumidity() {
  // TODO: Implement DHT22 humidity reading
  return 0;
}
