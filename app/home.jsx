import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import axios from "axios";
import { increment,clearCounter } from "../src/redux/counterSlice";
import { clearUser } from "../src/redux/userSlice";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const clickCount = useSelector((state) => state.counter.value);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://developer.nps.gov/api/v1/parks?parkCode=&limit=8&start=30&api_key=FevFNEaP2b3c9JsYyF7Xzsb8KbcYM8DbHeQO6Jbj"
        );
        setItems(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleItemPress = () => {
    dispatch(increment());
  };

  const handleBackPress = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel" },
      {
        text: "Log Out",
        onPress: () => {
          dispatch(clearUser());
          dispatch(clearCounter());
          router.push("/login");
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{
          uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.fullName}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.activities}>
          Activities:{" "}
          {item.activities?.map((activity) => activity.name).join(", ") ||
            "Not Available"}
        </Text>
        <Text style={styles.contact}>
          Contact:{" "}
          {item.contacts?.phoneNumbers[0]?.phoneNumber || "Not Available"}
        </Text>
        <TouchableOpacity
          style={styles.clickMeButton}
          onPress={handleItemPress}
          activeOpacity={0.8}
        >
          <Text style={styles.clickMeText}>Click Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          onPress={handleBackPress}
        />
        <View style={styles.greetingContainer}>
          <Image
            source={require("../assets/images/hello.png")}
            style={styles.helloIcon}
          />
          <Text style={styles.greeting}>Hi {user || "there"}!</Text>
        </View>
      </View>

      <Text style={styles.heading}>Parks You Can Visit</Text>

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}

      <TouchableOpacity style={styles.floatingButton}>
        <Text style={styles.floatingButtonText}>{clickCount}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  helloIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },

  image: {
    height: 180,
    width: "100%",
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 8,
    color: "#2C3E50",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "black",
    marginBottom: 10,
  },
  activities: {
    fontSize: 14,
    color: "#1D3557",
    marginBottom: 5,
  },
  contact: {
    fontSize: 14,
    color: "#1D3557",
    marginBottom: 15,
  },
  clickMeButton: {
    backgroundColor: "#1D3557",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  clickMeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#274C77",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  floatingButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});
