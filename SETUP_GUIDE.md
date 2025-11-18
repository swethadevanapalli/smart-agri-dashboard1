# AgriSmart Setup Guide

Complete setup instructions for the Smart Agriculture AI System.

## Part 1: Supabase Database Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Sign up / Log in
3. Create a new project
4. Copy your project URL and API keys

### 2. Run Database Migration
In Supabase dashboard:
1. Go to SQL Editor
2. Paste and run the migration from `supabase/migrations/001_create_iot_readings.sql`
3. Verify table created in Table Editor

## Part 2: Deploy Edge Functions

### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy all functions
supabase functions deploy iot-upload
supabase functions deploy satellite-ndvi
supabase functions deploy weather-data

# Set secrets
supabase secrets set OPENWEATHER_API_KEY=your_key
supabase secrets set SENTINELHUB_CLIENT_ID=your_id
supabase secrets set SENTINELHUB_CLIENT_SECRET=your_secret
```

### Option B: Using Supabase Dashboard
1. Go to Edge Functions in Supabase dashboard
2. Create new function for each:
   - `iot-upload`
   - `satellite-ndvi`
   - `weather-data`
3. Copy code from `supabase/functions/[function-name]/index.ts`
4. Set environment secrets in Settings → Edge Functions

## Part 3: Configure React Application

### 1. Install Dependencies
```bash
bun install
```

### 2. Set Environment Variables
Create `.env` file in project root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Start Development Server
```bash
bun run dev
```

## Part 4: ESP32 Setup (Optional)

See `ESP32_AgriSmart/README.md` for detailed instructions.

Quick start:
1. Install Arduino IDE
2. Install ESP32 board support
3. Install ArduinoJson library
4. Configure WiFi and Supabase credentials
5. Upload to ESP32

**Note**: System works without ESP32 using API fallbacks!

## Part 5: Testing the System

### Test Data Flow

#### 1. Test IoT Upload (Simulate ESP32)
```bash
curl -X POST YOUR_SUPABASE_URL/functions/v1/iot-upload \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "n_value": 45,
    "p_value": 28,
    "k_value": 180,
    "soil_ph": 6.8,
    "soil_moisture": 52,
    "temperature": 28,
    "humidity": 65,
    "latitude": 17.4065,
    "longitude": 78.4772
  }'
```

#### 2. Test Weather API
```bash
curl -X POST YOUR_SUPABASE_URL/functions/v1/weather-data \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 17.4065,
    "longitude": 78.4772
  }'
```

#### 3. Test Satellite NDVI
```bash
curl -X POST YOUR_SUPABASE_URL/functions/v1/satellite-ndvi \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 17.4065,
    "longitude": 78.4772
  }'
```

### Verify in Dashboard
1. Open application in browser
2. Check "Smart Agriculture AI" section
3. Switch between English and Telugu languages
4. Verify data displays correctly
5. Check AI recommendations

## Data Flow Diagram

```
┌─────────────┐
│   ESP32     │
│  (Sensors)  │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  iot-upload     │
│  Edge Function  │
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│  Supabase DB    │
│  iot_readings   │
└──────┬──────────┘
       │
       ▼
┌─────────────────────────┐
│  React Dashboard        │
│  useSmartAgriData()     │
└──────┬──────────────────┘
       │
       ├──► Weather API (if needed)
       ├──► Satellite API (if needed)
       │
       ▼
┌─────────────────────────┐
│  useAgriAI()            │
│  OnSpace AI Analysis    │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  SmartAgriAI Component  │
│  Display with Language  │
└─────────────────────────┘
```

## Language Support

### English
- Default language
- All recommendations in English
- Simple farmer-friendly words

### Telugu (తెలుగు)
- Switch using language selector
- All UI text translated
- AI recommendations in Telugu
- Clear Telugu font for readability

## Troubleshooting

### "Missing Supabase credentials" Error
- Check `.env` file exists
- Verify environment variable names match
- Restart development server

### No Data in Dashboard
- Check Supabase table has data
- Verify Edge Functions are deployed
- Check browser console for errors

### ESP32 Not Uploading
- Verify WiFi credentials
- Check Supabase URL and API key
- Open Serial Monitor for debug info

### AI Recommendations Not Loading
- Check network connectivity
- Verify OnSpace API is accessible
- System uses fallback recommendations if API fails

## Production Deployment

### Using Replit Deployments
1. Click "Deploy" button in Replit
2. Configure deployment settings
3. Set environment secrets
4. Deploy

### Environment Secrets for Production
Ensure these are set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `OPENWEATHER_API_KEY` (in Supabase secrets)
- `SENTINELHUB_CLIENT_ID` (in Supabase secrets)
- `SENTINELHUB_CLIENT_SECRET` (in Supabase secrets)

## Support & Documentation

- **Supabase Docs**: https://supabase.com/docs
- **ESP32 Arduino**: https://docs.espressif.com/
- **OpenWeather API**: https://openweathermap.org/api
- **SentinelHub**: https://docs.sentinel-hub.com/

## Next Steps

1. ✅ Database and Edge Functions deployed
2. ✅ React application running
3. ✅ Language selection working
4. 📱 Configure ESP32 (optional)
5. 🌾 Start monitoring your farm!
