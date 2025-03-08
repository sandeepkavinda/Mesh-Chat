import { registerRootComponent } from "expo";
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "./colors";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

const mainLogoPath = require("../assets/images/logo_with_name.png");
const defaultProfileImage = require("../assets/images/defalut_profile_image.png");

SplashScreen.preventAutoHideAsync();



export default function Home() {

  const [getChatArray, setChatArray] = useState([]);
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
    async function fetchData() {
      try {
        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);
        let response = await fetch(
          "http://192.168.207.254:8080/Mesh_Chat/LoadHomeData?id=" + user.id
        );

        if (response.ok) {
          let json = await response.json();

          if (json.success) {
            console.log(json);
            let chatArray = json.chatArray;
            console.log(chatArray);
            setChatArray(chatArray);
          }
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }

    fetchData();
  }, []);

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
      <View style={stylesheet.headerArea}>
        <Image
          source={mainLogoPath}
          style={stylesheet.logo}
          contentFit="contain"
        />

        <Pressable
          onPress={async () => {
            try {
              await AsyncStorage.removeItem("user");
              router.push("/");
            } catch (error) {
              alert(error);
            }
          }}
        >
          <Image
            source={defaultProfileImage}
            style={stylesheet.myProfileImage}
            contentFit="contain"
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={stylesheet.scrollContainer}>
        <View style={stylesheet.mainContainer}>

          <FlashList
            data={getChatArray}
            renderItem={({ item }) => (
              <Pressable
                style={stylesheet.chatContainer}
                onPress={() => {
                  router.push({
                    pathname: "/Chat",
                    params: item,
                  });
                }}
              >
                <Image
                  source={
                    item.other_user_found
                      ? "http://192.168.207.254:8080/Mesh_Chat/Avatar_images/" +
                        item.mobile +
                        ".png"
                      : defaultProfileImage
                  }
                  style={stylesheet.chatProfileImage}
                  contentFit="cover"
                />
                <View style={stylesheet.chatDetails1}>
                  <Text style={[stylesheet.textWhite, stylesheet.chatUserName]}>
                    {item.other_user_name}
                  </Text>

                  <Text
                    style={[stylesheet.textWhite, stylesheet.chatLastMessage]}
                    numberOfLines={2}
                  >
                    <FontAwesome6
                      name="check-double"
                      color={item.chat_status == 1 ? Colors.blue : Colors.grey1}
                    />
                    <Text> </Text>
                    {item.message}
                  </Text>
                </View>

                <View style={stylesheet.chatDetails2}>
                  <Text style={stylesheet.chatUserName}>{item.datetime}</Text>
                  <View style={stylesheet.notificationCount}>
                    <Text style={stylesheet.notificationCountText}></Text>
                  </View>
                </View>
              </Pressable>
            )}
            estimatedItemSize={200}
          />
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
  },

  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  textWhite: {
    color: Colors.white,
  },

  headerArea: {
    paddingTop: 20,
    width: "100%",
    paddingHorizontal: 30,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
  },

  myProfileImage: {
    width: 30,
    height: 30,
  },
  chatContainer: {
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderColor: Colors.grey2,
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  chatProfileImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: "100%",
  },
  chatUserName: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    color: Colors.grey1,
  },
  chatLastMessage: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: Colors.grey2,
  },

  chatDetails1: {
    justifyContent: "flex-start",
    height: 55,
    width: 230,
  },
  chatDetails2: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 55,
    width: 80,
  },
  notificationCount: {
    width: 20,
    height: 20,
    backgroundColor: Colors.blue,
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationCountText: {
    color: Colors.white,
    fontFamily: "Poppins-Medium",
  },
});
