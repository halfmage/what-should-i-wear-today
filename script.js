document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('clothing-form');
    const detectLocationBtn = document.getElementById('detect-location');
    const resultContainer = document.getElementById('result-container');
    const weatherInfoEl = document.getElementById('weather-info');
    const recommendationEl = document.getElementById('recommendation');
    const historyContainer = document.getElementById('history-container');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const languageSelector = document.getElementById('language-selector');
    
    // LocalStorage keys
    const STORAGE_KEY = 'clothingRecommendationHistory';
    const LAST_RESULT_KEY = 'lastClothingRecommendation';
    const LANGUAGE_KEY = 'preferredLanguage';
    
    // Initialize variable to store current weather data for responsive layouts
    let currentWeatherData = null;
    
    // Supported languages
    const LANGUAGES = {
        'en': 'English',
        'de': 'Deutsch',
        'be': 'Беларуская'
    };
    
    // Translations
    const translations = {
        en: {
            // App title
            appTitle: 'What Should I Wear Today?',
            slogan: 'Weather-wise, wardrobe-wise. Dress smart for every forecast!',
            
            // Form labels
            locationLabel: 'Location',
            locationPlaceholder: 'Enter city name...',
            locateBtn: '📍 Locate',
            locatingBtn: '📍 Finding...',
            temperatureSensitivityLabel: 'Temperature Sensitivity',
            coldSensitive: 'Cold Sensitive',
            averageSensitivity: 'Average',
            heatSensitive: 'Heat Sensitive',
            clothingStyleLabel: 'Clothing Style',
            casual: 'Casual',
            business: 'Business',
            sporty: 'Sporty',
            homeOffice: 'Home Office',
            climateAdaptationLabel: 'Climate Adaptation',
            localClimate: 'Local',
            visitor: 'Visitor',
            movementLevelLabel: 'Movement Level',
            sedentary: 'Sedentary',
            moderate: 'Moderate',
            active: 'Active',
            submitBtn: 'Get Recommendation',
            loadingBtn: 'Getting recommendations...',
            
            // Weather info
            feelsLike: 'Feels like',
            humidity: 'Humidity',
            wind: 'Wind',
            
            // History
            previousRecommendations: 'Previous Recommendations',
            clearHistoryBtn: 'Clear All',
            noHistory: 'No history available yet.',
            clearConfirm: 'Are you sure you want to clear all history?',
            styleLabel: 'Style',
            
            // Errors
            locationRequired: 'Please enter a location',
            locationNotFound: 'Location not found. Please check the spelling and try again.',
            genericError: 'An error occurred. Please try again.',
            apiError: 'Sorry, I could not generate a recommendation at this time. Please try again later.',
            geolocationNotSupported: 'Geolocation is not supported by your browser. Please enter your location manually.',
            geolocationError: 'Location detection failed. Please enter manually.',
            cityNotFound: 'Could not detect your location. Please enter manually.'
        },
        de: {
            // App title
            appTitle: 'Was soll ich heute anziehen?',
            slogan: 'Wetterbewusst, garderobenklug. Clever gekleidet für jede Wettervorhersage!',
            
            // Form labels
            locationLabel: 'Standort',
            locationPlaceholder: 'Stadtname eingeben...',
            locateBtn: '📍 Lokalisieren',
            locatingBtn: '📍 Finden...',
            temperatureSensitivityLabel: 'Temperaturempfindlichkeit',
            coldSensitive: 'Kälteempfindlich',
            averageSensitivity: 'Durchschnittlich',
            heatSensitive: 'Wärmeempfindlich',
            clothingStyleLabel: 'Kleidungsstil',
            casual: 'Lässig',
            business: 'Business',
            sporty: 'Sportlich',
            homeOffice: 'Homeoffice',
            climateAdaptationLabel: 'Klimaanpassung',
            localClimate: 'Einheimisch',
            visitor: 'Besucher',
            movementLevelLabel: 'Bewegungslevel',
            sedentary: 'Sitzend',
            moderate: 'Moderat',
            active: 'Aktiv',
            submitBtn: 'Empfehlung erhalten',
            loadingBtn: 'Empfehlungen werden erstellt...',
            
            // Weather info
            feelsLike: 'Gefühlt wie',
            humidity: 'Luftfeuchtigkeit',
            wind: 'Wind',
            
            // History
            previousRecommendations: 'Frühere Empfehlungen',
            clearHistoryBtn: 'Alle löschen',
            noHistory: 'Noch keine Historie verfügbar.',
            clearConfirm: 'Sind Sie sicher, dass Sie den gesamten Verlauf löschen möchten?',
            styleLabel: 'Stil',
            
            // Errors
            locationRequired: 'Bitte geben Sie einen Standort ein',
            locationNotFound: 'Standort nicht gefunden. Bitte überprüfen Sie die Schreibweise und versuchen Sie es erneut.',
            genericError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
            apiError: 'Entschuldigung, ich konnte zu diesem Zeitpunkt keine Empfehlung generieren. Bitte versuchen Sie es später noch einmal.',
            geolocationNotSupported: 'Geolokalisierung wird von Ihrem Browser nicht unterstützt. Bitte geben Sie Ihren Standort manuell ein.',
            geolocationError: 'Standorterkennung fehlgeschlagen. Bitte manuell eingeben.',
            cityNotFound: 'Konnte Ihren Standort nicht erkennen. Bitte manuell eingeben.'
        },
        be: {
            // App title
            appTitle: 'Што мне сёння надзець?',
            slogan: 'Разумна апранайцеся для любога надвор\'я!',
            
            // Form labels
            locationLabel: 'Месцазнаходжанне',
            locationPlaceholder: 'Увядзіце назву горада...',
            locateBtn: '📍 Вызначыць',
            locatingBtn: '📍 Пошук...',
            temperatureSensitivityLabel: 'Адчувальнасць да тэмпературы',
            coldSensitive: 'Адчувальны да холаду',
            averageSensitivity: 'Сярэдні',
            heatSensitive: 'Адчувальны да цяпла',
            clothingStyleLabel: 'Стыль адзення',
            casual: 'Паўсядзённы',
            business: 'Дзелавы',
            sporty: 'Спартыўны',
            homeOffice: 'Хатні офіс',
            climateAdaptationLabel: 'Адаптацыя да клімату',
            localClimate: 'Мясцовы',
            visitor: 'Наведвальнік',
            movementLevelLabel: 'Узровень актыўнасці',
            sedentary: 'Маларухлівы',
            moderate: 'Умераны',
            active: 'Актыўны',
            submitBtn: 'Атрымаць рэкамендацыю',
            loadingBtn: 'Атрыманне рэкамендацый...',
            
            // Weather info
            feelsLike: 'Адчуваецца як',
            humidity: 'Вільготнасць',
            wind: 'Вецер',
            
            // History
            previousRecommendations: 'Папярэднія рэкамендацыі',
            clearHistoryBtn: 'Ачысціць усё',
            noHistory: 'Гісторыя пакуль недаступная.',
            clearConfirm: 'Вы ўпэўнены, што жадаеце ачысціць усю гісторыю?',
            styleLabel: 'Стыль',
            
            // Errors
            locationRequired: 'Калі ласка, увядзіце месцазнаходжанне',
            locationNotFound: 'Месцазнаходжанне не знойдзена. Праверце правапіс і паспрабуйце яшчэ раз.',
            genericError: 'Адбылася памылка. Калі ласка, паспрабуйце яшчэ раз.',
            apiError: 'На жаль, я не змог стварыць рэкамендацыю. Калі ласка, паспрабуйце пазней.',
            geolocationNotSupported: 'Геалакацыя не падтрымліваецца вашым браўзерам. Калі ласка, увядзіце сваё месцазнаходжанне ўручную.',
            geolocationError: 'Вызначэнне месцазнаходжання не ўдалося. Калі ласка, увядзіце ўручную.',
            cityNotFound: 'Не ўдалося вызначыць ваша месцазнаходжанне. Калі ласка, увядзіце ўручную.'
        }
    };
    
    // Get browser language or from localStorage
    let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 
                         (navigator.language && navigator.language.split('-')[0]) || 
                         'en';
    
    // If the language is not supported, default to English
    if (!translations[currentLanguage]) {
        currentLanguage = 'en';
    }
    
    // Function to get translation
    const getTranslation = (key) => {
        return translations[currentLanguage][key] || translations['en'][key] || key;
    };
    
    // Function to translate the interface
    const translateInterface = () => {
        // Update page title
        document.title = getTranslation('appTitle');
        
        // Update slogan
        const sloganElement = document.querySelector('.slogan p');
        if (sloganElement) {
            sloganElement.textContent = getTranslation('slogan');
        }
        
        // Update h1 title
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = getTranslation('appTitle');
        }
        
        // Update language selector if it exists
        if (languageSelector) {
            // Clear existing options to prevent duplicates
            languageSelector.innerHTML = '';
            
            // Add language options
            Object.keys(LANGUAGES).forEach(lang => {
                const option = document.createElement('option');
                option.value = lang;
                option.textContent = LANGUAGES[lang];
                if (lang === currentLanguage) {
                    option.selected = true;
                }
                languageSelector.appendChild(option);
            });
        }
        
        // Form labels
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                element.textContent = getTranslation(key);
            }
        });
        
        // Update button texts
        detectLocationBtn.textContent = getTranslation('locateBtn');
        clearHistoryBtn.textContent = getTranslation('clearHistoryBtn');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = getTranslation('submitBtn');
        }
        
        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (key) {
                element.placeholder = getTranslation(key);
            }
        });
        
        // Update empty history text
        if (historyList.innerHTML.includes('No history available yet')) {
            historyList.innerHTML = `<div class="empty-history">${getTranslation('noHistory')}</div>`;
        }
        
        // If we have saved results, update them too
        if (resultContainer.style.display === 'block') {
            // If there's currentWeatherData, refresh the display
            if (currentWeatherData) {
                if (currentWeatherData.recommendation) {
                    displaySavedRecommendation(currentWeatherData);
                } else {
                    displayWeatherInfo(currentWeatherData);
                }
            }
        }
        
        // Update history items if they exist
        const historyData = loadHistory();
        if (historyData && historyData.length > 0) {
            displayHistoryItems(historyData);
        }
    };
    
    // Initialize language selector if it exists
    if (languageSelector) {
        languageSelector.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem(LANGUAGE_KEY, currentLanguage);
            translateInterface();
        });
    }
    
    // Button group selection handling
    const initButtonGroups = () => {
        const buttonGroups = document.querySelectorAll('.button-group');
        
        buttonGroups.forEach(group => {
            const buttons = group.querySelectorAll('.option-button');
            const hiddenInput = group.nextElementSibling;
            
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    // Deselect all buttons in this group
                    buttons.forEach(btn => btn.classList.remove('selected'));
                    
                    // Select the clicked button
                    button.classList.add('selected');
                    
                    // Update the hidden input value
                    if (hiddenInput && hiddenInput.tagName === 'INPUT') {
                        hiddenInput.value = button.dataset.value;
                    }
                    
                    // Add a subtle animation for feedback
                    button.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        button.style.transform = 'scale(1)';
                    }, 150);
                });
            });
        });
    };
    
    // Initialize button groups
    initButtonGroups();
    
    // Mobile improvements - add touch feedback on buttons
    const addTouchFeedback = () => {
        const buttons = document.querySelectorAll('button:not(.option-button), .btn-primary');
        buttons.forEach(button => {
            button.addEventListener('touchstart', () => {
                button.style.opacity = '0.8';
            });
            button.addEventListener('touchend', () => {
                button.style.opacity = '1';
                setTimeout(() => {
                    button.blur();
                }, 300);
            });
        });
    };

    // Initialize mobile improvements
    addTouchFeedback();
    
    // Load the last result from localStorage if available
    const loadLastResult = () => {
        const lastResult = localStorage.getItem(LAST_RESULT_KEY);
        if (lastResult) {
            const data = JSON.parse(lastResult);
            displaySavedRecommendation(data);
            resultContainer.style.display = 'block';
        }
    };
    
    // Load history items from localStorage
    const loadHistory = () => {
        const history = localStorage.getItem(STORAGE_KEY);
        if (history) {
            const historyItems = JSON.parse(history);
            if (historyItems.length > 0) {
                return historyItems;
            }
        }
        return [];
    };
    
    // Save a recommendation to localStorage
    const saveRecommendation = (data) => {
        // Add icon if not present (for backward compatibility)
        if (!data.icon && data.weatherDescription) {
            data.icon = getIconForWeather(data.weatherDescription);
        }
        
        // Save language with the data
        data.language = currentLanguage;
        
        // Save as the last result
        localStorage.setItem(LAST_RESULT_KEY, JSON.stringify(data));
        
        // Add to history
        let history = localStorage.getItem(STORAGE_KEY);
        let historyItems = history ? JSON.parse(history) : [];
        
        // Add new item to the beginning of the array
        historyItems.unshift(data);
        
        // Limit history to 10 items
        if (historyItems.length > 10) {
            historyItems = historyItems.slice(0, 10);
        }
        
        // Save updated history
        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyItems));
        
        // Update the history display
        displayHistoryItems(historyItems);
        historyContainer.style.display = 'block';
    };
    
    // Helper function to get appropriate icon for weather description
    const getIconForWeather = (description) => {
        const lowerDesc = description.toLowerCase();
        if (lowerDesc.includes('clear')) return '01d';
        if (lowerDesc.includes('few clouds')) return '02d';
        if (lowerDesc.includes('scattered')) return '03d';
        if (lowerDesc.includes('broken') || lowerDesc.includes('overcast')) return '04d';
        if (lowerDesc.includes('shower rain')) return '09d';
        if (lowerDesc.includes('rain')) return '10d';
        if (lowerDesc.includes('thunderstorm')) return '11d';
        if (lowerDesc.includes('snow')) return '13d';
        if (lowerDesc.includes('mist') || lowerDesc.includes('fog')) return '50d';
        return '01d'; // default to clear sky
    };
    
    // Display saved recommendation
    const displaySavedRecommendation = (data) => {
        const isMobile = window.innerWidth <= 600;
        
        // Update the currentWeatherData for responsive layouts
        currentWeatherData = {
            main: {
                temp: data.temperature,
                feels_like: data.feelsLike,
                humidity: data.humidity
            },
            weather: [{ 
                description: data.weatherDescription,
                icon: data.icon || '01d' // Default icon if none provided
            }],
            wind: {
                speed: data.windSpeed
            },
            name: data.city,
            sys: {
                country: data.country
            },
            recommendation: data.recommendation,
            language: data.language || currentLanguage
        };
        
        if (isMobile) {
            // Compact mobile layout
            weatherInfoEl.innerHTML = `
                <div class="weather-compact">
                    <div class="weather-location">${data.city}, ${data.country}</div>
                    <div class="weather-main">
                        <span class="temperature-display">${Math.round(data.temperature)}°C</span>
                        <div class="weather-description">
                            <img src="https://openweathermap.org/img/wn/${data.icon || '01d'}.png" alt="${data.weatherDescription}">
                            <span>${data.weatherDescription}</span>
                        </div>
                    </div>
                    <div class="weather-compact-details">
                        <span>${getTranslation('feelsLike')}: ${Math.round(data.feelsLike)}°C</span> · 
                        <span>${getTranslation('humidity')}: ${data.humidity}%</span> · 
                        <span>${getTranslation('wind')}: ${data.windSpeed} m/s</span>
                    </div>
                </div>
            `;
        } else {
            // Desktop layout - fixed to remove duplication
            weatherInfoEl.innerHTML = `
                <div class="weather-location">${data.city}, ${data.country}</div>
                <div class="weather-main">
                    <div class="temperature-container">
                        <span class="temperature-display">${Math.round(data.temperature)}°C</span>
                        <span class="temperature-feels-like">${getTranslation('feelsLike')}: ${Math.round(data.feelsLike)}°C</span>
                    </div>
                    <div class="weather-description">
                        <img src="https://openweathermap.org/img/wn/${data.icon || '01d'}.png" alt="${data.weatherDescription}">
                        <span>${data.weatherDescription}</span>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <span class="detail-label">${getTranslation('humidity')}:</span>
                        <span class="detail-value">${data.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <span class="detail-label">${getTranslation('wind')}:</span>
                        <span class="detail-value">${data.windSpeed} m/s</span>
                    </div>
                </div>
            `;
        }
        
        recommendationEl.textContent = data.recommendation;
        resultContainer.style.display = 'block';
    };
    
    // Display history items
    const displayHistoryItems = (items) => {
        historyList.innerHTML = '';
        
        if (items.length === 0) {
            historyList.innerHTML = `<div class="empty-history">${getTranslation('noHistory')}</div>`;
            return;
        }
        
        const isMobile = window.innerWidth <= 600;
        
        items.forEach((item, index) => {
            const date = new Date(item.timestamp);
            const formattedDate = isMobile 
                ? date.toLocaleDateString() 
                : `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            
            const historyItem = document.createElement('div');
            historyItem.className = 'history-list-item';
            historyItem.dataset.index = index;
            
            if (isMobile) {
                historyItem.innerHTML = `
                    <div>
                        <span class="history-date">${formattedDate}</span>
                        <span class="history-location">${item.city}</span>
                    </div>
                    <div class="history-recommendation">${truncateText(item.recommendation, 60)}</div>
                    <div class="history-details">
                        <span class="history-tag">${item.temperature}°C</span>
                        <span class="history-tag">${shortenWeather(item.weatherDescription)}</span>
                    </div>
                `;
            } else {
                historyItem.innerHTML = `
                    <div class="history-date">${formattedDate}</div>
                    <div class="history-location">${item.city}, ${item.country}</div>
                    <div class="history-recommendation">${item.recommendation}</div>
                    <div class="history-details">
                        <span class="history-tag">${item.temperature}°C (${getTranslation('feelsLike')} ${item.feelsLike}°C)</span>
                        <span class="history-tag">${item.weatherDescription}</span>
                        <span class="history-tag">${getTranslation('styleLabel')}: ${formatStyleName(item.clothingStyle)}</span>
                    </div>
                `;
            }
            
            historyItem.addEventListener('click', () => {
                displaySavedRecommendation(item);
                resultContainer.style.display = 'block';
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            });
            
            historyList.appendChild(historyItem);
        });
    };
    
    // Helper function to truncate text for mobile display
    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };
    
    // Helper function to shorten weather descriptions for mobile display
    const shortenWeather = (description) => {
        const mapping = {
            'scattered clouds': 'scattered',
            'broken clouds': 'broken',
            'clear sky': 'clear',
            'few clouds': 'few clouds',
            'overcast clouds': 'overcast',
            'light rain': 'lt. rain',
            'moderate rain': 'rain',
            'heavy intensity rain': 'heavy rain'
        };
        
        return mapping[description.toLowerCase()] || description;
    };
    
    // Helper function to format style names
    const formatStyleName = (style) => {
        if (currentLanguage === 'en') {
            const styles = {
                'casual': 'Casual',
                'business': 'Business',
                'sporty': 'Sporty',
                'home-office': 'Home Office'
            };
            return styles[style] || style;
        } else if (currentLanguage === 'de') {
            const styles = {
                'casual': 'Lässig',
                'business': 'Business',
                'sporty': 'Sportlich',
                'home-office': 'Homeoffice'
            };
            return styles[style] || style;
        } else if (currentLanguage === 'be') {
            const styles = {
                'casual': 'Паўсядзённы',
                'business': 'Дзелавы',
                'sporty': 'Спартыўны',
                'home-office': 'Хатні офіс'
            };
            return styles[style] || style;
        }
        return style;
    };
    
    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm(getTranslation('clearConfirm'))) {
            localStorage.removeItem(STORAGE_KEY);
            historyList.innerHTML = `<div class="empty-history">${getTranslation('noHistory')}</div>`;
        }
    });

    // Detect location button
    detectLocationBtn.addEventListener('click', () => {
        if (navigator.geolocation) {
            detectLocationBtn.textContent = getTranslation('locatingBtn');
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const cityName = await getCityFromCoords(latitude, longitude);
                        document.getElementById('location').value = cityName;
                        detectLocationBtn.textContent = getTranslation('locateBtn');
                    } catch (error) {
                        console.error('Error getting location:', error);
                        detectLocationBtn.textContent = getTranslation('locateBtn');
                        alert(getTranslation('cityNotFound'));
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    detectLocationBtn.textContent = getTranslation('locateBtn');
                    alert(getTranslation('geolocationError'));
                }
            );
        } else {
            alert(getTranslation('geolocationNotSupported'));
        }
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isMobile = window.innerWidth <= 600;
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = isMobile ? 
            '<span class="loading-dot"></span>' : 
            `${getTranslation('loadingBtn')} <span class="loading-dot"></span>`;
        
        // Blur active elements to hide mobile keyboard
        document.activeElement.blur();
        
        const location = document.getElementById('location').value.trim();
        if (!location) {
            alert(getTranslation('locationRequired'));
            submitBtn.disabled = false;
            submitBtn.textContent = getTranslation('submitBtn');
            return;
        }
        
        // Get values from hidden inputs that store the button group selections
        const temperatureSensitivity = document.querySelector('input[name="temp-sensitivity"]').value;
        const clothingStyle = document.querySelector('input[name="clothing-style"]').value;
        const climateAdaptation = document.querySelector('input[name="climate-adaptation"]').value;
        const movementLevel = document.querySelector('input[name="movement-level"]').value;
        
        try {
            // Get weather data
            const weatherData = await getWeatherData(location);
            
            // Get AI recommendation
            const recommendation = await getClothingRecommendation(
                weatherData,
                temperatureSensitivity,
                clothingStyle,
                climateAdaptation,
                movementLevel,
                currentLanguage
            );
            
            // Display recommendation and weather info
            recommendationEl.textContent = recommendation;
            displayWeatherInfo(weatherData);
            
            // Save to localStorage
            const temperature = Math.round(weatherData.main.temp);
            const feelsLike = Math.round(weatherData.main.feels_like);
            const description = weatherData.weather[0].description;
            
            const recommendationData = {
                timestamp: new Date().toISOString(),
                city: weatherData.name,
                country: weatherData.sys.country,
                temperature: temperature,
                feelsLike: feelsLike,
                weatherDescription: description,
                humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed,
                temperatureSensitivity: temperatureSensitivity,
                clothingStyle: clothingStyle,
                climateAdaptation: climateAdaptation,
                movementLevel: movementLevel,
                recommendation: recommendation,
                icon: weatherData.weather[0].icon,
                language: currentLanguage
            };
            
            saveRecommendation(recommendationData);
            
            resultContainer.style.display = 'block';
            
            // Reset button
            submitBtn.textContent = getTranslation('submitBtn');
            submitBtn.disabled = false;
            
            // Scroll to result with smooth scrolling for better UX
            resultContainer.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } catch (error) {
            console.error('Error:', error);
            alert(getTranslation('genericError'));
            submitBtn.textContent = getTranslation('submitBtn');
            submitBtn.disabled = false;
        }
    });

    // Get city name from coordinates
    async function getCityFromCoords(lat, lon) {
        const response = await fetch(
            `/api/geocode?lat=${lat}&lon=${lon}`
        );
        
        if (!response.ok) {
            throw new Error('Could not find city name');
        }
        
        const data = await response.json();
        if (data.length > 0) {
            return data[0].name;
        }
        throw new Error('Could not find city name');
    }

    // Get weather data
    async function getWeatherData(city) {
        const response = await fetch(
            `/api/weather?city=${encodeURIComponent(city)}&lang=${currentLanguage}`
        );
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(getTranslation('locationNotFound'));
            }
            throw new Error('Failed to fetch weather data');
        }
        
        return await response.json();
    }

    // Display weather information
    const displayWeatherInfo = (data) => {
        const isMobile = window.innerWidth <= 600;
        
        // Store the current weather data for responsive updates
        currentWeatherData = {
            main: {
                temp: data.main.temp,
                feels_like: data.main.feels_like,
                humidity: data.main.humidity
            },
            weather: [{ 
                description: data.weather[0].description,
                icon: data.weather[0].icon
            }],
            wind: {
                speed: data.wind.speed
            },
            name: data.name,
            sys: {
                country: data.sys.country
            }
        };
        
        if (isMobile) {
            // Compact mobile layout
            weatherInfoEl.innerHTML = `
                <div class="weather-compact">
                    <div class="weather-location">${data.name}, ${data.sys.country}</div>
                    <div class="weather-main">
                        <span class="temperature-display">${Math.round(data.main.temp)}°C</span>
                        <div class="weather-description">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                            <span>${data.weather[0].description}</span>
                        </div>
                    </div>
                    <div class="weather-compact-details">
                        <span>${getTranslation('feelsLike')}: ${Math.round(data.main.feels_like)}°C</span> · 
                        <span>${getTranslation('humidity')}: ${data.main.humidity}%</span> · 
                        <span>${getTranslation('wind')}: ${data.wind.speed} m/s</span>
                    </div>
                </div>
            `;
        } else {
            // Desktop layout - fixed to remove duplication
            weatherInfoEl.innerHTML = `
                <div class="weather-location">${data.name}, ${data.sys.country}</div>
                <div class="weather-main">
                    <div class="temperature-container">
                        <span class="temperature-display">${Math.round(data.main.temp)}°C</span>
                        <span class="temperature-feels-like">${getTranslation('feelsLike')}: ${Math.round(data.main.feels_like)}°C</span>
                    </div>
                    <div class="weather-description">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}">
                        <span>${data.weather[0].description}</span>
                    </div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <span class="detail-label">${getTranslation('humidity')}:</span>
                        <span class="detail-value">${data.main.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <span class="detail-label">${getTranslation('wind')}:</span>
                        <span class="detail-value">${data.wind.speed} m/s</span>
                    </div>
                </div>
            `;
        }
    };

    // Get clothing recommendation from OpenAI API
    async function getClothingRecommendation(weatherData, temperatureSensitivity, clothingStyle, climateAdaptation, movementLevel, language = 'en') {
        // Construct a prompt for OpenAI based on user inputs and weather data
        const temperature = Math.round(weatherData.main.temp);
        const feelsLike = Math.round(weatherData.main.feels_like);
        const description = weatherData.weather[0].description;
        const humidity = weatherData.main.humidity;
        const windSpeed = weatherData.wind.speed;
        
        // Create multilingual prompt
        let prompt;
        
        if (language === 'de') {
            prompt = `Basierend auf den folgenden Informationen, empfehle bitte, was ich heute anziehen sollte:
- Wetter: ${description}
- Temperatur: ${temperature}°C (gefühlt wie ${feelsLike}°C)
- Luftfeuchtigkeit: ${humidity}%
- Windgeschwindigkeit: ${windSpeed} m/s
- Temperaturempfindlichkeit: ${temperatureSensitivity}
- Bevorzugter Kleidungsstil: ${clothingStyle}
- Klimaanpassung: ${climateAdaptation}
- Bewegungslevel: ${movementLevel}

Gib mir eine spezifische, hilfreiche Outfit-Empfehlung in ein bis zwei kurzen Sätzen auf Deutsch.`;
        } else if (language === 'be') {
            prompt = `На аснове наступнай інфармацыі, параіце, што мне сёння апрануць:
- Надвор'е: ${description}
- Тэмпература: ${temperature}°C (адчуваецца як ${feelsLike}°C)
- Вільготнасць: ${humidity}%
- Хуткасць ветру: ${windSpeed} м/с
- Адчувальнасць да тэмпературы: ${temperatureSensitivity}
- Пераважны стыль адзення: ${clothingStyle}
- Адаптацыя да клімату: ${climateAdaptation}
- Узровень руху: ${movementLevel}

Дайце мне канкрэтную, карысную рэкамендацыю па адзенню ў адным-двух кароткіх сказах на беларускай мове.`;
        } else {
            prompt = `Based on the following information, recommend what I should wear today:
- Weather: ${description}
- Temperature: ${temperature}°C (feels like ${feelsLike}°C)
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} m/s
- Temperature Sensitivity: ${temperatureSensitivity}
- Preferred Clothing Style: ${clothingStyle}
- Climate Adaptation: ${climateAdaptation}
- Movement Level: ${movementLevel}

Give me a specific, helpful outfit recommendation in one to two short sentences in English.`;
        }

        try {
            const response = await fetch('/api/recommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });
            
            const data = await response.json();
            
            if (data.error) {
                console.error('OpenAI API error:', data.error);
                return getTranslation('apiError');
            }
            
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error calling recommendation API:', error);
            return getTranslation('apiError');
        }
    }
    
    // Load previous results when the page loads
    loadLastResult();
    loadHistory();
    
    // Load history on page load
    const historyFromStorage = loadHistory();
    displayHistoryItems(historyFromStorage);
    
    // Update history display on window resize
    window.addEventListener('resize', () => {
        const historyFromStorage = loadHistory();
        displayHistoryItems(historyFromStorage);
    });
    
    // Initialize the interface with the correct language
    translateInterface();
}); 