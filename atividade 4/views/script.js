document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("city-input").value;
  getWeather(city);
});

async function getWeather(city) {
  const resultDiv = document.getElementById("weather-result");

  // Validação para evitar buscas vazias no frontend [cite: 46]
  if (!city) {
    resultDiv.innerHTML = `<p>Por favor, digite o nome de uma cidade.</p>`;
    return;
  }

  try {
    const response = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();

    if (response.ok) {
      // Exibição dinâmica dos resultados na página [cite: 13]
      resultDiv.innerHTML = `
                <div class="weather-info">
                    <h2>${data.city}, ${
        data.country
      }</h2> <img class="weather-icon" src="http://openweathermap.org/img/wn/${
        data.icon
      }@2x.png" alt="Ícone do tempo"> <p><strong>Temperatura:</strong> ${data.temp.toFixed(
        1
      )}°C</p> <p><strong>Sensação Térmica:</strong> ${data.feels_like.toFixed(
        1
      )}°C</p> <p><strong>Umidade:</strong> ${
        data.humidity
      }%</p> <p><strong>Condição:</strong> ${data.description}</p> </div>
            `;
    } else {
      // Exibe mensagem de erro da API [cite: 45]
      resultDiv.innerHTML = `<p>${data.error}</p>`;
    }
  } catch (error) {
    resultDiv.innerHTML = `<p>Erro ao conectar ao servidor. Tente novamente mais tarde.</p>`;
  }
}
