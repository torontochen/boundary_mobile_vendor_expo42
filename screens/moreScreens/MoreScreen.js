import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ListItem, Icon } from "react-native-elements";
import {
  useQuery,
  useMutation,
  useLazyQuery,
  useApolloClient,
} from "@apollo/react-hooks";

import { GET_AUTH } from "../../queries/queries_query"
import themes from "../../assets/themes";

const MoreScreen = ({ navigation }) => {

  const { data: authData } = useQuery(GET_AUTH);
  const {
    auth: { isAuthed },
  } = authData;
  const listMore = [
    {
      title: isAuthed ? "Rules" : "Log in or Log up",
      titleStyle: { color: themes.primary },
      icon: isAuthed ? {
        name: "book",
        type: "font-awesome-5",
        color: themes.primary,
      } :{
        name: "person-outline",
        type: "ionicon",
        color: themes.primary,
      },
      onPress: () => {
        navigation.navigate("Login");
      },
    },
    {
      title: "Setting",
      titleStyle: { color: themes.primary },
      icon: {
        name: "settings-outline",
        type: "ionicon",
        color: themes.primary,
      },
      onPress: () => {
        // navigation.navigate("Stash");
        // setIsVisibleMailBag(false);
      },
    },
    // {
    //   title: "Exit",
    //   titleStyle: { color: "white" },
    //   icon: {
    //     name: "exit",
    //     type: "ionicon",
    //     color: "white",
    //   },
    //   containerStyle: { backgroundColor: themes.primary },
    //   onPress: () => {
    //     setIsVisibleMailBag(false);
    //   },
    // },
  ];
  return (
    <View style={styles.container}>
      {listMore.map((l, i) => (
        <ListItem
          key={i}
          onPress={l.onPress}
          bottomDivider
          style={styles.listItem}
        >
          <Icon name={l.icon.name} type={l.icon.type} color={l.icon.color} />
          <ListItem.Content>
            <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  listItem: {
    width: "100%",
  },
});

export default MoreScreen;
