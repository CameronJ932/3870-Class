const strWeatherAPIURL = 'https://api.open-meteo.com/v1/forecast?latitude=36.1693184&longitude=-85.508096&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,weather_code,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,weather_code,cloud_cover,soil_temperature_0cm,wind_speed_10m,wind_speed_80m,wind_direction_10m,wind_direction_80m,wind_gusts_10m,soil_moisture_0_to_1cm,visibility,uv_index,is_day&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code,cloud_cover&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch'

getWeatherData();
async function getWeatherData(num){
    const objResponse = await fetch(strWeatherAPIURL,
    {
        method:'GET',
        headers: {
            'Content-Type':'application/json'
        }
    }
    )

    //Thing
    if(!objResponse.ok){
        alert('Error getting data')
    } else{
        const objData = await objResponse.json()
        
        // Set current date
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.querySelector('#currentDate').innerHTML = today.toLocaleDateString('en-US', options);
        
        //console.log(objData.current.temperature_2m)
        document.querySelector('#lblCurrentTemp').innerHTML = objData.current.temperature_2m + '°'
        let strMaxTemp = objData.daily.temperature_2m_max[0]
        let strMinTemp = objData.daily.temperature_2m_min[0]
        document.querySelector('#lblLow').innerHTML = strMinTemp + '°'
        document.querySelector('#lblHigh').innerHTML = strMaxTemp + '°'
        document.querySelector('#lblMean1').innerHTML = objData.daily.temperature_2m_mean[1] + '°'
        document.querySelector('#lblMean2').innerHTML = objData.daily.temperature_2m_mean[2] + '°'
        document.querySelector('#lblMean3').innerHTML = objData.daily.temperature_2m_mean[3] + '°'
        document.querySelector('#lblMean4').innerHTML = objData.daily.temperature_2m_mean[4] + '°'
        document.querySelector('#lblMean5').innerHTML = objData.daily.temperature_2m_mean[5] + '°'
        document.querySelector('#lblMean6').innerHTML = objData.daily.temperature_2m_mean[6] + '°'
        let strCurrentWeatherCode = objData.current.weather_code
        let strDailyWeatherCodes = objData.daily.weather_code

        function getWeatherIcon(day) {
            if([0,1,2,3].includes(strDailyWeatherCodes[day])) return 'bi-brightness-high';
            if([45,48].includes(strDailyWeatherCodes[day])) return 'bi-cloud-haze';
            if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(strDailyWeatherCodes[day])) return 'bi-cloud-rain';
            if([71,73,75,77].includes(strDailyWeatherCodes[day])) return 'bi-snow';
            if([95,96,99].includes(strDailyWeatherCodes[day])) return 'bi-cloud-lightning-rain';
            return 'bi-cloud'; // default icon
        }

        // Set current weather icon
        document.querySelector('#lblIcon').innerHTML = `<i class="bi ${getWeatherIcon(strCurrentWeatherCode)}"></i>`;

        // Set daily weather icons for each day
        for(let i = 1; i <= 6; i++) {
            document.querySelector(`#lblDIcon${i}`).innerHTML = `<i class="bi ${getWeatherIcon(strDailyWeatherCodes[i])}"></i>`;
        }
    }
}