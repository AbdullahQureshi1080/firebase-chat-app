import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import { auth, db } from "../firebase";
import * as firebase from "firebase";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Keyboard } from "react-native";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#e8e8e8",
      },
      headerTitleStyle: {
        color: "#005083",
      },
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar rounded source={{ uri: messages[0]?.data.photoURL }} />
          <Text
            style={{
              fontSize: 16,
              color: "#005083",
              marginLeft: 10,
              fontWeight: "700",
            }}
          >
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerTintColor: "#005083",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.5}
          >
            <AntDesign name="arrowleft" size={24} color="#005083" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity onPress={handleDelete}>
            <MaterialIcons name="delete" size={24} color="#005083" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  const handleDelete = () => {
    Alert.alert("Delete Chat", "Are you sure you want to delete the chat", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: deleteChat },
    ]);
  };

  const sendMessage = () => {
    Keyboard.dismiss();
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.default.firestore.FieldValue.serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });

    setInput("");
  };

  const deleteChat = () => {
    db.collection("chats")
      .doc(route.params.id)
      .delete()
      .catch((error) => alert(error));
    navigation.replace("Home");
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      rounded
                      // Web
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      source={{ uri: data.photoURL }}
                      size={30}
                      position="absolute"
                      bottom={-15}
                      right={-5}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.reciever}>
                    <Avatar
                      rounded
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      source={{ uri: data.photoURL }}
                      size={30}
                      position="absolute"
                      bottom={-15}
                      right={-5}
                    />
                    <Text style={styles.recieverText}>{data.message}</Text>
                    <Text style={styles.recieverName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder="Signal Message"
                style={styles.textInput}
                onSubmitEditing={
                  !input ? () => alert("Empty Message") : sendMessage
                }
              />
              <TouchableOpacity
                onPress={sendMessage}
                activeOpacity={0.5}
                disabled={!input}
              >
                <Ionicons name="send" size={24} color="#005083" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#e8e8e8",
    borderWidth: 1,
    color: "grey",
    padding: 10,
    borderRadius: 30,
  },
  reciever: {
    // marginTop: 5,
    padding: 15,
    // backgroundColor: "#005083",
    backgroundColor: "#e5e5e5",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    // backgroundColor: "#e5e5e5",
    backgroundColor: "#005083",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  recieverText: {
    // color: "#e8e8e8",
    color: "#005083",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderText: {
    // color: "#005083",
    color: "#e8e8e8",
    fontWeight: "500",
    marginRight: 10,
    marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "#005083",
  },
  recieverName: {
    right: 10,
    paddingLeft: 10,
    fontSize: 10,
    color: "#005083",
  },
  // recieverText: {},
});
