import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Alert,
} from "react-native";
import { BottomSheet } from "react-native-elements";
import { Container, Text, Button, Item, Form, Icon, Input } from "native-base";
// import { Input } from "react-native-elements";

import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
// import { Ionicons } from "@expo/vector-icons";
import {
  SIGNUP_RESIDENT,
  SIGNIN_RESIDENT,
  SET_AUTH,
  SET_AUTH_ERROR,
  SET_GUILD_ENROLLED,
} from "../../queries/queries_mutation";
import { GET_AUTH_ERROR, EMAIL_CHECK, GET_CURRENT_RESIDENT } from "../../queries/queries_query";
import Map from "../../components/Map";
import themes from "../../assets/themes";

const { width } = Dimensions.get("window");

export default function LoginScreen({ navigation }) {
  // const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkPass, checkPassword] = useState("");
  const [email, setEmail] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [initialLatEdit, setInitialLatEdit] = useState("");
  const [initialLngEdit, setInitialLngEdit] = useState("");

  const [login, setLogin] = useState(true);
  const [emailSent, setEmailSent] = useState(false);

  // const selectPostalCode = (postalCode) => {
  // setPostalCode(postalCode);
  // };
  const [setGuildEnrolled] = useMutation(SET_GUILD_ENROLLED)
  // const [getCurrentResident, { data: residentData }] = useLazyQuery(GET_CURRENT_RESIDENT)

  // useEffect(() => {
  //   if(residentData) {
  //     const { getCurrentResident } = residentData
  //     if(getCurrentResident.guild) {
  //       setGuildEnrolled({ variables: { isEnrolled: true}})
  //     }
  //   }
  // }, [residentData])

  // Auth
  const [setAuth] = useMutation(SET_AUTH);
  

  //AuthError
  const [setAuthError] = useMutation(SET_AUTH_ERROR);
  const { data } = useQuery(GET_AUTH_ERROR);
  // if (data) {
  const {
    authError: { errMsg },
  } = data;
  // }

  // console.log(errMsg);

  // useEffect(() => {
  //   getAuthError();
  // }, [setAuthError]);

  // Check Email
  const [checkEmail] = useLazyQuery(EMAIL_CHECK, {
    async onCompleted({ checkEmail }) {
      const { emailVal } = checkEmail;
      // console.log(checkEmail);
      if (emailVal) {
        setAuthError({
          variables: { errMsg: "This email is registered" },
        });
      }
    },
    fetchPolicy: "cache-and-network",
  });


  // Signing In
  const [signinResident] = useMutation(SIGNIN_RESIDENT, {
    async onCompleted({ signinResident }) {
      console.log("signIn");
      // console.log(signinResident);
      const { token } = signinResident;
      try {
        await AsyncStorage.setItem("token", token);
        setAuth({ variables: { isAuthed: true } });
        // setGuildEnrolled({ variables: { isEnrolled: true }})
        // getCurrentResident()
        navigation.replace("DashBoard");
        // navigation.popToTop();
      } catch (err) {
        console.log(err.message);
      }
    },
    async onError(error) {
      console.log({ error });
      const loc = error.message.indexOf(":");
      const msg = error.message.slice(loc + 1);
      // console.log(msg);
      setAuthError({ variables: { errMsg: msg } });
    },
  });

  // Signing Up
  const [signupResident] = useMutation(SIGNUP_RESIDENT, {
    async onCompleted({ signUp }) {
      const { token } = signUp;
      try {
        await AsyncStorage.setItem("token", token);
        setAuth({ variables: { isAuthed: true } });
        setEmailSent(true);
      } catch (err) {
        console.log(err.message);
      }
    },
  });

  return (
    <TouchableWithoutFeedback
      // style={styles.keyboardViewContainer}
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <Container style={styles.container}>
        {checkPass == "" && errMsg !== "" && (
          <View
            style={{
              height: 30,
              borderColor: "#C51162",
              borderWidth: 1,
              borderRadius: 10,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {errMsg !== "" && <Text style={styles.errorMsg}>{errMsg}</Text>}
          </View>
        )}

        <Form style={styles.form}>
          <Item style={styles.inputContainer}>
            <Input
              onChangeText={(text) => setEmail(text)}
              onBlur={() => {
                if (email && !login) {
                  setAuthError({
                    variables: { errMsg: "" },
                  });
                  checkEmail({ variables: { email } });
                }
              }}
              // value={email}
              placeholder="Email"
              autoCorrect={false}
              autoCapitalize="none"
              placeholderTextColor={themes.primary}
              style={styles.input}
            />
          </Item>

          <Item style={styles.inputContainer}>
            <Input
              onChangeText={(text) => setPassword(text)}
              // value={password}
              placeholder="Password"
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              placeholderTextColor={themes.primary}
              style={styles.input}
            />
          </Item>
          {password !== "" && !login && (
            <Item style={styles.inputContainer}>
              <Input
                onChangeText={(text) => checkPassword(text)}
                // value={password}
                placeholder="Confirm Password"
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={true}
                placeholderTextColor={themes.primary}
                style={styles.input}
                onBlur={() => {
                  if (checkPass !== password) {
                    Alert.alert(`Password must match`);
                  }
                }}
              />
            </Item>
          )}

          {/* {!login && <Map style={styles.mapContainer} />} */}
          {!login && (
            <Map
              onSelectPostalCode={setPostalCode}
              onSelectInitialLat={setInitialLatEdit}
              onSelectInitialLng={setInitialLngEdit}
            />
          )}
        </Form>

        <Container style={styles.buttonContainer}>
          <Button
            rounded
            block
            iconRight
            bordered
            style={styles.button}
            disabled={errMsg !== "" && !login}
            onPress={() => {
              if (!login && errMsg !== "") {
                setAuthError({
                  variables: { errMsg: "" },
                });
              }

              // Input validation;
              let nullValues = [];
              if (!email) {
                nullValues.push("Email");
              }
              if (!password) {
                nullValues.push("Password");
              }
              if (!postalCode && !login) {
                nullValues.push("PostalCode");
              }
              if (nullValues.length) {
                Alert.alert(`Please fill in ${nullValues.join(", ")}`);
              } else {
                if (login) {
                  // email validation
                  const isEmail = email.includes("@");
                  const res = isEmail
                    ? signinResident({
                        variables: { email, password, fingerPrint: "" },
                      })
                    : signinResident({
                        variables: { email, password, fingerPrint: "" },
                      });
                } else {
                  // console.log(postalCode);
                  signupResident({
                    variables: {
                      email,
                      password,
                      postalCode,
                      initialLat,
                      initialLng,
                    },
                  });
                }
              }
            }}
          >
            <Text style={{ color: "#6F5FC6" }}>
              {login ? "Login" : "Sign Up"}
            </Text>
            {login ? (
              <Icon
                name="login-variant"
                size={20}
                style={styles.saveIcon}
                type="MaterialCommunityIcons"
              ></Icon>
            ) : (
              <Icon
                name="file-signature"
                size={20}
                style={styles.saveIcon}
                type="FontAwesome5"
              ></Icon>
            )}
          </Button>
          <Button
            rounded
            block
            iconRight
            backgroundColor={themes.primary}
            onPress={() => {
              setAuthError({
                variables: { errMsg: "" },
              });
              setLogin(!login);
            }}
            style={styles.buttonToggle}
          >
            <Text textColor="rgba(75, 148, 214, 1)">
              {login ? "Need an account?  Sign Up" : "Have an account?  Login"}
            </Text>
            {!login ? (
              <Icon
                name="login-variant"
                size={20}
                color={"#fff"}
                style={styles.saveIcon}
                type="MaterialCommunityIcons"
              ></Icon>
            ) : (
              <Icon
                name="file-signature"
                size={20}
                color={"#fff"}
                style={styles.saveIcon}
                type="FontAwesome5"
              ></Icon>
            )}
          </Button>
        </Container>
        <BottomSheet
          isVisible={emailSent}
          containerStyle={{
            backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              justifyContent: "center",
              alignItems: "center",
              width: width,
              height: 300,
            }}
          >
            <Text style={{ fontSize: 16, color: themes.primary }}>
              A email is sent to {email}, please confirm
            </Text>
            <Button
              block
              iconRight
              style={{
                backgroundColor: themes.primary,
              }}
              onPress={() => {
                setEmailSent(false);
              }}
            >
              <Text style={{ color: "white" }}>OK</Text>
              <Icon
                name="done"
                size={20}
                style={{ color: "white" }}
                type="MaterialIcons"
              ></Icon>
            </Button>
          </View>
        </BottomSheet>
      </Container>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    // marginTop: 40,
  },
  form: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    height: "55%",
  },
  inputContainer: {
    flex: 0.2,
    width: width - 110,
    alignSelf: "center",
    marginRight: 20,
    height: 30,
  },
  input: {
    height: 25,
    fontSize: 16,
    color: "#6F5FC6",
  },
  mapContainer: {
    flex: 1,
    marginBottom: 20,
    alignSelf: "center",
  },
  button: {
    width: width - 70,
    marginBottom: 15,
    // backgroundColor: "#6F5FC6",
    borderColor: "#6F5FC6",
    color: "#6F5FC6",
  },
  buttonToggle: {
    width: width - 70,
    marginBottom: 15,
    backgroundColor: "#6F5FC6",
  },
  buttonContainer: {
    height: "45%",
    alignItems: "center",
    // marginTop: 20,
    zIndex: -10,
  },
  saveIcon: {
    position: "relative",
    left: 5,
    zIndex: 8,
    color: "#6F5FC6",
  },

  errorMsg: {
    color: "#C51162",
    fontFamily: "Roboto_medium",
  },
});
