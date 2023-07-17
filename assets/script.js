// that city is added to the search history

//WHEN I view current weather conditions for that city THEN I am presented with the city name, the date, an icon representation of weather conditions

//WHEN I view future weather conditions for that city THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions

//WHEN I click on a city in the search history THEN I am again presented with current and future conditions for that city

let APIkey = "5ae0c255890061ed7b0bad5e03c377e9"
let fetchButton = document.getElementById('search-button')
let historyEl = document.getElementById('history')

function getApi(cityName) {
    let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=' + APIkey + '&units=imperial'
    fetch(requestUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        console.log(data)
        document.querySelector("#city-name").textContent = data.name
        //document.querySelector("date-today") =  
        document.querySelector("#temp").textContent = "Temperature: " + data.main.temp + "F"
        document.querySelector("#wind").textContent = "Wind: " + data.wind.speed + "mph"
        document.querySelector("#humidity").textContent = "Humidity: " + data.main.humidity + "%"
        forecast(data.coord.lat, data.coord.lon)
    })
}

function forecast (latitude, longitude) {
    let requestUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&appid=' + APIkey + '&units=imperial'
    let container = document.querySelector('#container')
    fetch(requestUrl).then(function(response) {
        console.log(response)
        return response.json()
    }).then(function(data) {
        console.log(data)
        //reset the innerHTML of the container (empty it)
        container.innerHTML = ""
        for (let i = 0; i < data.list.length; i++) {
            if (data.list[i].dt_txt.includes("12:00:00")) {
                let card = document.createElement("div")
                let date = document.createElement("p")
                let temp = document.createElement("li")
                let wind = document.createElement("li")
                let humidity = document.createElement("li")
                console.log(data.list[i])
                date.textContent = data.list[i].dt_txt.split(' ')[0]
                temp.textContent = "Temperature: " + data.list[i].main.temp + "F"
                wind.textContent = "Wind: " + data.list[i].wind.speed + "mph"
                humidity.textContent = "Humidity: " + data.list[i].main.humidity + "%"
                container.appendChild(card)
                card.appendChild(date)
                card.appendChild(temp)
                card.appendChild(wind)
                card.appendChild(humidity)
            }
        }
    })
}

function createHistoryButton(citySearch){
    let button = document.createElement('button')
    button.textContent = citySearch
    button.addEventListener('click', function(event){
        let cityName = event.target.innerText
        getApi(cityName)
    })
    historyEl.appendChild(button)
}

function getStoredCities () {
    let storedCities = JSON.parse(localStorage.getItem("history")) || []
    return storedCities
}

function loadSearchHistory() {
    let storedCities = getStoredCities()
    for (let i=0; i<storedCities.length; i++) {
        createHistoryButton(storedCities[i])
    }
}

function addSearchHistory(cityName) {
    let storedCities = getStoredCities()
    storedCities.push(cityName)
    localStorage.setItem("history", JSON.stringify(storedCities))
}

fetchButton.addEventListener('click', function() {
    let citySearch = document.querySelector("#city-search").value
    getApi(citySearch)
    createHistoryButton(citySearch)
    addSearchHistory(citySearch)
 });

loadSearchHistory()