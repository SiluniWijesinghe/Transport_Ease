import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput, Button, Text } from "react-native";

export default function Login() {
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
        rules={{ required: "Username is required" }}
        render={({ field: { onChange, value } }) => (
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
    </View>
  );
}