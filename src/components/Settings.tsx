import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { IProp } from "../standards/interfaces";
import { Header } from "../components/header";

const SettingsScreen = (props: IProp) => {
  const navigation = props.navigation;
  return (
    <View style={{ flex: 1 }}>
      <Header {...props} />
      <TouchableOpacity
        style={{ padding: 15, borderRadius: 10, backgroundColor: "#ebebeb", margin: 5 }}
        onPress={() => {
          //navigation.navigate("HealthHub");
        }}
      >
        <Text>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
