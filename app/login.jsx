import { useRouter } from "expo-router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  TextInput,
  Button,
  Text,
  Touchable,
  TouchableOpacity,
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
    <View>
      <Text style={{ marginLeft: 10 }}>Login</Text>
      <Controller
        name="username"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Username"
            value={value}
            onChangeText={onChange}
            style={{ borderWidth: 1, margin: 10 }}
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
            style={{ borderWidth: 1, margin: 10 }}
          />
        )}
      />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <TouchableOpacity
        onPress={() => {
          router.push({
            pathname: "/registrationForm",
          });
        }}
      >
        <Text style={{ fontSize: 12, marginLeft: 45 }}>
          Don't have an account? Register Here
        </Text>
      </TouchableOpacity>
    </View>
  );
}
