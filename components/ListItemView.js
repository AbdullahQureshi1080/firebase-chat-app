import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

const ListItemView = ({ id, chatName, enterChat }) => {
  return (
    <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
      <Avatar rounded source={{ uri: "https://i.pravatar.cc/300" }} />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          This is the test subtite, checking to see if works, let shope it does
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default ListItemView;

const styles = StyleSheet.create({});
