require("dotenv").config();
const axios = require("axios");

exports.handler = async (event) => {
  try {
    const userIp = event.requestContext.identity.sourceIp;
    const userLocation = await axios.get(
      `https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey=${process.env.IP_LOCATION_KEY}&ipAddress=${userIp}`
    );
    const userForecast = await axios.get(
      "https://api.openweathermap.org/data/3.0/onecall",
      {
        params: {
          appid: process.env.WEATHER_API_KEY,
          lat: userLocation.data.location.lat,
          lon: userLocation.data.location.lng,
          units: "metric",
        },
      }
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(userForecast.data.current),
    };
  } catch (erorr) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
