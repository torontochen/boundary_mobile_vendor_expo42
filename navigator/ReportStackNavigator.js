import React, {} from "react";
import { createStackNavigator } from "@react-navigation/stack";

// import GuildChatScreen from "../screens/reportScreens/GuildChatScreen";
import ReportScreen from "../screens/reportScreens/ReportScreen";

import themes from "../assets/themes";

const ReportStack = createStackNavigator();

const ReportStackNavigator = ({route}) => {
const { vendor } = route.params


  return (
    <ReportStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerTintColor: themes.primary,
      }}
    >
      <ReportStack.Screen name="Reports" component={ReportScreen} initialParams={{vendor}}/>
    </ReportStack.Navigator>
  );
};

export default ReportStackNavigator;
