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
} from "react-native";
import {  signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useDispatch } from "react-redux";

import { setUser } from "../src/redux/userSlice";
import { auth, db } from "../firebaseConfig";

export default function Login() {
  const [errors, setErrors] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const usersRef = collection(db, "users");

  const signIn = async () => {
    if (!email || !password) {
      setErrors("Both email and password are required.");
      return;
    }
    const q = query(usersRef, where("email", "==", email));
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const userName = userData.firstName + " " + userData.lastName;

        dispatch(setUser(userName) );

        router.push("/home");
        Alert.alert("Success", "You have signed in successfully!");
      } else {
        setErrors("No user found with this email.");
      }
    } catch (error) {
      setErrors(error.message);
    }
  };

  return (
    <View style={styles.page}>
      <Text style={styles.heading}>Welcome to Transport Ease!</Text>
      <TextInput
        placeholder="Email"
        value={email}
        keyboardType="Email-address"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {errors && <Text style={styles.error}>{errors}</Text>}
      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
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
    fontSize: 20,
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
