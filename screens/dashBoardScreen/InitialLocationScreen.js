import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, View, Text } from "react-native";
import { Button } from "react-native-elements";
import { useQuery, useMutation } from "@apollo/react-hooks";
// import { useNavigation } from "@react-navigation/native";

import { SET_AUTH, CHANGE_POSTALCODE } from "../../queries/queries_mutation";
import {
  GET_INIT_LOCATION,
  GET_CURRENT_RESIDENT,
} from "../../queries/queries_query";
import themes from "../../assets/themes";
import Map from "../../components/Map";

const { height, width } = Dimensions.get("window");

export default function InitialLocationScreen({ route, navigation }) {
  // const client = useApolloClient();
  const { email, postalCode, initialLat, initialLng } = route.params;
  // console.log(route.params);
  //   console.log(postalCode);
  const [postalCodeEdit, setPostalCodeEdit] = useState("");
  const [initialLatEdit, setInitialLatEdit] = useState("");
  const [initialLngEdit, setInitialLngEdit] = useState("");

  useEffect(() => {
    setPostalCodeEdit(postalCode);
  }, []);

  // const { data: residentData, refetch } = useQuery(GET_CURRENT_RESIDENT, {
  //   fetchPolicy: "cache-and-network",
  // });

  const [changePostalCode] = useMutation(CHANGE_POSTALCODE, {
    async update(cache, { data: { changePostalCode } }) {
      // console.log(changePostalCode);
      // First read the query you want to update
      const data = cache.readQuery({ query: GET_CURRENT_RESIDENT });
      // Create updated data
      data.getCurrentResident.postalCode = changePostalCode.postalCode;
      data.getCurrentResident.initialLat = changePostalCode.initialLat;
      data.getCurrentResident.initialLng = changePostalCode.initialLng;
      // Write updated data back to query
      // console.log(data);
      cache.writeQuery({
        query: GET_CURRENT_RESIDENT,
        data,
      });
    },
    optimisticResponse: {
      __typename: "Mutation",
      changePostalCode: {
        __typename: "PostalCodeRevised",
        // email,
        postalCode: postalCodeEdit,
        initialLat: initialLatEdit,
        initialLng: initialLngEdit
      },
    },
  });

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.overlayForm}>
          <Text style={styles.formTitle}>
            Current Postal Code: {postalCodeEdit}
          </Text>
          <Map
            onSelectPostalCode={setPostalCodeEdit}
            onSelectInitialLat={setInitialLatEdit}
            onSelectInitialLng={setInitialLngEdit}
            initialLat={initialLat}
            initialLng={initialLng}
            mapStyle={{ width: width - 100 }}
          />

          <View style={styles.buttonContainer}>
            <Button
              icon={{
                name: "cancel",
                type: "material",
                color: themes.primary,
              }}
              iconRight
              onPress={() => {
                navigation.navigate("DashBoard");
              }}
              type="outline"
              title="Cancel"
              buttonStyle={{
                borderColor: themes.primary,
                marginHorizontal: 10,
              }}
              titleStyle={{ color: themes.primary }}
            />

            <Button
              icon={{ name: "done", type: "material", color: "white" }}
              iconRight
              onPress={() => {
                changePostalCode({
                  variables: {
                    postalCode: postalCodeEdit,
                    email,
                    initialLat: initialLatEdit,
                    initialLng: initialLngEdit,
                  },
                });
                navigation.goBack();
              }}
              title="OK"
              // disabled={passwordEdit !== reEnter}
              disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
              buttonStyle={{
                backgroundColor: themes.primary,
                marginHorizontal: 10,
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
    backgroundColor: "#FFFFFF",
    borderWidth: 0,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 12,
    backgroundColor: "#fff",
    width: "100%",
  },
  formTitle: {
    fontFamily: "Roboto_medium",
    fontSize: 18,
    color: themes.primary,
    marginBottom: 12,
  },

  overlayForm: {
    width: width - 80,
    height: height - 200,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    borderRadius: 5,
  },
});
