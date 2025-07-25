const apiKey = "5042eb10ea0b23047d48dd027c450e05"; // Your OpenWeatherMap API key
const weatherDiv = document.getElementById("weather");

// ✅ Auto-fetch weather using geolocation on page load
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByCoords(lat, lon);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            weatherDiv.innerHTML = "❌ Location access denied. Please allow location permission.";
            break;
          case error.POSITION_UNAVAILABLE:
            weatherDiv.innerHTML = "📡 Location info unavailable.";
            break;
          case error.TIMEOUT:
            weatherDiv.innerHTML = "⌛ Location request timed out.";
            break;
          default:
            weatherDiv.innerHTML = "❓ Unknown geolocation error.";
        }
      }
    );
  } else {
    weatherDiv.innerHTML = "⚠ Geolocation is not supported by this browser.";
  }
};

// 🔍 Manual city input weather fetch
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    weatherDiv.innerHTML = `<p style="color:red;">Please enter a city name.</p>`;
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  weatherDiv.innerHTML = "🔄 Loading weather...";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// 📍 Get weather using coordinates
async function getWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  weatherDiv.innerHTML = "🔄 Detecting your location and fetching weather...";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Unable to fetch weather from coordinates");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}

// 🌤 Show weather info
function displayWeather(data) {
  const temp = data.main.temp;
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = data.weather[0].icon;

  weatherDiv.innerHTML = `
    <h2>🌍 Weather in ${data.name}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
    <p>🌡 Temperature: ${temp} °C</p>
    <p>☁ Condition: ${desc}</p>
    <p>💧 Humidity: ${humidity}%</p>
    <p>💨 Wind Speed: ${wind} m/s</p>
  `;
}
