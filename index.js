import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Replace with your OpenWeatherMap API key
const apiKey = "810d7ee413c3ad47f888090b3d83a13a";

// Middleware setup
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.render("index.ejs", { weatherdata: "", backgroundImageUrl:"",error: ""});
});

app.post("/weather", async (req, res) => {
    const { city } = req.body;
 
    if (!city) {
        return res.status(400).send("City name is required");
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(apiUrl);


        if (response.status !== 200) {
            throw new Error(`Weather data not available for ${city}`);

        }
        else {
        const weatherData = {
            city: response.data.name,
            description: response.data.weather[0].description,
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            windSpeed: response.data.wind.speed,
        };
        const weatherdescription=weatherData.description;
        const backgroundImageUrl = getBackgroundImageUrl(weatherdescription);
        res.render("index.ejs", { weatherdata: weatherData,backgroundImageUrl:backgroundImageUrl,error: '' });
    }

    } catch (error) {
        console.error(`Error fetching weather data for ${city}:`, error.message);
        const defaultBackgroundImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSflg2GpFFPaI_LKbXr8EF-hQpm5mlQ-xpVCA&s'; 
        res.render("index.ejs", { 
            weatherdata: null,  
            backgroundImageUrl: defaultBackgroundImageUrl,
            error: `Weather data not available for ${city}`
          });
    }
});

// Function to map weather descweatherData.descriptionription to background image URL
function getBackgroundImageUrl(weatherdescription) {
  console.log(weatherdescription);
  switch (weatherdescription.toLowerCase()) {
      case 'clear sky':          return 'https://previews.123rf.com/images/scenery1/scenery11402/scenery1140200401/26183596-clouds-and-clear-blue-sky-weather-nature.jpg'; // Replace with your image URL
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
      case 'overcast clouds':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWKmjpBBkfE6kyj3fRUGj6CdkuVw8GQqI8Ug&s';
        // Replace with your image URL for cloudy weather
      case 'light rain':
      case 'moderate rain':
      case 'heavy intensity rain':
      case 'very heavy rain':
      case 'extreme rain':
      case 'freezing rain':
      case 'drizzle':
          return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5RQebmjXhFcxMBPcPri7qwcc9STKmQjBq6Q&s';  
        // Replace with your image URL for rainy weather
      case 'mist':
      case 'fog':
      case 'haze':
      case 'smoke':
      case 'dust':
      case 'sand':
      case 'ash':
            return 'https://cloudfront-us-east-2.images.arcpublishing.com/reuters/BITGWA5APZLFLKNBZBMUMZOI3A.jpg';
      // Replace with y-our image URL for foggy conditions
      case 'squalls':
      case 'tornado':
          return 'https://cms.accuweather.com/wp-content/uploads/2024/04/20230621_TonyLaubach_AkronTornado.jpg?w=632';
        // Replace with your image URL for stormy conditions
      default:
          return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSflg2GpFFPaI_LKbXr8EF-hQpm5mlQ-xpVCA&s'; 
          // Replace with a default image or handle unknown conditions
  }
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
