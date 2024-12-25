import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { increment } from "../src/redux/counterSlice";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const clickCount = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch national park data from the NPS API
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://developer.nps.gov/api/v1/places?limit=5&start=1&q=river&api_key=FevFNEaP2b3c9JsYyF7Xzsb8KbcYM8DbHeQO6Jbj",
          {
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

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        handleItemPress();
      }}
    >
      <Text style={styles.title}>{item.relatedParks[0].fullName}</Text>
      <Image
        source={{
          uri: item.images?.[0]?.url || "https://via.placeholder.com/150",
        }}
        style={styles.image}
      />

      <Text style={styles.status}>
        Location: {item.relatedParks?.[0]?.states || "Unknown"}
      </Text>
      <Text style={styles.status}>
        Longitude: {item.longitude || "Not Available"}
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}> Places you can visit</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
    borderRadius: 8,
    padding: 10,
    elevation: 3,
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
    backgroundColor: "#FF5722",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  clickMeText: {
    color: "#fff",
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
