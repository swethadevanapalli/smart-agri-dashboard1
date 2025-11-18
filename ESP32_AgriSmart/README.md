# ESP32 AgriSmart Firmware

This Arduino firmware enables ESP32 to collect agricultural sensor data and upload it to the AgriSmart system.

## Features

- **Real Sensor Support**: Reads from NPK, pH, soil moisture, DHT22, and GPS sensors
- **Simulation Mode**: Generates realistic farm data when sensors are unavailable
- **Automatic Upload**: Sends data to Supabase every 15 seconds
- **WiFi Connectivity**: Automatic reconnection on disconnection

## Hardware Requirements

### Sensors (Optional - works in simulation mode without them)
- NPK Sensor (RS485 Modbus) - For Nitrogen, Phosphorus, Potassium
- pH Sensor (Analog)
- Soil Moisture Sensor (Analog)
- DHT22 - Temperature & Humidity
- GPS Module (optional) - For location tracking

### Connections
```
ESP32 Pin | Sensor
----------|--------
GPIO 34   | Soil Moisture Sensor (Analog)
GPIO 25   | DHT22 Data Pin
GPIO 16   | GPS RX (optional)
GPIO 17   | GPS TX (optional)
```

## Software Setup

### 1. Install Arduino IDE
Download from: https://www.arduino.cc/en/software

### 2. Install ESP32 Board Support
- Open Arduino IDE
- File → Preferences
- Add to "Additional Board Manager URLs":
  ```
  https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
  ```
- Tools → Board → Boards Manager
- Search for "ESP32" and install

### 3. Install Required Libraries
- Sketch → Include Library → Manage Libraries
- Install:
  - `ArduinoJson` by Benoit Blanchon
  - `DHT sensor library` by Adafruit (if using real DHT22)

### 4. Configure the Firmware

Open `ESP32_AgriSmart.ino` and modify:

```cpp
// WiFi Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Supabase Configuration
const char* serverUrl = "YOUR_SUPABASE_URL/functions/v1/iot-upload";
const char* apiKey = "YOUR_SUPABASE_ANON_KEY";

// GPS Coordinates (if not using GPS module)
float farmLatitude = 17.4065;   // Your farm latitude
float farmLongitude = 78.4772;  // Your farm longitude

// Toggle between real sensors and simulation
#define SIMULATION_MODE true  // Set to false when using real sensors
```

### 5. Upload to ESP32
- Connect ESP32 via USB
- Tools → Board → ESP32 Dev Module
- Tools → Port → Select your ESP32 port
- Click Upload button

## Usage

### Simulation Mode (Default)
Perfect for testing without hardware:
- Set `SIMULATION_MODE true`
- Generates realistic farm data
- Values change gradually over time

### Real Sensor Mode
For production use with actual sensors:
- Set `SIMULATION_MODE false`
- Connect sensors as per pin diagram
- Implement sensor reading functions for your specific hardware

## Data Upload Format

The firmware sends JSON data to Supabase:
```json
{
  "n_value": 45.5,
  "p_value": 28.3,
  "k_value": 180.0,
  "soil_ph": 6.8,
  "soil_moisture": 52.0,
  "temperature": 28.5,
  "humidity": 65.0,
  "latitude": 17.4065,
  "longitude": 78.4772
}
```

## Monitoring

### Serial Monitor
- Open Tools → Serial Monitor
- Set baud rate to 115200
- View real-time data upload status

### Expected Output
```
=== AgriSmart ESP32 Starting ===
Mode: SIMULATION
Connecting to WiFi...
WiFi Connected!
IP Address: 192.168.1.100

--- Sending Data ---
{"n_value":40.5,"p_value":25.0,...}
HTTP Response: 200
{"success":true,...}
```

## Troubleshooting

### WiFi Connection Failed
- Check SSID and password
- Ensure WiFi is 2.4GHz (ESP32 doesn't support 5GHz)

### Upload Failed
- Verify Supabase URL and API key
- Check internet connectivity
- Review Serial Monitor for error messages

### Sensor Reading Issues
- Check pin connections
- Verify sensor power supply (3.3V or 5V as required)
- Test sensors individually

## Customization

### Adding New Sensors
1. Define pin in configuration section
2. Add reading function in "REAL SENSOR FUNCTIONS" section
3. Update JSON payload in `sendSensorData()`

### Changing Upload Interval
```cpp
const unsigned long uploadInterval = 15000; // milliseconds
```

## Data Ranges (Simulation Mode)

- **Nitrogen (N)**: 20-60 mg/kg
- **Phosphorus (P)**: 15-40 mg/kg
- **Potassium (K)**: 100-250 mg/kg
- **pH**: 6.0-7.5
- **Soil Moisture**: 30-70%
- **Temperature**: 20-35°C
- **Humidity**: 40-80%

## Support

For issues or questions:
1. Check Serial Monitor output
2. Verify network connectivity
3. Confirm Supabase configuration
4. Review Arduino IDE error messages
