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

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
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
    if (!formData.FirstName) newErrors.FirstName = "First name is required";
    if (!formData.LastName) newErrors.LastName = "Last name is required";
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
        const user = userCredential.user;
        dispatch(setUser(formData));
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
        value={formData.FirstName}
        onChangeText={(value) => handleChange("FirstName", value)}
        style={styles.input}
      />
      {errors.FirstName && (
        <Text style={styles.error}>*{errors.FirstName}</Text>
      )}

      <TextInput
        placeholder="Last Name"
        value={formData.LastName}
        onChangeText={(value) => handleChange("LastName", value)}
        style={styles.input}
      />
      {errors.LastName && <Text style={styles.error}>*{errors.LastName}</Text>}

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
