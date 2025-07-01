async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const apiKey = "5042eb10ea0b23047d48dd027c450e05"; // Paste your real API key here!
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const weatherDiv = document.getElementById("weather");
  weatherDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();
    console.log(data);
    const temp = data.main.temp;
    const desc = data.weather[0].description;
    const humidity = data.main.humidity;
    const wind = data.wind.speed;
    const icon = data.weather[0].icon;

    weatherDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather icon">
      <p>🌡️ Temperature: ${temp} °C</p>
      <p>☁️ Condition: ${desc}</p>
      <p>💧 Humidity: ${humidity}%</p>
      <p>💨 Wind Speed: ${wind} m/s</p>
    `;
  } catch (error) {
    weatherDiv.innerHTML = `<p style="color:red;">${error.message}</p>`;
  }
}
