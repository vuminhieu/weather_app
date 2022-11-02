/* Fetching Data from OpenWeatherMap API */
let Add = "Hanoi"
const accessKeyApiLocate = "pk.eyJ1IjoiYW5ocXQxIiwiYSI6ImNsOWI4c2F3ZjB5d2Mzdm8zaHE0OGs2ZDkifQ.EBWL6ETSXIZWwyr2E2wcyQ"
const APILocate = `https://api.mapbox.com/geocoding/v5/mapbox.places/${Add}.json?access_token=${accessKeyApiLocate}`

let weather = {
    apiKey: "aba6ff9d6de967d5eac6fd79114693cc",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const {name} = data;
        const {icon, description} = data.weather[0];
        const {temp, humidity} = data.main;
        const {speed} = data.wind;
        document.querySelector(".city").innerText = "Thời tiết tại " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = " Lượng mưa : " + humidity + "%";
        document.querySelector(".wind").innerText = "Tốc độ gió: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");
        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
        console.log(value);
    },
};

/* Fetching Data from OpenCageData Geocoder */
let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var apikey = "90a096f90b3e4715b6f2e536d934c5af";
        var api_url = "https://api.opencagedata.com/geocode/v1/json";
        var request_url =
            api_url +
            "?" +
            "key=" +
            apikey +
            "&q=" +
            encodeURIComponent(latitude + "," + longitude) +
            "&pretty=1" +
            "&no_annotations=1";

        var request = new XMLHttpRequest();
        request.open("GET", request_url, true);

        request.onload = function () {

            if (request.status == 200) {
                var data = JSON.parse(request.responseText);
                weather.fetchWeather(data.results[0].components.city);
                // console.log(data.results[0].components.city)
            } else if (request.status <= 500) {
                console.log("unable to geocode! Response code: " + request.status);
                var data = JSON.parse(request.responseText);
                console.log("error msg: " + data.status.message);
            } else {
                console.log("server error");
            }
        };

        request.onerror = function () {
            console.log("unable to connect to server");
        };

        request.send();
    },
    getLocation: function () {
        function success(data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error);
        } else {
            weather.fetchWeather("Manipal");
        }
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
        if (event.key == "Enter") {
            weather.search();
        }
    });

weather.fetchWeather("Ha Noi");
geocode.getLocation();

const test = document.getElementById("22")
const test1 = document.getElementById("44")

test1.addEventListener("click", () => {
    // const valueInput = test.value
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${valueInput}.json?access_token=${accessKeyApiLocate}`, {
        method: "GET",
    }).then((res) => res.json())
        .then((data) =>
        { console.log(data.features)
            let long = data.features
            let lat = data.features
        saveDataToFirebase(long,lat);
        })
})

test.addEventListener("keyup", (event) => {
    if (event.key == "Enter") {
        const valueInput = test.value
        fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${valueInput}.json?access_token=${accessKeyApiLocate}`,
            {
                method: "GET",
            }).then((res) => res.json()).then((data) => { console.log(data.features)
            let long = data.features
            let lat = data.features
            saveDataToFirebase(long,lat);
        })
    }

})

// connect firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
function saveDataToFirebase(longitude,latitude) {
    const firebaseConfig = {
        apiKey: "AIzaSyCsJBR0Mm23RUBqmdjEhvY8huGOU0egqAs",
        authDomain: "iot-weather-f35d1.firebaseapp.com",
        databaseURL: "https://iot-weather-f35d1-default-rtdb.firebaseio.com",
        projectId: "iot-weather-f35d1",
        storageBucket: "iot-weather-f35d1.appspot.com",
        messagingSenderId: "581915043211",
        appId: "1:581915043211:web:0ef0b32593561c677f3b8e",
        measurementId: "G-FP2D1M48SG"
    };
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    console.log(database)
    // Code send to firebase ở đây
    set(ref(database, 'coordinates'), {
        longitude: longitude,
        latitude: latitude
    })
}

//test
window.addEventListener('DOMContentLoaded', (event) => {
    saveDataToFirebase(2, 4);
});

