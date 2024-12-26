import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function Login() {
  const [errors, setErrors] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { control, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = (data) => {
    router.push({
      pathname: "/home",
      params: { username: data.username },
    });
  };

  return (
    <View style={styles.page}>
      <Text style={styles.heading}>Welcome to Transport Ease !</Text>
      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Username"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{ required: "Password is required" }}
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
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/registrationForm",
          });
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
    backgroundColor:"#fff",
    justifyContent: "center", 
    alignItems: "center",   
    padding: 10,
  },
  heading: {
    textAlign: "center",
    fontSize: 20,
    marginBottom:20
  },
  input: {
    width: "80%", 
    borderColor:"#ccc",
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
    width: "80%"
  },
  buttonText: {

    color: "white",
    fontSize: 16,
    fontWeight:"bold"
  },
  registerText: {
    fontSize: 12,
    marginTop: 20,
  },
});
