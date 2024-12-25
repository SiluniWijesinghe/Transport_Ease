import React from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setUser } from "../src/redux/userSlice";
import { useRouter } from "expo-router";

export default function RegistrationForm() {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit = (data) => {
    dispatch(setUser(data)); 
    router.push("/home"); 

  }
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>
      
      <Controller
        name="fullName"
        control={control}
        rules={{ required: "Full name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Full Name"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      {errors.fullName && <Text style={styles.error}>{errors.fullName.message}</Text>}

      <Controller
        name="email"
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Invalid email format",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            keyboardType="email-address"
            style={styles.input}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        name="password"
        control={control}
        rules={{
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters long",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={styles.input}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      <Controller
        name="confirmPassword"
        control={control}
        rules={{
          required: "Please confirm your password",
          validate: (value) => value === control.getValues("password") || "Passwords do not match",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Confirm Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={styles.input}
          />
        )}
      />
      {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

      <Button title="Register" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
})
