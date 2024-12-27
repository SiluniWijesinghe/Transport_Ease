import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { setUser } from "../src/redux/userSlice";
import { auth, db } from "../firebaseConfig";

export default function Login() {
  const [errors, setErrors] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const usersRef = collection(db, "users");
  const handleChange = (name, value) => {
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const signIn = async () => {
    if (!credentials.email || !credentials.password) {
      setErrors("Both email and password are required.");
      return;
    }
    setLoading(true);
    const q = query(usersRef, where("email", "==", credentials.email));
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      const user = userCredential.user;

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const userName = userData.firstName + " " + userData.lastName;

        dispatch(setUser(userName));

        router.push("/home");
        Alert.alert("Success", "You have signed in successfully!");
      } else {
        setErrors("No user found with this email.");
      }
    } catch (error) {
      const errorCode = error.code.split("/")[1];
      const formattedError = errorCode.replace(/-/g, " ");
      Alert.alert("Authentication Error!", formattedError, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      <Image
        source={require("../assets/images/map.png")} // Replace with your image file path
        style={[styles.image, { tintColor: "#274C77" }]}
      />
      <Text style={styles.heading}>Welcome! Dive In and Get Started.</Text>
      <TextInput
        placeholder="Email"
        value={credentials.email}
        keyboardType="Email-address"
        onChangeText={(value) => handleChange("email", value)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={credentials.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        style={styles.input}
      />
      {errors && <Text style={styles.error}>{errors}</Text>}

      {loading ? (
        <ActivityIndicator size="large" color="#274C77" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={signIn}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          router.push({ pathname: "/registrationForm" });
        }}
      >
        <Text style={styles.registerText}>
          Don't have an account? Register Here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  heading: {
    textAlign: "center",
    fontSize: 30,
    marginBottom: 20,
    color: "#274C77",
  },
  image: {
    width: 200,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#274C77",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    fontSize: 12,
    marginTop: 20,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});
