import {
  Alert,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const mainLogoPath = require("../assets/images/logo_with_name.png");

export default function index() {

  const [getMobile, setMobile] = useState("");
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

  useEffect(
    ()=>{
      async function checkUser() {
        console.log("Use effect 2");
        try {
          let userJson = await AsyncStorage.getItem("user");
    
          if (userJson != null) {
            router.replace("/Home");
          }
        } catch (e) {
          console.log(e);
        }
      }

      checkUser();
    },[]
   );

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
            Sign In
          </Text>
          <Text style={[stylesheet.subTitle]}>
          Welcome back to Mesh! We're glad to see you
          </Text>


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

                let response = await fetch(
                  "http://192.168.207.254:8080/Mesh_Chat/Signin",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      mobile: getMobile,
                      password: getPassword,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                if (response.ok) {
                  let json = await response.json();
                  if (json.success) {

                    let user = json.user
                    //user registration complete
                    await AsyncStorage.setItem("user",JSON.stringify(user));
                   
                    router.replace("/Home");
                  } else {
                    //problem
                    Alert.alert("Warning", json.message);
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
              Already Have Not Account?
              <Text style={stylesheet.blueUnderlinedLink} 
              onPress={
                ()=>{
                  router.push("/Signup");
                }
              }
              > Create New</Text>
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
    backgroundColor: "white",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor:  "white",
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 50,
    paddingTop: 80,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 100,
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
    color: "white",
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