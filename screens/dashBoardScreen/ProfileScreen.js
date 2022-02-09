import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Input,
  Card,
  Icon,
  Overlay,
  Button,
  BottomSheet,
  Text,
  Avatar,
  Image,
  CheckBox,
  Tooltip,
} from "react-native-elements";
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import { useQuery, useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Picker } from "@react-native-community/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MultipleSelectPicker } from "react-native-multi-select-picker";
import { ImageManipulator } from "expo-image-crop";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";

import themes from "../../assets/themes";
import Map from "../../components/Map";
import Food from "../../models/Food";
import Hobbies from "../../models/Hobbies";
import {
  hobbies as hobbiesItems,
  religion as religionItems,
  favoriteFood as favoriteFoodItems,
} from "../../assets/constData";
import {
  GET_CURRENT_RESIDENT,
  CHECK_RESIDENTNAME,
} from "../../queries/queries_query";
import { UPDATE_PROFILE, UPDATE_AVATAR } from "../../queries/queries_mutation";
import _ from "lodash";
import { color } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const genderItems = ["Mr", "Ms", "They"];

const ProfileScreen = ({ route, navigation }) => {
  //define all states
  const [authOverlay, setAuthOverlay] = useState(false);
  const [personalOverlay, setPersonalOverlay] = useState(false);
  const [addressOverlay, setAddressOverlay] = useState(false);
  const [avatarOverlay, setAvatarOverlay] = useState(false);
  const [petOverlay, setPetOverlay] = useState(false);
  const [avatarEditorVisible, setAvatarEditorVisible] = useState(false);
  const [isReligionVisible, setIsReligionVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isGenderVisible, setIsGenderVisible] = useState(false);
  const [inputErrMsg, setInputErrMsg] = useState("");
  const [isHobbiesVisible, setIsHobbiesVisible] = useState(false);
  const [isFoodVisible, setIsFoodVisible] = useState(false);
  const [postalCodeErr, setPostalCodeErr] = useState("");

  const [avatar, setAvatar] = useState("");
  const [residentNameSave, setResidentNameSave] = useState("");
  const [residentNameEdit, setResidentNameEdit] = useState("");
  const [avatarEdit, setAvatarEdit] = useState("");
  const [passwordSave, setPasswordSave] = useState("");
  const [passwordEdit, setPasswordEdit] = useState("");
  const [reEnter, setReEnter] = useState("");
  const [firstNameSave, setFirstNameSave] = useState("");
  const [firstNameEdit, setFirstNameEdit] = useState("");
  const [lastNameSave, setLastNameSave] = useState("");
  const [lastNameEdit, setLastNameEdit] = useState("");
  const [genderSave, setGenderSave] = useState("");
  const [genderEdit, setGenderEdit] = useState("Mr");
  const [birthdaySave, setBirthdaySave] = useState("");
  const [birthdayEdit, setBirthdayEdit] = useState("");
  const [hobbiesSave, setHobbiesSave] = useState([]);
  const [hobbiesSelected, setHobbiesSelected] = useState([]);
  const [hobbiesEdit, setHobbiesEdit] = useState([]);
  const [foodSave, setFoodSave] = useState([]);
  const [foodEdit, setFoodEdit] = useState([]);
  const [foodSelected, setFoodSelected] = useState([]);
  const [religion, setReligion] = useState("");
  const [religionEdit, setReligionEdit] = useState("");
  const [address, setAddress] = useState("");
  const [addressEdit, setAddressEdit] = useState("");
  const [city, setCity] = useState("");
  const [cityEdit, setCityEdit] = useState("");
  const [mailingPC, setMailingPC] = useState("");
  const [mailingPCEdit, setMailingPCEdit] = useState("");
  const [image, setImage] = useState("");
  const [petSave, setPetSave] = useState("");
  const [petEdit, setPetEdit] = useState("");
  const [petImage, setPetImage] = useState("");
  const [petPreform, setPetPerform] = useState("");
  //get resident data from route params
  const { currentResident, petsInfo } = route.params;
  // console.log("profile 105");
  // console.log(petsInfo);
  const {
    _id,
    residentName,
    firstName,
    lastName,
    mailStrAddress,
    mailCity,
    mailPostalCode,
    postalCode,
    avatarPic,
    pet,
    hobbies,
    belief,
    favoriteFood,
    gender,
    birthday,
    email,
  } = currentResident;

  // initialize states
  useEffect(() => {
    if (currentResident) {
      setResidentNameSave(residentName);
      setResidentNameEdit(residentName);
      setAvatarEdit(avatarPic);
      setAvatar(avatarPic);
      setFirstNameSave(firstName);
      setFirstNameEdit(firstName);
      setLastNameSave(lastName);
      setLastNameEdit(lastName);
      setGenderSave(gender);
      setGenderEdit(gender);
      setBirthdaySave(new Date(+birthday));
      setBirthdayEdit(new Date(+birthday));
      setAddress(mailStrAddress);
      setAddressEdit(mailStrAddress);
      setHobbiesSave(hobbiesModel);
      setHobbiesEdit(hobbiesModel);
      setFoodSave(foodModel);
      setFoodEdit(foodModel);
      setReligion(belief);
      setReligionEdit(belief);
      setCity(mailCity);
      setCityEdit(mailCity);
      setMailingPC(mailPostalCode);
      setMailingPCEdit(mailPostalCode);
      setPetSave(pet.petName);
      setPetEdit(pet.petName);
      setPetImage(pet.petImgUrl);
      setPetPerform(pet.petPerformance);
    }
  }, []);

  //get pets data

  const hobbiesModel = hobbies.map((h) => {
    return new Hobbies(h);
  });
  const foodModel = favoriteFood.map((h) => {
    return new Food(h);
  });
  // console.log(currentResident.avatarPic);
  // const { data } = useQuery(GET_CURRENT_RESIDENT);
  // console.log(data);

  // check new resident name
  const [checkResidentName] = useLazyQuery(CHECK_RESIDENTNAME, {
    async onCompleted({ checkResidentName }) {
      const { residentNameVal } = checkResidentName;
      // console.log(residentNameVal);
      if (residentNameVal) {
        setInputErrMsg("This Resident Name In Use");
      }
    },
    fetchPolicy: "cache-and-network",
  });

  // UPDATE_AVATAR
  const [updateAvatar] = useMutation(UPDATE_AVATAR, {
    async onCompleted({ updateAvatar }) {
      // console.log(updateAvatar);
    },
    // async update(cache, { data: { updateAvatar } }) {
    //   // console.log(changePostalCode);
    //   // First read the query you want to update
    //   const data = cache.readQuery({ query: GET_CURRENT_RESIDENT });
    //   // Create updated data
    //   data.getCurrentResident.avatarPic = updateAvatar.avatar;

    //   // Write updated data back to query
    //   // console.log(data);
    //   cache.writeQuery({
    //     query: GET_CURRENT_RESIDENT,
    //     data,
    //   });
    // },
    // optimisticResponse: {
    //   __typename: "Mutation",
    //   updateAvatar: {
    //     __typename: "Avatar",
    //     avatar: avatar,
    //   },
    // },
  });

  //update profile
  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    async update(cache, { data: { updateProfile }}) {
      console.log('update profile', updateProfile)
      const data = cache.readQuery({ query: GET_CURRENT_RESIDENT });
        // Create updated data
        data.getCurrentResident = updateProfile
  
        // Write updated data back to query
        // console.log(data);
        cache.writeQuery({
          query: GET_CURRENT_RESIDENT,
          data,
        });
    },
    refetchQueries: [
      {
        query: GET_CURRENT_RESIDENT,
      },
    ],
    awaitRefetchQueries: true,
  });

  // Save updated data
  const saveUpdate = () => {
    const hobbiesToSave = hobbiesSave.map((hobby) => {
      return hobby.value;
    });
    const foodToSave = foodSave.map((food) => {
      return food.value;
    });
    let payload = {
      residentId: _id,
      residentName: residentNameSave,
      lastName: lastNameSave,
      firstName: firstNameSave,
      mailPostalCode: postalCodeFormat(mailingPC),
      mailStrAddress: address,
      mailCity: city,
      gender: genderSave,
      birthday: new Date(birthdaySave),
      pet: petSave,
      hobbies: hobbiesToSave,
      password: passwordSave ? passwordSave : "",
      favoriteFood: foodToSave,
      belief: religion,
      postalCode: postalCode,
    };
    updateProfile({ variables: payload });
  };

  //choose image from phone image folder
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  //refresh the change avatar icon
  const changeAvatar =
    // useCallback(
    () => {
      navigation.setOptions({
        headerTitle: "Profile",
        // headerTitleAlign: "left",
        headerRight: () => {
          return (
            <Avatar
              rounded
              source={{
                uri: avatar ? avatar : avatarPic,
              }}
              size={40}
              onPress={() => setAvatarOverlay(true)}
              containerStyle={{ marginRight: 45, marginBottom: 7 }}
            >
              <Avatar.Accessory
                onPress={() => {
                  setAvatarOverlay(true);
                }}
                name="edit"
                type="antDesign"
                size={18}
                containerStyle={{
                  backgroundColor: themes.primary,
                  borderRadius: 50,
                  paddingTop: 3,
                  margin: -10,
                  overflow: "hidden",
                }}
                color="white"
              />
            </Avatar>
          );
        },
      });
    };
  // , [avatarEdited]);

  //pick image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setAvatarEditorVisible(true);
    }
  };

  //select birthday
  const handleBirthdayConfirm = (date) => {
    // console.log("A date has been picked: ", date);
    // console.log(new Date(date));
    // console.log(moment(date).format("YYYY-MM-DD"));
    setBirthdayEdit(date);
    setIsDatePickerVisible(false);
  };

  // toggle avatart editor
  const onToggleModal = () => {
    setAvatarEditorVisible(!avatarEditorVisible);
  };

  //turn yellow box warning
  // useEffect(() => {
  //   LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  // }, []);

  useEffect(() => {
    if (avatar) {
      changeAvatar();
    }
  }, [avatar]);

  //format postal code
  const postalCodeFormat = (postalCode) => {
    if (postalCode.length == 6) {
      const postalCodeFormatted = postalCode
        .slice(0, 3)
        .concat(" ", postalCode.slice(3));
      return postalCodeFormatted.toUpperCase();
    } else {
      return postalCode;
    }
  };

  const petImg = (petTitle) => {
    if (petsInfo.length > 0 && petTitle) {
      // console.log("profile 362");
      // console.log(petsInfo);
      // console.log(petTitle);
      const index = _.findIndex(petsInfo, (pet) => {
        return pet.petName == petTitle;
      });
      // console.log(index);

      return index > 0 ? petsInfo[index].petImgUrl : petsInfo[0].petImgUrl;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar Overlay */}
        <Overlay
          isVisible={avatarOverlay}
          animationType="slide"
          backdropStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        >
          <View style={styles.overlayForm}>
            <Text style={styles.formTitle}>Edit Avatar</Text>

            <ImageBackground
              resizeMode="contain"
              style={{
                justifyContent: "center",
                padding: 20,
                alignItems: "center",
                height: 250,
                width: 250,
                backgroundColor: "black",
                borderRadius: 200,
                overflow: "hidden",
              }}
              source={{ uri: avatarEdit }}
            >
              <Avatar
                rounded
                source={{
                  uri: avatarEdit,
                }}
                size={250}
                containerStyle={{ zIndex: 10 }}
              />

              <ImageManipulator
                photo={{ uri: image }}
                isVisible={avatarEditorVisible}
                onPictureChoosed={(data) => {
                  setAvatarEdit("data:image/png;base64," + data.base64);
                  // changeAvatar();
                }}
                onToggleModal={() => onToggleModal()}
                saveOptions={{ base64: true }}
              // allowFlip={false}
              // allowRotate={false}
              />
            </ImageBackground>
            <Button
              title="Change Avatar"
              onPress={() => pickImage()}
              buttonStyle={{
                backgroundColor: themes.primary,
                width: 120,
                height: 30,
                marginVertical: 25,
                zIndex: 100,
              }}
              titleStyle={{ fontSize: 12 }}
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
                  setAvatarEdit(avatar);
                  setAvatarOverlay(false);
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
                  changeAvatar();
                  setAvatar(avatarEdit);
                  // updateAvatar({
                  //   variables: { avatarUpdated: avatarEdit, email: email },
                  // });

                  setAvatarOverlay(false);
                }}
                title="OK"
                disabled={inputErrMsg !== ""}
                disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                buttonStyle={{
                  backgroundColor: themes.primary,
                  marginHorizontal: 10,
                }}
              />
            </View>
          </View>
        </Overlay>

        {/* Auth Info Card */}
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>
            Auth Info
            <Icon
              name="edit"
              type="antDesign"
              color={themes.primary}
              size={17}
              iconStyle={styles.iconCard}
              onPress={() => {
                setAuthOverlay(true);
              }}
            />
          </Card.Title>
          <View style={styles.cardItemsContainer}>
            <Text style={styles.cardItems}>
              Resident Name: {residentNameSave}
            </Text>
            <Text style={styles.cardItems}>Password: .......</Text>
          </View>
        </Card>

        {/* Auth Info Overlay */}
        <Overlay
          isVisible={authOverlay}
          animationType="slide"
          backdropStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        >
          <View style={styles.overlayForm}>
            <Text style={styles.formTitle}>Edit Auth Info</Text>
            {/* <Input
            placeholder="Resident Email"
            leftIcon={{ name: "email", type: "material" }}
            inputStyle={styles.input}
            disabled={true}
            leftIconContainerStyle={styles.iconInput}
            placeholderTextColor={themes.primary}
          /> */}
            <Input
              placeholder="Resident Name"
              onChangeText={(text) => {
                setInputErrMsg("");
                setResidentNameEdit(text);
                checkResidentName({ variables: { residentName: text } });
              }}
              inputStyle={styles.input}
              placeholderTextColor="#BDBDBD"
              errorStyle={{ color: "red" }}
              errorMessage={inputErrMsg}
              value={residentNameEdit}
              label="Resident Name"
              autoCapitalize="none"
            />

            <Input
              placeholder="New Password"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPasswordEdit(text);
              }}
              inputStyle={styles.input}
              placeholderTextColor="#BDBDBD"
            />
            {passwordEdit !== "" && (
              <Input
                placeholder="Confirm"
                secureTextEntry={true}
                placeholderTextColor="#BDBDBD"
                onChangeText={(text) => {
                  setReEnter(text);
                }}
                inputStyle={styles.input}
                onBlur={() => {
                  if (passwordEdit !== reEnter) {
                    Alert.alert("Password must match", " ", [{text: "OK"}]);
                  }
                }}
              />
            )}

            <View style={styles.buttonContainer}>
              <Button
                icon={{
                  name: "cancel",
                  type: "material",
                  color: themes.primary,
                }}
                iconRight
                onPress={() => {
                  setResidentNameEdit(residentNameSave);
                  setPasswordEdit("");
                  setReEnter("");
                  setAuthOverlay(false);
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
                  setResidentNameSave(residentNameEdit);
                  if (passwordEdit === reEnter) {
                    setPasswordSave(passwordEdit);
                  }
                  setAuthOverlay(false);
                }}
                title="OK"
                disabled={passwordEdit !== reEnter}
                disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                buttonStyle={{
                  backgroundColor: themes.primary,
                  marginHorizontal: 10,
                }}
              />
            </View>
          </View>
        </Overlay>

        {/* Personal Info Card */}
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>
            Personal Info
            <Icon
              name="edit"
              type="antDesign"
              color={themes.primary}
              size={17}
              iconStyle={styles.iconCard}
              onPress={() => {
                setPersonalOverlay(true);
              }}
            />
          </Card.Title>
          <View style={styles.cardItemsContainer}>
            <Text style={styles.cardItems}>First Name: {firstNameSave}</Text>
            <Text style={styles.cardItems}>Last Name: {lastNameSave}</Text>
            <Text style={styles.cardItems}>Gender: {genderSave}</Text>
            <Text style={styles.cardItems}>
              Birthday: {moment(birthdaySave).format("YYYY-MM-DD")}
            </Text>
            <View style={styles.cardItemsContainer}>
              <Text style={styles.cardItems}>Hobbies:</Text>
              {hobbiesSave.map((h, i) => (
                <Button
                  type="outline"
                  title={h.value}
                  key={i}
                  disabled={true}
                  buttonStyle={{
                    borderColor: themes.primary,
                    borderRadius: 30,
                    color: themes.primary,
                  }}
                  titleStyle={{ color: themes.primary, fontSize: 12 }}
                />
                
              ))}
            </View>
            <View style={styles.cardItemsContainer}>
              <Text style={styles.cardItems}>Favorite Food:</Text>
              {foodSave.map((h, i) => (
                <Button
                  type="outline"
                  title={h.value}
                  key={i}
                  disabled={true}
                  buttonStyle={{
                    borderColor: themes.primary,
                    borderRadius: 30,
                    color: themes.primary,
                  }}
                  titleStyle={{ color: themes.primary, fontSize: 12 }}
                />
              ))}
            </View>
            <Text style={styles.cardItems}>Belief: {religion}</Text>
          </View>
        </Card>

        {/* Personal Info Overlay */}
        <Overlay
          isVisible={personalOverlay}
          animationType="slide"
          backdropStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        >
          <View style={styles.overlayForm}>
            <Text style={styles.formTitle}>Edit Personal Info</Text>
            <ScrollView
            // contentInset={{ top: 5, bottom: 5 }}
            // contentContainerStyle={{ height: height - 600, marginVertical: 5 }}
            showsVerticalScrollIndicator={false}
            >
              {/* First Name */}
              <Input
                placeholder="First Name"
                onChangeText={(text) => {
                  setFirstNameEdit(text);
                }}
                inputStyle={styles.input}
                placeholderTextColor="#BDBDBD"
                value={firstNameEdit}
              />
              {/* Last Name */}
              <Input
                placeholder="Last Name"
                onChangeText={(text) => {
                  setLastNameEdit(text);
                }}
                inputStyle={styles.input}
                placeholderTextColor="#BDBDBD"
                value={lastNameEdit}
              />
              {/* Birthday */}
              <Input
                placeholder="Birthday"
                rightIcon={
                  <Icon
                    name="date"
                    type="fontisto"
                    color={themes.primary}
                    onPress={() => setIsDatePickerVisible(true)}
                    size={22}
                  />
                }
                value={moment(birthdayEdit).format("YYYY-MM-DD")}
                inputStyle={styles.input}
                placeholderTextColor="#BDBDBD"
                editable={false}
              />
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleBirthdayConfirm}
                onCancel={() => setIsDatePickerVisible(false)}
              />
              {/* Gender */}
              <Input
                placeholder="Gender"
                inputStyle={styles.input}
                editable={false}
                value={genderEdit}
                placeholderTextColor="#BDBDBD"
                rightIcon={
                  <Icon
                    name="human-male-female"
                    type="material-community"
                    color={themes.primary}
                    onPress={() => setIsGenderVisible(true)}
                  />
                }
              />
              <BottomSheet
                isVisible={isGenderVisible}
                containerStyle={{
                  backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Button
                  icon={{ name: "done", type: "material", color: "white" }}
                  iconRight
                  onPress={() => {
                    setIsGenderVisible(false);
                  }}
                  title="Done"
                  buttonStyle={{
                    backgroundColor: themes.primary,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                  }}
                />
                <Picker
                  selectedValue={genderEdit}
                  placeholder="Gender"
                  style={{
                    height: 300,
                    width: width,
                    backgroundColor: "white",
                    marginBottom: 50,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    // console.log(itemValue);
                    setGenderEdit(itemValue);
                  }}
                >
                  {genderItems.map((g, i) => (
                    <Picker.Item key={i} label={g} value={g} />
                  ))}
                </Picker>
              </BottomSheet>
              {/* Hobbies */}
              <View
                style={{
                  width: width - 120,
                  borderWidth: 1,
                  borderColor: "#EDE7F6",
                  padding: 2,
                  marginVertical: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    marginBottom: 5,
                  }}
                >
                  <Button
                    style={{ color: themes.primary }}
                    onPress={() => setIsHobbiesVisible(true)}
                    title="Hobbies"
                    iconRight
                    icon={{
                      name: "sports-esports",
                      type: "material",
                      color: themes.primary,
                    }}
                    type="clear"
                    titleStyle={{ color: "#BDBDBD" }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  {hobbiesEdit.map((h, i) => (
                    <Button
                      type="outline"
                      title={h.value}
                      key={i}
                      disabled={true}
                      buttonStyle={{
                        borderColor: themes.primary,
                        borderRadius: 30,
                        color: themes.primary,
                      }}
                      titleStyle={{ color: themes.primary, fontSize: 12 }}
                    />
                  ))}
                </View>
              </View>

              <BottomSheet
                isVisible={isHobbiesVisible}
                containerStyle={{
                  backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Button
                  icon={{ name: "done", type: "material", color: "white" }}
                  iconRight
                  onPress={() => {
                    setHobbiesEdit(hobbiesSelected);
                    setIsHobbiesVisible(false);
                  }}
                  title="Done"
                  buttonStyle={{
                    backgroundColor: themes.primary,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                  }}
                />

                <MultipleSelectPicker
                  items={hobbiesItems.sort()}
                  onSelectionsChange={(ele) => {
                    // console.log(ele);
                    setHobbiesSelected(ele);
                  }}
                  selectedItems={hobbiesSelected}
                  buttonStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                  buttonText="hello"
                  checkboxStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: "#fff",
                  }}
                  selectedCheckboxStyle={{ backgroundColor: "#B39DDB" }}
                  style={{
                    height: 300,
                    width: width,
                    backgroundColor: "white",
                    marginBottom: 50,
                  }}
                />
              </BottomSheet>

              {/* Favorite Food */}

              <View
                style={{
                  width: width - 120,
                  borderWidth: 1,
                  borderColor: "#EDE7F6",
                  padding: 2,
                  marginVertical: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    marginBottom: 5,
                  }}
                >
                  <Button
                    style={{ color: themes.primary }}
                    onPress={() => setIsFoodVisible(true)}
                    title="Favorite Food"
                    iconRight
                    icon={{
                      name: "food",
                      type: "material-community",
                      color: themes.primary,
                    }}
                    type="clear"
                    titleStyle={{ color: "#BDBDBD" }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    flexWrap: "wrap",
                  }}
                >
                  {foodEdit.map((h, i) => (
                    <Button
                      type="outline"
                      title={h.value}
                      key={i}
                      disabled={true}
                      buttonStyle={{
                        borderColor: themes.primary,
                        borderRadius: 30,
                        color: themes.primary,
                      }}
                      titleStyle={{ color: "#BDBDBD", fontSize: 12 }}
                    />
                  ))}
                </View>
              </View>

              <BottomSheet
                isVisible={isFoodVisible}
                containerStyle={{
                  backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Button
                  icon={{ name: "done", type: "material", color: "white" }}
                  iconRight
                  onPress={() => {
                    setFoodEdit(foodSelected);
                    setIsFoodVisible(false);
                  }}
                  title="Done"
                  buttonStyle={{
                    backgroundColor: themes.primary,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                  }}
                />

                <MultipleSelectPicker
                  items={favoriteFoodItems.sort()}
                  onSelectionsChange={(ele) => {
                    // console.log(ele);
                    setFoodSelected(ele);
                  }}
                  selectedItems={foodSelected}
                  buttonStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 100,
                  }}
                  buttonText="hello"
                  checkboxStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: "#fff",
                  }}
                  selectedCheckboxStyle={{ backgroundColor: "#B39DDB" }}
                  style={{
                    height: 300,
                    width: width,
                    backgroundColor: "white",
                    marginBottom: 50,
                  }}
                />
              </BottomSheet>
              {/* Religion */}
              <Input
                placeholder="Religion"
                inputStyle={styles.input}
                placeholderTextColor="#BDBDBD"
                editable={false}
                value={religionEdit}
                rightIcon={
                  <Icon
                    name="praying-hands"
                    type="font-awesome-5"
                    color={themes.primary}
                    size={18}
                    onPress={() => setIsReligionVisible(true)}
                  />
                }
              />
              <BottomSheet
                isVisible={isReligionVisible}
                containerStyle={{
                  backgroundColor: "rgba(0.5, 0.25, 0, 0.2)",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Button
                  icon={{ name: "done", type: "material", color: "white" }}
                  iconRight
                  onPress={() => {
                    setIsReligionVisible(false);
                  }}
                  title="Done"
                  buttonStyle={{
                    backgroundColor: themes.primary,
                    borderTopStartRadius: 15,
                    borderTopEndRadius: 15,
                  }}
                />
                <Picker
                  selectedValue={religionEdit}
                  placeholder="Food"
                  style={{
                    height: 300,
                    width: width,
                    backgroundColor: "white",
                    marginBottom: 50,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    // console.log(itemValue);
                    setReligionEdit(itemValue);
                  }}
                >
                  {religionItems.map((g, i) => (
                    <Picker.Item key={i} label={g} value={g} />
                  ))}
                </Picker>
              </BottomSheet>
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Button
                icon={{
                  name: "cancel",
                  type: "material",
                  color: themes.primary,
                }}
                iconRight
                onPress={() => {
                  setFirstNameEdit(firstNameSave);
                  setLastNameEdit(lastNameSave);
                  setGenderEdit(genderSave);
                  setHobbiesEdit(hobbiesSave);
                  setFoodEdit(foodSave);
                  setReligionEdit(religion);
                  setBirthdayEdit(birthdaySave);
                  setHobbiesSelected([]);
                  setFoodSelected([]);
                  setPersonalOverlay(false);
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
                  setFirstNameSave(firstNameEdit);
                  setLastNameSave(lastNameEdit);
                  setGenderSave(genderEdit);
                  setHobbiesSave(hobbiesEdit);
                  setFoodSave(foodEdit);
                  setReligion(religionEdit);
                  setBirthdaySave(birthdayEdit);
                  setPersonalOverlay(false);
                }}
                title="OK"
                disabled={passwordEdit !== reEnter}
                disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                buttonStyle={{
                  backgroundColor: themes.primary,
                  marginHorizontal: 10,
                }}
              />
            </View>
            {/* </View> */}
          </View>
        </Overlay>

        {/* Mailing Address */}
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>
            Mailing Address
            <Icon
              name="edit"
              type="antDesign"
              color={themes.primary}
              size={17}
              iconStyle={styles.iconCard}
              onPress={() => {
                setAddressOverlay(true);
              }}
            />
          </Card.Title>
          <View style={styles.cardItemsContainer}>
            <Text style={styles.cardItems}>Street Address: {address}</Text>
            <Text style={styles.cardItems}>City: {city}</Text>
            <Text style={styles.cardItems}>
              Province/Country: Ontario/Canada
            </Text>
            <Text style={styles.cardItems}>
              Mailing Postal Code: {mailingPC}
            </Text>
          </View>
        </Card>
        {/* Mailing Address Overlay */}
        <Overlay
          isVisible={addressOverlay}
          animationType="slide"
          backdropStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        >
          <View style={styles.overlayForm}>
            <Text style={styles.formTitle}>Edit Mailing Address</Text>
            <Input
              placeholder="Address"
              onChangeText={(text) => {
                setAddressEdit(text);
              }}
              inputStyle={styles.input}
              placeholderTextColor="#BDBDBD"
              value={addressEdit}
            />
            <Input
              placeholder="City"
              onChangeText={(text) => {
                setCityEdit(text);
              }}
              inputStyle={styles.input}
              placeholderTextColor="#BDBDBD"
              value={cityEdit}
            />
            <Input
              placeholder="Province/Country"
              inputStyle={styles.input}
              placeholderTextColor="#BDBDBD"
              value="Ontario/Canada"
              editable={false}
            />
            <Input
              placeholder="Postal Code"
              onChangeText={(text) => {
                setPostalCodeErr("");
                setMailingPCEdit(text);
                if (
                  !/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(
                    text
                  )
                ) {
                  setPostalCodeErr("Not a valid Canadian Postal Code");
                }
              }}
              inputStyle={styles.input}
              errorStyle={{ color: "red" }}
              errorMessage={postalCodeErr}
              placeholderTextColor="#BDBDBD"
              value={mailingPCEdit}
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
                  setAddressEdit(address);
                  setCityEdit(city);
                  setMailingPCEdit(mailingPC);
                  setAddressOverlay(false);
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
                  // if (passwordEdit === reEnter) {
                  setAddress(addressEdit);
                  setCity(cityEdit);
                  setMailingPC(mailingPCEdit);
                  // }
                  setAddressOverlay(false);
                }}
                title="OK"
                disabled={postalCodeErr !== ""}
                disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                buttonStyle={{
                  backgroundColor: themes.primary,
                  marginHorizontal: 10,
                }}
              />
            </View>
          </View>
        </Overlay>
        {/* My Pet */}
        <Card containerStyle={styles.card}>
          <Card.Title style={styles.title}>
            My Pet
            <Icon
              name="edit"
              type="antDesign"
              color={themes.primary}
              size={17}
              iconStyle={styles.iconCard}
              onPress={() => {
                setPetOverlay(true);
              }}
            />
          </Card.Title>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-center",
              alignItems: "flex-center",
              flexWrap: "wrap",
            }}
          >
            <Text style={styles.cardItems}>Pet Name: {petSave}</Text>
            <View>
              <Image
                resizeMode="contain"
                source={{
                  uri: petImg(petSave),
                }}
                style={styles.petImage}
              />
            </View>

            <Text style={styles.performance}>
              Performance: {petPreform}
            </Text>
          </View>

        </Card>
        {/* Pet Overlay */}
        <Overlay
          isVisible={petOverlay}
          animationType="slide"
          backdropStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        >
          <View style={styles.overlayForm}>
            <Text style={styles.formTitle}>Edit Pet</Text>
             {/* pet choice image*/}
            {petsInfo &&
              petsInfo.map((pet, i) => {
                return (
                  <View key={i} style={styles.imageContainer}>
                    <Tooltip
                      width={350}
                      height={90}
                      popover={
                        <Text style={{ color: "white" }} numberOfLines={3}>
                          {pet.petName + ":  " + pet.petPerformance}
                        </Text>
                      }
                    >
                      <Image
                        resizeMode="contain"
                        source={{
                          uri: pet.petImgUrl,
                          // "https://www.animatedimages.org/data/media/532/animated-chicken-image-0157.gif",
                        }}
                        style={styles.petImage}
                      />
                    </Tooltip>
                    <CheckBox
                      checked={petEdit == pet.petName}
                      onPress={() => {
                        setPetEdit(pet.petName);
                        setPetImage(pet.petImgUrl);
                        setPetPerform(pet.petPerformance);
                      }}
                    />
                  </View>
                );
              })}
            {/* </View> */}
            <View style={styles.buttonContainer}>
              <Button
                icon={{
                  name: "cancel",
                  type: "material",
                  color: themes.primary,
                }}
                iconRight
                onPress={() => {
                  setPetEdit(petSave);
                  setPetOverlay(false);
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
                  setPetSave(petEdit);
                  setPetOverlay(false);
                }}
                title="OK"
                disabled={inputErrMsg !== ""}
                disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
                buttonStyle={{
                  backgroundColor: themes.primary,
                  marginHorizontal: 10,
                }}
              />
            </View>
          </View>
        </Overlay>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          icon={{ name: "cancel", type: "material", color: themes.primary }}
          iconRight
          onPress={() => {
            navigation.replace("DashBoard");
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
          icon={{ name: "save", type: "entypo", color: "white" }}
          iconRight
          onPress={() => {
            updateAvatar({
              variables: { avatarUpdated: avatar, email: email },
            });
            saveUpdate();
            navigation.replace("DashBoard");
          }}
          title="Save "
          disabled={passwordEdit !== reEnter}
          disabledStyle={{ backgroundColor: "#ECEFF1", color: "#ECEFF1" }}
          buttonStyle={{
            backgroundColor: themes.primary,
            marginHorizontal: 10,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 8,
    backgroundColor: "#fff",
    width: "60%",
  },
  card: {
    width: "90%",
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#212121",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  cardItems: {
    margin: 5,
    color: themes.primary,
    fontSize: 12,
  },
  cardItemsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  cropView: {
    width: "100%",
    height: 400,
  },
  formTitle: {
    fontFamily: "Roboto_medium",
    fontSize: 18,
    color: themes.primary,
    marginBottom: 12,
  },
  iconCard: {
    marginTop: 14,
    marginLeft: 10,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginVertical: 5,
    width: width - 150,
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 0.5,
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: { width: 0, height: 1 },
  },
  input: {
    color: themes.primary,
    marginVertical: 5,
    zIndex: -1,
  },
  overlayForm: {
    width: width - 80,
    height: height - 200,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    borderRadius: 5,
  },
  petImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  performance: {
    margin: 5,
    color: themes.primary,
    fontSize: 14,
  },
  title: {
    color: themes.primary,
    alignSelf: "flex-start",
  },
});

export default ProfileScreen;
