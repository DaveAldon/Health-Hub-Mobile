import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { IProp } from "../standards/interfaces";

const LoginScreen = (props: IProp) => {
  const navigation = props.navigation;
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ padding: 15, borderRadius: 10, backgroundColor: "#ebebeb", margin: 5 }}
        onPress={() => {
          navigation.navigate("HealthHub");
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
