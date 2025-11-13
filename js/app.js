const strWeatherAPIURL = 'https://api.open-meteo.com/v1/forecast?latitude=36.1693184&longitude=-85.508096&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,weather_code,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&hourly=temperature_2m,relative_humidity_2m,precipitation,precipitation_probability,weather_code,cloud_cover,soil_temperature_0cm,wind_speed_10m,wind_speed_80m,wind_direction_10m,wind_direction_80m,wind_gusts_10m,soil_moisture_0_to_1cm,visibility,uv_index,is_day&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code,cloud_cover&timezone=America%2FChicago&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch'

        function getWeatherIcon(code) {
                    // This function now takes the weather CODE
                    if ([0, 1].includes(code)) return 'bi-brightness-high text-warning'
                    if ([2, 3].includes(code)) return 'bi-cloud-sun text-light-emphasis'
                    if ([45, 48].includes(code)) return 'bi-cloud-haze text-secondary'
                    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'bi-cloud-rain text-primary'
                    if ([71, 73, 75, 77].includes(code)) return 'bi-snow text-info'
                    if ([95, 96, 99].includes(code)) return 'bi-cloud-lightning-rain text-danger'
                    return 'bi-cloud'; // default icon
                }

        function getWeatherColor(temp)
        {
            if(temp < 60)
            {
                return "temp-cold";
            }
            if(temp < 70)
            {
                return "temp-cool";
            }
            if(temp >= 80)
            {
                return "temp-hot";
            }
            else
            {
                return "temp-warm";
            }
        }

        getWeatherData()


        async function getWeatherData() {
            
            try {
                const objResponse = await fetch(strWeatherAPIURL, {
                    method:'GET',
                    headers: { 'Content-Type':'application/json' }
                });


                if(!objResponse.ok) {
                  alert('Error getting data');
                  return; 
                } 

                const objData = await objResponse.json()
  
                // Set current date
                const today =  new Date(objData.daily.time[0])
                const dateOptions = {weekday: 'long', month: 'long', day: 'numeric'}
                document.querySelector('#date').innerHTML = today.toLocaleDateString('en-US', dateOptions)

                // setting up our lets so we can call what we need
                let strMaxTemp =(objData.daily.temperature_2m_max[0])
                let strMinTemp =(objData.daily.temperature_2m_min[0])
                let strCurrentWeatherCode = objData.current.weather_code
                let strDailyWeatherCodes = objData.daily.weather_code
                let strDailyMeanTemp = objData.daily.temperature_2m_mean
                let strCurrentTemp =(objData.current.temperature_2m)

                // injecting our weather data
                document.querySelector('#lblLow').innerHTML = strMinTemp + '°'
                document.querySelector('#lblHigh').innerHTML = strMaxTemp + '°'
                document.querySelector('#lblCurrentTemp').innerHTML = strCurrentTemp + '°'
                document.querySelector('#lblIcon').innerHTML = '<i class="bi ' + getWeatherIcon(strCurrentWeatherCode) + '"></i>'

                        for(let i = 1; i <= 6; i++) 

                // Loop for the 6-day forecast
                for(let i = 1; i <= 6; i++) {
                    const temp = Math.round(strDailyMeanTemp[i])
                    const iconClass = getWeatherIcon(strDailyWeatherCodes[i])
                    const colorClass = getWeatherColor(temp)

                    const dayDate = new Date(objData.daily.time[i])
                    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' })

                    let tempSpan = document.querySelector('#lblMean' + i)

                    tempSpan.classList.remove('temp-hot', 'temp-warm', 'temp-cold', 'temp-cool')
                    tempSpan.classList.add(colorClass)

                    document.querySelector('#lblDay' + i).innerHTML = dayName
                    document.querySelector('#lblMean' + i).innerHTML = temp + '°'
                    document.querySelector('#lblDIcon' + i).innerHTML = '<i class="bi ' + iconClass + '"></i>'
                }
            
            } catch (error) {
                alert("Failed to get weather data: " + error)
            }
        }
    