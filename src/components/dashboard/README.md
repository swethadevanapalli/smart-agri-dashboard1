# SmartAgriAI Component

The SmartAgriAI component is a comprehensive agriculture monitoring dashboard that displays real-time sensor data, AI recommendations, and supports multiple languages.

## Features

### Data Display
- **NPK Nutrients**: Nitrogen, Phosphorus, Potassium levels with color-coded status
- **Soil Conditions**: pH level and moisture percentage
- **Environmental**: Temperature and humidity
- **Crop Health**: NDVI score from satellite imagery

### AI Recommendations
- Fertilizer application plan
- Soil health advice
- Irrigation scheduling
- Pest warning levels
- 2-day action plan

### Language Support
- English
- Telugu (తెలుగు)
- All text and AI recommendations adapt to selected language

### Status Indicators
- 🟢 Green: Good/Optimal
- 🟡 Yellow: Needs attention
- 🔴 Red: Problem/Action required

## Usage

```tsx
import { SmartAgriAI } from '@/components/dashboard/SmartAgriAI';

function Dashboard() {
  return (
    <div>
      <SmartAgriAI />
    </div>
  );
}
```

## Data Sources

1. **Primary**: IoT readings from ESP32 sensors (Supabase database)
2. **Fallback**: API data when sensors are unavailable
   - Weather API for temperature/humidity
   - Satellite API for NDVI

The component automatically fetches missing data from APIs, ensuring continuous operation even when sensors are offline.
