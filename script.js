const timeEL = document.getElementById('time')
const dateEl = document.getElementById('date')
const currentWeatherItemEl = document.getElementById('current-weather-items')
const timeZone = document.getElementById('timezone')
const country = document.getElementById('country')
const weatherForecastEl = document.getElementById('weather-forecast')
const currenTempEl = document.getElementById('current-temp')

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

setInterval(() => {
    const time = new Date()
    const month = time.getMonth()
    const date = time.getDate()
    const day = time.getDay()
    const hour = time.getHours()
    const hoursIn12HrFormat = (hour >= 13 ? hour % 12 : hour)
    const minute = time.getMinutes()
    const ampm = hour >= 12 ? 'PM' : "AM"

    timeEL.innerHTML = `${(hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat)} : ${(minute < 10 ? '0' + minute : minute)} <span id="am-pm">${ampm}</span> `

    dateEl.innerHTML = ` ${days[day]}, ${date} ${months[month]} `
}, 1000)

getWeatherData()

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`).then(res => res.json()).then(data => {
            console.log(data)
            showWeatherData(data)
        })
    })

    function showWeatherData(data) {
        let { humidity, pressure, sunrise, sunset, wind_speed } = data.current

        timeZone.innerHTML = data.timezone
        country.innerHTML = `${data.lat}N  ${data.lon}E`


        currentWeatherItemEl.innerHTML = ` 
         <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
         </div>
        <div class="weather-item">
            <div>pressure</div>
            <div>${pressure} hPa</div>
        </div>
        <div class="weather-item">
            <div>Wind Speed</div>
            <div>${wind_speed} m/s</div>
        </div>
        <div class="weather-item">
            <div>Sunrise</div>
            <div>${window.moment(sunrise * 1000).format('hh:mm a')}</div>
        </div>
        <div class="weather-item">
            <div>Sunset</div>
            <div>${window.moment(sunset * 1000).format('hh:mm a')}</div>
        </div>
        `

        let otherDayForecast = ``

        data.daily.forEach((d, i) => {
            if (i === 0) {
                currenTempEl.innerHTML = `
               
                <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}@4x.png" alt="weather-icon" class="w-icon">
                <div class="other">
                        <div class="day">${window.moment(d.dt * 1000).format('ddd')}</div>
                        <div class="temp">Day :  ${d.temp.day} &#176; C </div>
                        <div class="temp">Night : ${d.temp.night} &#176; C </div>
                    </div>
                `
            } else {
                otherDayForecast += `
                <div class="weather-forecast-item">
                    <div class="day">${window.moment(d.dt * 1000).format('ddd')}</div>
                    <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png" alt="weather-icon" class="w-icon">
                    <div class="temp">Day :  ${d.temp.day} &#176; C </div>
                    <div class="temp">Night : ${d.temp.night} &#176; C </div>
                </div>
                `
            }
        })
        weatherForecastEl.innerHTML = otherDayForecast
    }
}
