
// ============================================
// IoT WEATHER MONITORING DASHBOARD
// HTML + CSS + JAVASCRIPT
// ============================================


// --------------------------------------------
// DEFAULT LOCATION
// --------------------------------------------

let currentLatitude = 17.3850;
let currentLongitude = 78.4867;
let currentCity = "Hyderabad";
let currentCountry = "India";


// --------------------------------------------
// LIVE CLOCK
// --------------------------------------------

function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

setInterval(updateClock, 1000);

updateClock();


// --------------------------------------------
// WEATHER SEARCH
// --------------------------------------------

async function searchWeather() {

    const cityInput =
        document.getElementById("city").value.trim();

    if (cityInput === "") {

        alert("Please enter a city name.");

        return;
    }

    try {

        const locationURL =
            "https://geocoding-api.open-meteo.com/v1/search" +
            "?name=" +
            encodeURIComponent(cityInput) +
            "&count=1" +
            "&language=en" +
            "&format=json";


        const locationResponse =
            await fetch(locationURL);


        if (!locationResponse.ok) {

            throw new Error("Location search failed.");

        }


        const locationData =
            await locationResponse.json();


        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            alert("City not found.");

            return;
        }


        const location =
            locationData.results[0];


        currentLatitude =
            location.latitude;

        currentLongitude =
            location.longitude;

        currentCity =
            location.name;

        currentCountry =
            location.country;


        getWeatherData(
            currentLatitude,
            currentLongitude,
            currentCity,
            currentCountry
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to search for the city."
        );

    }
}


// --------------------------------------------
// GET WEATHER DATA
// --------------------------------------------

async function getWeatherData(
    latitude,
    longitude,
    city,
    country
) {

    try {

        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + latitude +
            "&longitude=" + longitude +
            "&current=" +
            "temperature_2m," +
            "relative_humidity_2m," +
            "apparent_temperature," +
            "pressure_msl," +
            "wind_speed_10m," +
            "weather_code," +
            "visibility" +
            "&daily=sunrise,sunset" +
            "&timezone=auto";


        const response =
            await fetch(weatherURL);


        if (!response.ok) {

            throw new Error(
                "Weather request failed."
            );

        }


        const data =
            await response.json();


        const weather =
            data.current;


        // ------------------------------------
        // LOCATION
        // ------------------------------------

        document.getElementById(
            "cityName"
        ).innerHTML = city;


        document.getElementById(
            "country"
        ).innerHTML = country;


        // ------------------------------------
        // TEMPERATURE
        // ------------------------------------

        document.getElementById(
            "temp"
        ).innerHTML =
            Math.round(
                weather.temperature_2m
            );


        // ------------------------------------
        // FEELS LIKE
        // ------------------------------------

        document.getElementById(
            "feels"
        ).innerHTML =
            Math.round(
                weather.apparent_temperature
            );


        // ------------------------------------
        // HUMIDITY
        // ------------------------------------

        document.getElementById(
            "humidity"
        ).innerHTML =
            weather.relative_humidity_2m;


        // ------------------------------------
        // WIND SPEED
        // ------------------------------------

        document.getElementById(
            "wind"
        ).innerHTML =
            Math.round(
                weather.wind_speed_10m
            );


        // ------------------------------------
        // PRESSURE
        // ------------------------------------

        document.getElementById(
            "pressure"
        ).innerHTML =
            Math.round(
                weather.pressure_msl
            );


        // ------------------------------------
        // VISIBILITY
        // ------------------------------------

        document.getElementById(
            "visibility"
        ).innerHTML =
            (
                weather.visibility / 1000
            ).toFixed(1);


        // ------------------------------------
        // SUNRISE
        // ------------------------------------

        document.getElementById(
            "sunrise"
        ).innerHTML =
            formatTime(
                data.daily.sunrise[0]
            );


        // ------------------------------------
        // SUNSET
        // ------------------------------------

        document.getElementById(
            "sunset"
        ).innerHTML =
            formatTime(
                data.daily.sunset[0]
            );


        // ------------------------------------
        // WEATHER ICON
        // ------------------------------------

        updateWeatherIcon(
            weather.weather_code
        );


        console.log(
            "Weather data updated successfully."
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to load weather data."
        );

    }
}


// --------------------------------------------
// WEATHER ICON AND CONDITION
// --------------------------------------------

function updateWeatherIcon(code) {

    let icon = "☀️";

    let description =
        "Clear Sky";


    if (code === 0) {

        icon = "☀️";

        description =
            "Clear Sky";

    }

    else if (
        code === 1 ||
        code === 2
    ) {

        icon = "🌤️";

        description =
            "Partly Cloudy";

    }

    else if (code === 3) {

        icon = "☁️";

        description =
            "Overcast";

    }

    else if (
        code === 45 ||
        code === 48
    ) {

        icon = "🌫️";

        description =
            "Foggy";

    }

    else if (
        code >= 51 &&
        code <= 67
    ) {

        icon = "🌧️";

        description =
            "Rain";

    }

    else if (
        code >= 71 &&
        code <= 77
    ) {

        icon = "❄️";

        description =
            "Snow";

    }

    else if (
        code >= 80 &&
        code <= 82
    ) {

        icon = "🌦️";

        description =
            "Rain Showers";

    }

    else if (
        code >= 95
    ) {

        icon = "⛈️";

        description =
            "Thunderstorm";

    }


    document.getElementById(
        "icon"
    ).innerHTML = icon;


    document.getElementById(
        "condition"
    ).innerHTML =
        icon + " " + description;
}


// --------------------------------------------
// FORMAT TIME
// --------------------------------------------

function formatTime(time) {

    const date =
        new Date(time);


    return date.toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// --------------------------------------------
// GET USER LOCATION
// --------------------------------------------

function getLocation() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported by your browser."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            currentLatitude =
                position.coords.latitude;

            currentLongitude =
                position.coords.longitude;


            getWeatherData(

                currentLatitude,

                currentLongitude,

                "Your Location",

                ""

            );

        },


        function(error) {

            console.error(error);

            alert(
                "Please allow location access."
            );

        }

    );
}


// --------------------------------------------
// ENTER KEY SEARCH
// --------------------------------------------

document
    .getElementById("city")
    .addEventListener(
        "keypress",
        function(event) {

            if (event.key === "Enter") {

                searchWeather();

            }

        }
    );


// --------------------------------------------
// INITIAL WEATHER
// --------------------------------------------

getWeatherData(

    currentLatitude,

    currentLongitude,

    currentCity,

    currentCountry

);


// --------------------------------------------
// AUTOMATIC WEATHER UPDATE
// Every 10 minutes
// --------------------------------------------

setInterval(

    function() {

        getWeatherData(

            currentLatitude,

            currentLongitude,

            currentCity,

            currentCountry

        );

    },

    10 * 60 * 1000

);
