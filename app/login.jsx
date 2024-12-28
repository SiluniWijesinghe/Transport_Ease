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
        source={require("../assets/images/map.png")}
        style={[styles.image, { tintColor: "#274C77" }]}
      />
      <Text style={styles.heading}>Welcome! Dive In and Get Started.</Text>
      <TextInput
        placeholder="Email"
        value={credentials.email}
        keyboardType="email-address"
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
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>
          Don't have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => {
              router.push("/registrationForm");
            }}
          >
            Register Here
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  heading: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#274C77",
  },
  image: {
    width: 180,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  input: {
    width: "85%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  button: {
    backgroundColor: "#274C77",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "85%",
    elevation: 3,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerContainer: {
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
    color: "#555",
  },
  registerLink: {
    textDecorationLine: "underline",
    color: "#274C77",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
});
