import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Button, Input, Image, Avatar, Icon } from "react-native-elements";
import { db } from "../firebase";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add New Chat",
      headerStyle: {
        backgroundColor: "#e8e8e8",
      },
      headerTitleStyle: {
        color: "#005083",
        // alignSelf: "center",
      },
      headerTintColor: "#005083",
    });
  }, [navigation]);

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <Icon name="wechat" type="antdesign" size={24} color="#005083" />
        }
      />
      <Button
        title="Create New Chat"
        onPress={createChat}
        containerStyle={styles.button}
        disabled={!input}
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e8e8e8",
    padding: 30,
    height: "100%",
  },
  button: {
    marginTop: 10,
    width: 200,
    alignSelf: "center",
  },
});
