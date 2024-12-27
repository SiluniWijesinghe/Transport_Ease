import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import axios from "axios";
import { increment } from "../src/redux/counterSlice";
import { clearUser } from "../src/redux/userSlice";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const clickCount = useSelector((state) => state.counter.value);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Fetch national park data from the NPS API
    const fetchData = async () => {
      try {
        const response = await axios.get(
"https://developer.nps.gov/api/v1/parks?parkCode=&limit=8&start=30&api_key=FevFNEaP2b3c9JsYyF7Xzsb8KbcYM8DbHeQO6Jbj",          {
            headers: {
              accept: "application/json",
            },
          }
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

  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  const handleBackPress = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel" },
      {
        text: "Log Out",
        onPress: () => {
          dispatch(clearUser());
          router.push("/login");
        },
      },
    ]);
  };
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.fullName}</Text>
      <Image
        source={{
          uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />

      <Text style={styles.status}>
        Description: {item.description}
      </Text>
      <Text style={styles.status}>
        Activities: {item.activities?.[0].name || "Not Available"},{item.activities?.[1].name || "Not Available"}
      </Text>
      <Text style={styles.status}>
        Contact No: {item.contacts?.phoneNumbers[0].phoneNumber || "Not Available"}
      </Text>

      <TouchableOpacity
        onPress={() => handleLinkPress(item.url)}
        style={styles.moreInfoButton}
      >
        <Text style={styles.moreInfoText}>More Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clickMeButton} onPress={handleItemPress}>
        <Text style={styles.clickMeText}>Click Me</Text>
      </TouchableOpacity>
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

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </>
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={() => {}}>
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
    marginBottom: 20,
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
  card: {
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  helloIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  image: {
    height: 150,
    width: "100%",
    borderRadius: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginVertical: 5,
    textAlign: "center",
    color: "#FFF50",
  },
  status: {
    fontSize: 14,
    color: "#555",
    marginTop:5
  },
  moreInfoButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  moreInfoText: {
    color: "#fff",
    fontSize: 14,
  },
  clickMeButton: {
    marginTop: 10,
    backgroundColor: "#8B8C89",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
    width: "60%",
  },
  clickMeText: {
    color: "black",
    fontSize: 14,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007BFF",
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
});
