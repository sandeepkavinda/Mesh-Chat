import { registerRootComponent } from "expo";
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
import { Colors } from "./colors";
import { Image } from "expo-image";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

const backIcon = require("../assets/images/back.png");
const mainLogoPath = require("../assets/images/logo_with_name.png");
const defaultProfileImage = require("../assets/images/defalut_profile_image.png");

SplashScreen.preventAutoHideAsync();

export default function Chat() {
  let parameters = useLocalSearchParams();

  const [getChatText, setChatText] = useState("");
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
    async function loadChats() {
      try {
        let userJson = await AsyncStorage.getItem("user");
        let user = JSON.parse(userJson);

        let response = await fetch(
          "http://192.168.207.254:8080/Mesh_Chat/LoadChat?user_id=" +
            user.id +
            "&&other_user_id=" +
            parameters.other_user_id
        );

        if (response.ok) {
          let json = await response.json();
          setChatArray(json);
        }
      } catch (error) {
        console.log(error);
      }
    }

    loadChats();
    
    setInterval(() => {
        loadChats();
    }, 1000);

  }, []



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
      <View style={stylesheet.headerArea}>
        <Pressable
          onPress={() => {
            router.push("/Home");
          }}
          style={{ backgroundColor: "" }}
        >
          <Image
            source={backIcon}
            style={stylesheet.backIcon}
            contentFit="contain"
          />
        </Pressable>

        <Image
          source={defaultProfileImage}
          style={stylesheet.myProfileImage}
          contentFit="contain"
        />

        <View style={stylesheet.headerNameArea}>
          <Text style={stylesheet.headerUserName}>
            {parameters.other_user_name}
          </Text>
          <Text style={stylesheet.headerUserStatus}>
            {parameters.other_user_status == 1 ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={stylesheet.scrollContainer}>
        <View style={stylesheet.chatArea}>
          <FlashList
            data={getChatArray}
            renderItem={({ item }) => (
              <View
                style={
                  item.side == "right"
                    ? stylesheet.chatSend
                    : stylesheet.chatReceived
                }
              >
                <Text style={stylesheet.message}>{item.message}</Text>
                <Text style={stylesheet.dateTime}>
                  {item.datetime}
                  <Text> </Text>

                  {item.side == "right" ? (
                    <FontAwesome6
                      name="check-double"
                      color={item.status == "1" ? Colors.blue : Colors.grey1}
                    />
                  ) : null}
                </Text>
              </View>
            )}
            estimatedItemSize={200}
          />
        </View>
      </ScrollView>

      <View style={stylesheet.chatInputArea}>
        <TextInput
          value={getChatText}
          style={stylesheet.chatInput}
          placeholder="Type Your Message Here"
          onChangeText={(text) => {
            setChatText(text);
          }}
        />
        <Pressable
          style={stylesheet.chatSendButton}
          onPress={
            
            async() => {
            
                try {
                    if(getChatText.length == 0){
                        Alert.alert("Warning","Message Is Empty");
                     }else{
                        let userJson = await AsyncStorage.getItem("user");
                        let user = JSON.parse(userJson);
    
                        let response = await fetch(
                          "http://192.168.207.254:8080/Mesh_Chat/SendMessage?log_user_id=" +user.id +"&other_user_id=" +parameters.other_user_id +"&message=" +getChatText
                        );
          
                        if (response.ok) {
                            let json = response.json();
                            console.log("Message Sent");
                            setChatText("");
                        }

                     }

                    
                } catch (error) {
                    console.log(error);
                }

          }}
        >
          <FontAwesome6
            name="location-arrow"
            style={stylesheet.chatSendButtonIcon}
          />
        </Pressable>
      </View>
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

  headerArea: {
    paddingTop: 20,
    width: "100%",
    paddingHorizontal: 30,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: Colors.grey2,
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  backIcon: {
    width: 20,
    height: 20,
    marginRight: 20,
  },

  myProfileImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },

  headerNameArea: {},
  headerUserName: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20,
    color: Colors.grey1,
  },
  headerUserStatus: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: Colors.grey1,
  },
  chatArea: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },

  chatSend: {
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "flex-end",
    alignSelf: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  chatReceived: {
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },

  message: {
    fontFamily: "Poppins-Medium",
    fontSize: 18,
    color: Colors.black,
  },
  dateTime: {
    fontFamily: "Poppins-Light",
    fontSize: 12,
    color: Colors.black,
  },

  chatInputArea: {
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  chatInput: {
    fontFamily: "Poppins-Regular",
    borderColor: Colors.white,
    borderStyle: "solid",
    borderWidth: 1,
    width: "85%",
    height: 50,
    fontSize: 18,
    paddingLeft: 10,
    borderRadius: 5,
    color: Colors.grey1,
    marginBottom: 10,
  },
  chatSendButton: {
    width: 50,
    height: 50,
    backgroundColor: Colors.blue,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  chatSendButtonIcon: {
    fontSize: 24,
    color: Colors.white,
  },
});
