import axios from "axios";

const API = "94a7a735ee914870a2e53155251703";

interface Params {
    cityName: string;
    day: string;
}

const forcastEndPoints = (params: Params) =>
    `http://api.weatherapi.com/v1/forecast.json?key=${API}&q=${params.cityName}&days=${params.day}&aqi=no&alerts=no`;

const LocationsEndPoints = (params: { cityName: string }) =>
    `http://api.weatherapi.com/v1/search.json?key=${API}&q=${params.cityName}`;

const apiCall = async (endPoint: string) => {
    const options = {
        method: "GET",
        url: endPoint,
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const fetchWeatherForecast = (params: Params) => {
    return apiCall(forcastEndPoints(params));
};

export const fetchLocations = (params: { cityName: string }) => {
    return apiCall(LocationsEndPoints(params));
};
