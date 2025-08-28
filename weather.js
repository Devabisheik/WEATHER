const apiKey = "5042eb10ea0b23047d48dd027c450e05"; // Your OpenWeatherMap API key
let weatherDiv = document.getElementById("weather");
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
            document.getElementById("condition").innerHTML =
              "❌ Location access denied. Please allow location permission.";
            break;
          case error.POSITION_UNAVAILABLE:
            document.getElementById("condition").innerHTML =
              "📡 Location info unavailable.";
            break;
          case error.TIMEOUT:
            document.getElementById("condition").innerHTML =
              "⌛ Location request timed out.";
            break;
          default:
            document.getElementById("condition").innerHTML =
              "❓ Unknown geolocation error.";
        }
      }
    );
  } else {
    document.getElementById("condition").innerHTML =
      "⚠ Geolocation is not supported by this browser.";
  }
};

// 🔍 Manual city input weather fetch
async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") {
    document.getElementById("condition").innerHTML =
      `<p style="color:red;">Please enter a city name.</p>`;
    return;
  }

  // ✅ Show loading in condition only
  document.getElementById("condition").innerHTML = "🔄 Loading weather...";
  document.getElementById("temperature").innerHTML = "";
  document.getElementById("icon").innerHTML = "";
  document.getElementById("place").innerHTML = "";
  document.getElementById("date").innerHTML = "";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    document.getElementById("condition").innerHTML =
      `<p style="color:red;">${error.message}</p>`;
  }
}

// 📍 Get weather using coordinates
async function getWeatherByCoords(lat, lon) {
  document.getElementById("condition").innerHTML =
    "🔄 Detecting your location and fetching weather...";
  document.getElementById("temperature").innerHTML = "";
  document.getElementById("icon").innerHTML = "";
  document.getElementById("place").innerHTML = "";
  document.getElementById("date").innerHTML = "";

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Unable to fetch weather from coordinates");

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    document.getElementById("condition").innerHTML =
      `<p style="color:red;">${error.message}</p>`;
  }
}

// 🌄 Background image based on condition
function setBackgroundImg(weather) {
  const main = weather.main;
  const description = weather.description.toLowerCase();

  if (main === "Thunderstorm") {
    weatherDiv.style.backgroundImage = "url('IMAGES/thunder.jpeg')";
  } else if (main === "Drizzle") {
    weatherDiv.style.backgroundImage = "url('IMAGES/dizzle.jpeg')";
  } else if (main === "Rain") {
    weatherDiv.style.backgroundImage = "url('IMAGES/rain.jpg')";
  } else if (main === "Snow") {
    weatherDiv.style.backgroundImage = "url('IMAGES/snow.jpeg')";
  } else if (
    main === "Atmosphere" || description.includes("mist") ||
    description.includes("haze") || description.includes("smoke")
  ) {
    weatherDiv.style.backgroundImage = "url('IMAGES/mist.jpeg')";
  } else if (
    main === "Clouds" || description.includes("overcast")
  ) {
    weatherDiv.style.backgroundImage = "url('IMAGES/cloudy.png')";
  } else {
    // default to sunny
    weatherDiv.style.backgroundImage = "url('IMAGES/sunny.jpeg')";
  }
}

// 🌤 Show weather info
function displayWeather(data) {
  const temp = data.main.temp;
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const icon = data.weather[0].icon;

  setBackgroundImg(data.weather[0]);

  document.getElementById("icon").innerHTML =
    `<img src="https://openweathermap.org/img/wn/${icon}@2x.png" width="150" alt="Weather icon">`;

  document.getElementById("temperature").innerHTML =
    ` ${temp} °C`;

  document.getElementById("condition").innerHTML =
    `${desc}`.charAt(0).toUpperCase() + desc.slice(1);

  document.getElementById("place").innerHTML =
    `${data.name}`;
  document.getElementById("humidity").innerHTML = `
  <div style="display:flex; justify-content:space-around; width:100%;">
    <span>💧 Humidity: ${humidity}%</span>
    <span>💨 Wind Speed: ${wind} m/s</span>
  </div>
`;
  document.getElementById("date").innerHTML =
    `${new Date().toLocaleString()}`;
}
