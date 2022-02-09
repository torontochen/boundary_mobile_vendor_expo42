import React, {} from "react";
import { createStackNavigator } from "@react-navigation/stack";

import GuildChatScreen from "../screens/guildChatScreen/GuildChatScreen";

import themes from "../assets/themes";

const ChatStack = createStackNavigator();

const ChatStackNavigator = () => {



  return (
    <ChatStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: themes.primary,
      }}
    >
      <ChatStack.Screen name="Chat" component={GuildChatScreen} />
    </ChatStack.Navigator>
  );
};

export default ChatStackNavigator;
