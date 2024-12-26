import { store } from "../src/redux/store";
import { Slot, Stack } from "expo-router";
import { Provider } from "react-redux";
import Login from "./login";
import RegistrationForm from "./registrationForm";
import Home from "./home";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#E7ECEF",
          },
          headerTintColor: "black",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="registrationForm"
          options={{
            title: "User Registration",
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            title: "Discover Places",
            backgroundColor: "#fff",
          }}
        />
      </Stack>
    </Provider>
  );
}
