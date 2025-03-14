# What Should I Wear Today?

A weather-based clothing recommendation app that suggests outfits based on current weather conditions and personal preferences.

## Features

- Real-time weather data from OpenWeatherMap
- AI-powered clothing recommendations from OpenAI
- Preference settings for clothing style, temperature sensitivity, and more
- Multiple language support (English, German, Belarusian)
- History of previous recommendations
- Mobile-friendly responsive design

## Deploying to Netlify

### Prerequisites

- [Node.js](https://nodejs.org/) installed (v14 or higher)
- [Git](https://git-scm.com/) installed
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional for local testing)
- API keys for:
  - [OpenWeatherMap](https://openweathermap.org/api)
  - [OpenAI](https://platform.openai.com/)

### Deployment Steps

1. **Clone the repository**

```bash
git clone <your-repository-url>
cd what-should-i-wear-today
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file for local development:

```
OPENWEATHER_API_KEY=your_openweathermap_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. **Test locally with Netlify Dev** (optional)

```bash
npm install -g netlify-cli
netlify dev
```

5. **Deploy to Netlify**

Option 1: Using the Netlify CLI:
```bash
netlify deploy --prod
```

Option 2: Connect to Git repository:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Select your Git provider
   - Select your repository
   - Configure build settings (leave build command blank)
   - Click "Deploy site"

6. **Set up environment variables in Netlify**
   - Go to your site's dashboard on Netlify
   - Click "Site settings" → "Environment variables"
   - Add the following variables:
     - OPENWEATHER_API_KEY
     - OPENAI_API_KEY

7. **Deploy functions**
   - Your Netlify functions will be automatically deployed from the `netlify/functions` directory

## Local Development

For local development, you can use Netlify CLI to test your functions:

```bash
npm install -g netlify-cli
netlify dev
```

This will start a local development server that simulates the Netlify environment.

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