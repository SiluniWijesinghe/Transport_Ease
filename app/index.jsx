import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import Login from "./login";


export default function App() {
  return (
    <Provider store={store}>
      <Login />
    </Provider>
  );
}
