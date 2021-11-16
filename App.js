import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window"); //es6
//const SCREEN_WIDTH = Dimensions.get("window").width; 와 똑같음

//API Key 가져오기. 안전을 생각하면 키를 서버에 두고 가져와야 함.
const API_KEY = "90db341ddbf8968bc3f39dff6ea0c327";

//icon 대입
const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snowflake-8",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
};

export default function App() {
  //위치 Hook
  const [city, setCity] = useState("🌏");
  const [street, setStreet] = useState();

  //날씨 Hook
  const [days, setDays] = useState([]);

  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    //위치정보 동의 받기
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    //user의 위치 받기
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    //useState 상태 값 갱신
    setCity(location[0].city);
    setStreet(location[0].street);

    //날씨 정보 API 가져오기
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    console.log(json);
    setDays(json.daily);
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.locationWrap}>
        <Text style={styles.cityName}>{city}</Text>
        <Text style={styles.streetName}>{street}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <Text style={styles.dates}>
                {new Date(day.dt * 1000)
                  .toString()
                  .substring(0, 3)
                  .toUpperCase()}
              </Text>
              <Text style={styles.temp}>
                {parseFloat(day.temp.day).toFixed(1)}
              </Text>
              <Fontisto
                style={styles.description}
                name={icons[day.weather[0].main]}
              ></Fontisto>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a2b59f",
  },
  locationWrap: {
    flex: 1.2,
    marginTop: 50,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "#333",
  },
  cityName: {
    fontSize: 40,
    color: "#fff",
  },
  streetName: {
    fontSize: 20,
    marginTop: 10,
    color: "#fff",
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  dates: {
    marginTop: 70,
    fontSize: 40,
    color: "#fff",
  },
  temp: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    fontSize: 60,
    color: "#fff",
    marginTop: 5,
  },
});
