# AgriSmart - Smart Agriculture Monitoring Platform

## Overview
AgriSmart is a comprehensive smart agriculture AI system that helps farmers monitor crop health with real-time sensor data, satellite imagery, weather information, and AI-powered recommendations in multiple languages (English/Telugu).

**Current Status:** Complete Smart Agriculture AI System with IoT Integration
**Last Updated:** November 18, 2025

## 🚀 Latest Update: Smart Agriculture AI System
Complete multilingual AI system with:
- ✅ ESP32 IoT sensor integration (NPK, pH, moisture, temperature, humidity)
- ✅ Supabase database and Edge Functions
- ✅ Real-time weather data (OpenWeather API)
- ✅ Satellite NDVI crop health monitoring (SentinelHub)
- ✅ AI-powered recommendations with OnSpace AI
- ✅ Bilingual support: English & Telugu (తెలుగు)
- ✅ Color-coded status indicators (green/yellow/red)
- ✅ Farmer-friendly simple language

## ⚙️ Setup Instructions
See `SETUP_GUIDE.md` for complete setup instructions including:
- Supabase database configuration
- Edge Functions deployment  
- Environment variables setup
- ESP32 firmware configuration

## Project Architecture

### Tech Stack
- **Frontend Framework:** React 18 with TypeScript
- **Build Tool:** Vite 5.4
- **UI Components:** shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router v6
- **Backend Services:** Supabase
- **Payment Processing:** Stripe
- **Charts:** Recharts

### Project Structure
```
src/
├── components/
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── SmartAgriAI.tsx       # NEW: Complete AI system with language support
│   │   ├── AIRecommendations.tsx
│   │   ├── CropHealthAnalyzer.tsx
│   │   ├── IrrigationRecommendations.tsx
│   │   ├── SatelliteMonitoring.tsx
│   │   ├── StatCard.tsx
│   │   └── WeatherMonitoring.tsx
│   ├── layout/             # Layout components
│   │   └── Header.tsx
│   ├── LanguageSelector.tsx      # NEW: English/Telugu switcher
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── pages/
│   ├── Dashboard.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── hooks/
│   ├── useSmartAgriData.ts       # NEW: Unified data fetching hook
│   ├── useAgriAI.ts              # NEW: AI recommendations hook
│   └── use-mobile.tsx
├── lib/
│   └── supabase.ts               # Supabase client
├── App.tsx
└── main.tsx

supabase/
├── functions/
│   ├── iot-upload/         # NEW: ESP32 data ingestion
│   ├── satellite-ndvi/     # NEW: SentinelHub NDVI API
│   └── weather-data/       # UPDATED: Enhanced weather API
└── migrations/
    └── 001_create_iot_readings.sql  # NEW: IoT database schema

ESP32_AgriSmart/
└── ESP32_AgriSmart.ino     # NEW: Arduino firmware for sensors
```

## Features

### Current Features
1. **Crop Health Monitoring**
   - Real-time crop health index tracking
   - Visual indicators with percentage changes
   
2. **Environmental Monitoring**
   - Soil moisture levels
   - Temperature tracking
   - Growth rate analysis

3. **Satellite Data Integration**
   - NDVI (Normalized Difference Vegetation Index) data
   - Satellite imagery analysis

4. **Smart Recommendations**
   - AI-powered crop recommendations
   - Irrigation scheduling suggestions

## Development

### Running the Application
The application runs on port 5000 using Vite's development server:
```bash
bun run dev
```

### Workflow Configuration
- **Name:** Start application
- **Command:** `bun run dev`
- **Port:** 5000
- **Output Type:** Webview

### Environment Configuration
- Server runs on `0.0.0.0:5000` for Replit compatibility
- Vite configured with `allowedHosts: true` for iframe support

## Integration Services
- **Supabase:** Database and authentication backend
- **Stripe:** Payment processing integration
- **Weather APIs:** Real-time weather data (to be configured)
- **Satellite APIs:** Satellite imagery and NDVI data (to be configured)

## User Preferences
(No specific preferences recorded yet)

## Recent Changes
- **November 18, 2025**
  - Fixed Vite server configuration to use port 5000
  - Configured workflow for proper Replit environment
  - Added `allowedHosts: true` for iframe compatibility
  - Created project documentation (replit.md)
