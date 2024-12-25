import { store } from "../src/redux/store";
import { Stack } from "expo-router";
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
            backgroundColor: "#195583",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      ></Stack>
    </Provider>
  );
}
