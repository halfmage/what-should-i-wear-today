# What Should I Wear Today?

A simple web application that helps users decide what to wear based on current weather conditions and personal preferences.

## Features

- Weather data integration using OpenWeatherMap API
- Location auto-detection or manual input
- Customizable preferences:
  - Temperature sensitivity
  - Clothing style preference
  - Climate adaptation
- AI-powered clothing recommendations using OpenAI API
- Live reload for development

## Setup and Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd what-to-wear-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the application:
   ```
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## API Keys

The application uses the following APIs:

1. **OpenWeatherMap API**: Used for fetching weather data. The app currently uses a free API key. If you want to use your own key, replace the `WEATHER_API_KEY` value in `script.js`.

2. **OpenAI API**: Used for generating clothing recommendations. The API key is included in the code for demonstration purposes. For production use, you should secure this key using environment variables.

## How It Works

1. Enter your location or use the auto-detect feature
2. Choose your personal preferences (temperature sensitivity, clothing style, climate adaptation)
3. Click "Get Recommendation"
4. View the current weather information and clothing recommendation

## Development

The application includes a simple development server with live reload capability. When you make changes to any file, the browser will automatically refresh to show your changes.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Node.js (for development server)
- WebSockets (for live reload)
- OpenWeatherMap API
- OpenAI API 