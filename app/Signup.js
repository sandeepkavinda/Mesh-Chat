import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Colors } from "./colors";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const mainLogoPath = require("../assets/images/logo_with_name.png");
const defaultProfileImage = require("../assets/images/defalut_profile_image.png");

export default function Signup() {
  const [getImage, setImage] = useState(defaultProfileImage);

  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastNmae, setLastNmae] = useState("");
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      style={stylesheet.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={stylesheet.scrollContainer}>
        <View style={stylesheet.mainContainer}>
          <View style={stylesheet.logoContainer}>
            <Image
              source={mainLogoPath}
              style={stylesheet.logo}
              contentFit="contain"
            />
            <Text style={[stylesheet.slogan]}>
              Connect. Communicate. Collaborate.
            </Text>
          </View>

          <Text
            style={[stylesheet.text, stylesheet.textWhite, stylesheet.title]}
          >
            Create Account
          </Text>
          <Text style={[stylesheet.subTitle]}>
            Join us and start your journey with Mesh!
          </Text>

          <View style={{ alignItems: "center", marginBottom: 5 }}>
            <Image
              source={getImage}
              style={stylesheet.selectedImage}
              contentFit="cover"
            />
            <Button
              color={Colors.grey1}
              title="Choose Image"
              onPress={async () => {
                let result = await ImagePicker.launchImageLibraryAsync();

                if (!result.canceled) {
                  setImage(result.assets[0].uri);
                }
              }}
            />
          </View>

          <Text style={[stylesheet.textWhite, stylesheet.inputLabel]}>
            Mobile
          </Text>
          <TextInput
            style={stylesheet.textInput}
            inputMode="tel"
            maxLength={10}
            onChangeText={(text) => {
              setMobile(text);
            }}
          />

          <Text style={[stylesheet.textWhite, stylesheet.inputLabel]}>
            First Name
          </Text>
          <TextInput
            style={stylesheet.textInput}
            inputMode="text"
            onChangeText={(text) => {
              setFirstName(text);
            }}
          />

          <Text style={[stylesheet.textWhite, stylesheet.inputLabel]}>
            Last Name
          </Text>
          <TextInput
            style={stylesheet.textInput}
            inputMode="text"
            onChangeText={(text) => {
              setLastNmae(text);
            }}
          />

          <Text style={[stylesheet.textWhite, stylesheet.inputLabel]}>
            Password
          </Text>
          <TextInput
            style={stylesheet.textInput}
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />

          <Pressable
            style={stylesheet.signinButton}
            onPress={async () => {
              try {
                let formData = new FormData();
                formData.append("mobile", getMobile);
                formData.append("firstName", getFirstName);
                formData.append("lastName", getLastNmae);
                formData.append("password", getPassword);

                if (getImage != null) {
                  formData.append("avatarImage", {
                    name: "avatar",
                    type: "image/png",
                    uri: getImage,
                  });
                }

                let response = await fetch(
                  "http://192.168.207.254:8080/Mesh_Chat/Signup",
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {
                    //user registration complete
                    router.replace("/");
                  } else {
                    //problem
                    Alert.alert("Error", json.message);
                  }
                }
              } catch (error) {
                console.error(error);
                Alert.alert(
                  "Error",
                  "An unexpected error occurred. Please try again."
                );
              }
            }}
          >
            <Text style={[stylesheet.textWhite, stylesheet.signinButtonText]}>
              Create Account
            </Text>
          </Pressable>

          <View style={stylesheet.logoContainer}>
            <Text style={[stylesheet.subTitle, { marginTop: 20 }]}>
              Already Have Account?{" "}
              <Text 
              style={stylesheet.blueUnderlinedLink}
              onPress={
                ()=>{
                  router.push("/");
                }
              }
              >Sign in</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stylesheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  "white",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  mainContainer: {
    flex: 1,
    backgroundColor:  "white",
    justifyContent: "center",
    paddingHorizontal: 50,
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 40,
  },

  textWhite: {
    color: Colors.black,
  },

  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 28,
  },

  slogan: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: Colors.blue,
  },

  subTitle: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: Colors.grey1,
    marginBottom: 40,
  },

  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: "Poppins-Medium",
  },

  textInput: {
    fontFamily: "Poppins-Regular",
    borderColor: Colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    height: 50,
    fontSize: 18,
    paddingLeft: 10,
    borderRadius: 5,
    color: Colors.grey1,
    marginBottom: 10,
  },

  signinButton: {
    backgroundColor: Colors.blue,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    borderRadius: 5,
  },
  signinButtonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: Colors.white,
  },

  blueUnderlinedLink: {
    color: Colors.blue,
    textDecorationLine: "underline",
    fontFamily: "Poppins-SemiBold",
  },

  selectedImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
    borderRadius: "100%",
  },
});
