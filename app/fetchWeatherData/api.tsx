import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native';
const API_KEY = "141a6d247057f6341b6db9aaf070e855"

const api = () => {
    const [weatherData,setWeatherData]=useState(null);
    const [loading,setLoading]=useState(true);
    async function fetchWeatherData(cityName:any){
        setLoading(false);
        const API =`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
        try {
            const response=await fetch(API);
            if(response.status==200){
                const data=await response.json();
                setWeatherData(data)
            }else{
                setWeatherData(null)
            }
            
        } catch (error) {
            console.log(error)
            
        }
    }
    useEffect(()=>{
        fetchWeatherData("Kathmandu");
        console.log(weatherData)
    },[])
  return (
    <View>
      <Text>
       weather app
      </Text>
    </View>
  )
}

export default api
