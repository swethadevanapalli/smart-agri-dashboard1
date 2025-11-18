-- Create iot_readings table for ESP32 sensor data
CREATE TABLE IF NOT EXISTS iot_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  n_value FLOAT,
  p_value FLOAT,
  k_value FLOAT,
  soil_ph FLOAT,
  soil_moisture FLOAT,
  temperature FLOAT,
  humidity FLOAT,
  latitude FLOAT,
  longitude FLOAT,
  ndvi FLOAT
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_iot_readings_created_at ON iot_readings(created_at DESC);

-- Enable Row Level Security
ALTER TABLE iot_readings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for ESP32)
CREATE POLICY "Allow anonymous insert" ON iot_readings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated reads
CREATE POLICY "Allow authenticated read" ON iot_readings
  FOR SELECT
  TO authenticated, anon
  USING (true);
