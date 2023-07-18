// Establish needed variables for later
const form = document.querySelector('form');
const cityInput = document.querySelector('#city-Input');
const forecastList = document.querySelector('#forecastList');
const savedCity = document.querySelector('#savedCity');
const apiKey = 'bacf7c316508a20ede6890808170cc28';

let city;

// Adds function to the submit button
form.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent the form from submitting and refreshing the page
  city = cityInput.value;
  // Check if the city is not empty
  if (city.trim() !== '') {
    // Get the existing cities from the localStorage, or create an empty array if it's not set yet
    const cities = JSON.parse(localStorage.getItem('cities') || '[]');
    if (!cities.includes(city)) {
      // Add the new city to the array
      if (cities != city) {
        cities.push(city);
        // Save the updated array to the localStorage
        localStorage.setItem('cities', JSON.stringify(cities));
        showCities();
      }
    }
  }
  getData(city) // Searches for the name to run the code for it
});

// Creates a list of previously searched cities
function showCities() {
  if (savedCity) {
    savedCity.innerHTML = '';
  }
  const cities1 = JSON.parse(localStorage.getItem('cities') || '[]');
  cities1.forEach(city => {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.classList.add('historyBtn');
    if (savedCity) {
      savedCity.appendChild(listItem);
      listItem.addEventListener('click', () => {
        const selectedCity = listItem.textContent;
        cityInput.value = selectedCity;
        getData(selectedCity);
      });
    }
  });
}

showCities();
// Shows history of previous searches by adding a click function to every list item being created
const getData = (city) => {
  // Make a request to the OpenWeatherMap API to get the weather data for the specified city
  console.log(city)
  // Fetch API
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      // Loop this array with a second function for a 5 day forecast. The value of the variables will change depending on the chosen array.
      const temperature = data.main.temp;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const Day1Weather = document.querySelector('#day1')
      const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
      Day1Weather.innerHTML =
        `
        <li>Temperature: ${temperature} 'C </li>
        <li>Humidity: ${humidity} % </li>
        <li>Wind Speed: ${windSpeed} km/h <img src=${iconURL}></li>
        `
        ;
    })

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)

    .then(response => response.json())

    .then(data => {
      forecastList.innerHTML = '';
      let count = 0;

      for (var i = 0; i < data.list.length; i++) {
        const newDate = data.list[i].dt_txt;

        if (newDate.split(" ").pop() === "12:00:00") {
          // As long as there is data, this will loop, which data gets assigned to
          const forecastWeather_Icon = data.list[i].weather[0].icon;
          const forecast_temp = Math.floor(data.list[i].main.temp);
          const forecast_humidity = data.list[i].main.humidity;
          const forecast_windspeed = data.list[i].wind.speed;
          const dtText = data.list[i].dt_txt;
          // Assign values to html doc so they can be displayed
          var createCard = document.createElement("div");
          createCard.className = "card-body";
          createCard.innerHTML += `<h4>Future Forecast</h4>`;
          createCard.innerHTML += `<p class="temp">Temp: ${forecast_temp} 'C`;
          createCard.innerHTML += `<img src="https://openweathermap.org/img/w/${forecastWeather_Icon}.png">`;
          createCard.innerHTML += `<p>Humidity: ${forecast_humidity} %`;
          createCard.innerHTML += `<p>Wind: ${forecast_windspeed} km/h`;
          createCard.innerHTML += `<p>Date: ${dtText}`;
          forecastList.appendChild(createCard);
          count++;
          // If count === 4, break out of the loop once 5 forecast cards have been created
        }
      }
    });
}