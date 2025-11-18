# AgriSmart Quick Start Guide

## ⚡ Get Started in 3 Steps

### Step 1: Configure Supabase (Required)

The application needs your Supabase project credentials to work:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project (free tier available)
   - Wait for the project to finish setting up (~2 minutes)

2. **Get Your Credentials**
   - In your Supabase dashboard, go to **Settings** → **API**
   - Copy these values:
     - **Project URL** (e.g., `https://abc123xyz.supabase.co`)
     - **anon public key** (under "Project API keys")

3. **Update .env File**
   - Open the `.env` file in this project
   - Replace the placeholders with your actual credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
   ```

4. **Run the Database Migration**
   - In Supabase dashboard, go to **SQL Editor**
   - Click "New Query"
   - Copy and paste the entire content of `supabase/migrations/001_create_iot_readings.sql`
   - Click "Run"
   - You should see "Success. No rows returned"

5. **Deploy Edge Functions** (Optional - for full functionality)
   - Follow the instructions in `SETUP_GUIDE.md` to deploy the 3 edge functions
   - Or use the Supabase dashboard to create them manually

### Step 2: Restart the App

After updating the `.env` file:
- The app will automatically restart
- Refresh your browser
- You should see the dashboard load successfully!

### Step 3: Add Sample Data (Optional)

To test the system without ESP32 hardware:

```bash
# In Supabase SQL Editor, run:
INSERT INTO iot_readings (
  n_value, p_value, k_value, soil_ph, soil_moisture,
  temperature, humidity, latitude, longitude
) VALUES (
  45, 28, 180, 6.8, 52, 28, 65, 17.4065, 78.4772
);
```

Now refresh the dashboard and you'll see live data!

## 🎯 What You Get

### Without ESP32 (API Mode)
- Weather data from OpenWeather API
- Satellite NDVI crop health monitoring
- AI-powered recommendations
- English & Telugu language support

### With ESP32 (Full IoT Mode)
- Real-time sensor data (NPK, pH, moisture, temp, humidity)
- All the above features
- Automatic data sync every 15 seconds

## 📱 Using the Dashboard

### Language Selection
- Click the **language button** in the top right
- Choose **English** or **Telugu (తెలుగు)**
- All AI recommendations adapt to your language!

### Understanding Colors
- 🟢 **Green**: Everything is good
- 🟡 **Yellow**: Needs attention
- 🔴 **Red**: Take action now

### Reading Recommendations

The AI provides:
1. **Fertilizer Plan**: Specific amounts and types
2. **Soil Advice**: NPK and pH status
3. **Irrigation**: When and how much to water
4. **Pest Warning**: Risk level and what to watch for
5. **2-Day Action Plan**: Prioritized tasks

## 🔧 Troubleshooting

### "Invalid supabaseUrl" Error
- Check that `.env` has the correct URL (must start with `https://`)
- Restart the application after changing `.env`

### No Data Showing
- Run the sample INSERT query above
- Or set up ESP32 following `ESP32_AgriSmart/README.md`

### Edge Functions Not Working
- The system works with API fallbacks even without Edge Functions
- For full features, deploy them following `SETUP_GUIDE.md`

## 📚 Next Steps

- **For Farmers**: Read the dashboard recommendations daily and follow the action plan
- **For Developers**: See `SETUP_GUIDE.md` for complete ESP32 and production setup
- **For Advanced**: Deploy to production using the "Deploy" button

## 🆘 Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review `ESP32_AgriSmart/README.md` for hardware setup
3. Ensure all environment variables are set correctly

---

**Happy Farming! 🌾**
