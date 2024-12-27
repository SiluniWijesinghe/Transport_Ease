import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import { setUser } from "../src/redux/userSlice";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {db} from "../firebaseConfig"
import { addDoc,collection } from "firebase/firestore";

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

        const docRef = await addDoc(collection(db, "users"), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        });
        console.log("Document written with ID: ", docRef.id);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const userName = formData.firstName+" "+ formData.lastName;
        dispatch(setUser(userName));
        Alert.alert("Success", "You have registered successfully!", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
      } catch (error) {
        console.error("Registration error:", error.code, error.message);
      } finally {
        setLoading(false); 
      }
    }
  };

  return (
    <View style={styles.container}>
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
        <Button title="Register" onPress={onSubmit} />
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
  input: {
    width: "90%",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  error: {
    fontSize: 10,
    color: "red",
    marginBottom: 5,
  },
});
