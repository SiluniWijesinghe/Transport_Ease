import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUser } from "../src/redux/userSlice";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const router = useRouter();
  const auth = getAuth();

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

    // Validation
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (validate()) {
      setLoading(true);
      const { email, password } = formData;

      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const docRef = await addDoc(collection(db, "users"), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        });
        console.log("Document written with ID: ", docRef.id);
        const userName = formData.firstName + " " + formData.lastName;
        dispatch(setUser(userName));
        Alert.alert("Success", "You have registered successfully!", [
          { text: "OK", onPress: () => router.push("/home") },
        ]);
      } catch (error) {
        const errorCode = error.code.split("/")[1];
        const formattedError = errorCode.replace(/-/g, " ");
        Alert.alert("Registration Error!", formattedError, [{ text: "OK" }]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={30}
          color="black"
          style={styles.backIcon}
          onPress={() => router.back()}
        />
        <Text style={styles.heading}>Create Your Account</Text>
      </View>
      <Image
        source={require("../assets/images/placeholder.png")}
        style={styles.image}
      />
      <TextInput
        placeholder="First Name"
        value={formData.firstName}
        onChangeText={(value) => handleChange("firstName", value)}
        style={styles.input}
      />
      {errors.firstName && (
        <Text style={styles.error}>*{errors.firstName}</Text>
      )}

      <TextInput
        placeholder="Last Name"
        value={formData.lastName}
        onChangeText={(value) => handleChange("lastName", value)}
        style={styles.input}
      />
      {errors.lastName && <Text style={styles.error}>*{errors.lastName}</Text>}

      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleChange("email", value)}
        keyboardType="email-address"
        style={styles.input}
      />
      {errors.email && <Text style={styles.error}>*{errors.email}</Text>}

      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleChange("password", value)}
        secureTextEntry
        style={styles.input}
      />
      {errors.password && <Text style={styles.error}>*{errors.password}</Text>}

      <TextInput
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleChange("confirmPassword", value)}
        secureTextEntry
        style={styles.input}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>*{errors.confirmPassword}</Text>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#274C77" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={onSubmit}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 10,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  backIcon: {
    position: "absolute",
    left: 10,
    top: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#274C77",
    marginLeft: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    width: "90%",
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
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    fontSize: 13,
    color: "red",
    marginBottom: 5,
  },
});
