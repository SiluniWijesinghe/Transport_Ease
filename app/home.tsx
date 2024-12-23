import { useEffect, useState } from "react";
import { FlatList, Text, Image, View, Button } from "react-native";
import axios from "axios";
import { Provider, useDispatch, useSelector } from "react-redux";
import { increment } from "@/src/redux/counterSlice";
import { RootState, store } from "@/src/redux/store";
import { useSearchParams } from "expo-router";



interface Item {
  id: number;
  title: string;
  image: string;
  price: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const {username}=useSearchParams();
  const dispatch = useDispatch();
  const clickCount = useSelector((state: RootState) => state.counter.value);

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((response) => {
      setItems(response.data);
    });
  }, []);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={{ margin: 10, borderWidth: 1, padding: 10 }}>
      <Image source={{ uri: item.image }} style={{ height: 100, width: 100 }} />
      <Text>{item.title}</Text>
      <Text>{item.price} USD</Text>
      <Button title="Click Me" onPress={() => dispatch(increment())} />
    </View>
  );

  return (

    <View style={{ flex: 1 }}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <View style={{ position: "absolute", bottom: 20, right: 20 }}>
        <Text>Clicks: {clickCount}</Text>
        <Text>Welcome, {username}!</Text>
      </View>
    </View>
   
  );
}
