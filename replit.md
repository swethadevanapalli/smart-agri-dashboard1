# AgriSmart - Smart Agriculture Monitoring Platform

## Overview
AgriSmart is a comprehensive smart agriculture monitoring platform that helps farmers monitor crop health, predict irrigation needs, and detect diseases using satellite data, weather APIs, and AI analysis.

**Current Status:** Application is running and accessible
**Last Updated:** November 18, 2025

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
│   │   ├── AIRecommendations.tsx
│   │   ├── CropHealthAnalyzer.tsx
│   │   ├── IrrigationRecommendations.tsx
│   │   ├── SatelliteMonitoring.tsx
│   │   ├── StatCard.tsx
│   │   └── WeatherMonitoring.tsx
│   ├── layout/             # Layout components
│   │   └── Header.tsx
│   └── ui/                 # Reusable UI components (shadcn/ui)
├── pages/
│   ├── Dashboard.tsx
│   ├── Index.tsx
│   └── NotFound.tsx
├── hooks/
│   └── use-mobile.tsx
├── App.tsx
└── main.tsx
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
