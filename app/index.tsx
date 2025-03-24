import { ActivityIndicator, Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { theme } from "@/theme";
import { CalendarDaysIcon, MagnifyingGlassIcon, MapPinIcon,EyeDropperIcon, SunIcon } from 'react-native-heroicons/outline'
import { useCallback, useEffect, useState } from "react";

import { fetchLocations, fetchWeatherForecast } from "@/api/weather";
// import {debounce} from "lodash"
// const API_KEY = "141a6d247057f6341b6db9aaf070e855";

// async function fetchWeather(city: string) {
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
//   );
//   if (!response.ok) throw new Error("Failed to fetch weather data");
//   return response.json();
// }

export default function Index() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([])
  const [weather,setWeather]=useState({})
  

  // console.log(data)
const handleSearch=(value:string)=>{
  console.log("value",value)
  if(value.length>2){
    fetchLocations({cityName:value}).then((data)=>{
      console.log('got locations:',data)
      setLocations(data)
    })
  }
}
const handleLocation=(loc:any)=>{
  console.log('locations',loc);
  setLocations([]);
  fetchWeatherForecast({cityName:loc.name,
    day:'7'
  }).then((data)=>{
    console.log('got data',data)
    setWeather(data)
  })
}
const fetchMyWeatherData=async()=>{
  fetchWeatherForecast({
    cityName:'Kathmandu',
    day:'7'
  }).then((data)=>{
    setWeather(data)
  })
}
useEffect(()=>{
  fetchMyWeatherData()
},[])
const {current,location}=weather

// const handleTextDebous=useCallback(debounce(handleSearch,1200),[])
  return (
    <View style={{ flex: 1, position: "relative" }}>
      <StatusBar style="light" />
      <Image blurRadius={70} source={require("./../assets/images/homecreen.jpeg")} className="absolute h-full w-full" />
      {/* Display the weather data here */}
      <SafeAreaView className="flex flex-1">
        {/* search seaction */}
        <View style={{ height: '7%' }} className="mx-4 top-16 relative z-50">
          <View className="flex-row justify-end items-center rounded-full"
            style={{ backgroundColor: showSearch ? theme.bgWhite(0.3) : 'transparent', borderRadius: showSearch && 9999 }}
          >
            {
              showSearch ? (
              <TextInput
                onChangeText={handleSearch}
                placeholder="Search city" placeholderTextColor={'lightgray'}
                className="pl-6 h-10 flex-1 text-base text-white"
              />) : null
            }
            {/* <TextInput placeholder="Search city" placeholderTextColor={'lightgray'}
              className="pl-6 h-10 flex-1 text-base text-white"
            /> */}

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{ backgroundColor: theme.bgWhite(0.3) }}
              className="rounded-full p-4 m-1"
            >
              <MagnifyingGlassIcon size='25' color="white" />

            </TouchableOpacity>

          </View>
          {
            locations.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-20 rounded-3xl">
                {
                  locations.length > 0 && showSearch ? (
                    <View className="absolute w-full bg-gray-300 top-0 rounded-3xl">
                      {locations.map((loc, index) => {
                        let showBorder = index + 1 !== locations.length;
                        return (
                          <TouchableOpacity
                            onPress={() => handleLocation(loc)}
                            key={index}
                            className={`flex-row items-center p-3 px-4 mb-1 ${showBorder ? "border-b-2 border-b-gray-400" : ""}`}
                          >
                            <MapPinIcon size={20} color="gray" />
                            <Text className="text-black text-lg ml-2">{loc?.name} ,{loc?.country}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ) : null
                }
              </View>
            ) : null
          }
        </View>
        {/* forecast section */}
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}        >
        <View className="mx-4 flex justify-around  flex-1 mb-2">
          {/* location */}
          <Text className="text-white text-center mt-12 text-2xl font-bold">
            {location?.name}
            <Text className="text-lg font-semibold text-gray-300">
              { "  "+location?.country}
            </Text>
          </Text>
          {/* weather image */}
          <View className="flex-row justify-center">
            <Image source={{uri:'https://'+current?.condition?.icon}} className="w-52 h-52" />
          </View>
          {/* degree celcius */}
          <View className="space-y-2">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              {current?.temp_c}&#176;
            </Text>
            <Text className="text-center  text-white text-xl tracking-widest">
              Partiall cloudy
            </Text>
          </View>
          {/* other stats */}
          <View className="flex-row justify-between mx-4">
            <View className="flex-row space-x-2 items-center">
              <Image source={require('../assets/images/windPng.png')} className="h-10 w-10" />
              <Text className="text-white font-semibold text-base">
                {current?.wind_kph}km
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              {/* <Image source={require('../assets/images/cloudImage.png')} className="h-6 w-6" /> */}
              <Image source={require('../assets/images/waterDrop.png')} className="h-10 w-10" />
              <Text className="text-white font-semibold text-base">
                {current?.humidity}%
              </Text>
            </View>
            <View className="flex-row space-x-2 items-center">
              {/* <Image source={require('../assets/images/sunIcon.png')} className="h-6 w-6" /> */}
              <SunIcon size='40' color="white"/>
              <Text className="text-white font-semibold text-base">
                6:05AM
              </Text>
            </View>
          </View>
        </View>
        {/* forecast for next day */}
        <View className="mb-2 space-y-3">
          <View className="flex-row items-center mx-5 space-x-2 mb-2">
            <CalendarDaysIcon size="22" color="white" />
            <Text className="text-white text-base">Daily forecast</Text>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            {weather?.forecast?.forecastday?.map((item,index)=>{
              const date = new Date(item.date); // item.date should be a string
              const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
              let dayName = date.toLocaleDateString('en-US', options);
              dayName = dayName.split(',')[0]; // Get the weekday name only
              return(
                <View className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-3 mx-2"
                  style={{ backgroundColor: theme.bgWhite(0.15) }}
                  key={index}
                >
                  <Image source={
                    // require('../assets/images/icon.png')
                    // item?.day?.condition?.icon
                    {uri:'https://'+item.day?.condition?.icon}
                  }
                    className="h-11 w-11"
                  />
                  <Text className="text-white">{dayName}</Text>
                  <Text className="text-white text-xl font-semibold">{item?.day.avgtemp_c}&#176;</Text>
                </View>
              )
            })}
          
           

          </ScrollView>
        </View>
        </ScrollView>
      </SafeAreaView>

    </View>
  );
}
