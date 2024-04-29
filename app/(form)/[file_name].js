import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


import { Stack, useLocalSearchParams,useGlobalSearchParams, useNavigation } from 'expo-router'

import {COLORS} from "../../constants/colors"
import { PATH } from '../../constants/global'
import InstanceData from '../(instance)/instanceData';
import InstanceChat from '../(instance)/instanceChat';

const manageForm = () => {
  
  const {file_name} = useLocalSearchParams()

  console.log("MANAGE FORM", file_name)

  const dataProps = {
    form_file_name: file_name
  };

  const Tab = createMaterialTopTabNavigator();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
      <Stack.Screen options={    
          {
            title: 'title',
            headerTintColor: COLORS.headerTextColor,
            headerStyle: {
              backgroundColor: COLORS.headerBgColor,
              fontWeight: "bold",
            },
            headerShown: true,   
          }
      } /> 
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12, color: COLORS.priColor },
          tabBarStyle: { backgroundColor: COLORS.backgroundColor },
          tabBarIndicatorStyle: { backgroundColor: "maroon" },
        }}
      >
        <Tab.Screen 
          name="Data" 
          component={InstanceData}
          initialParams={dataProps}
        />
        <Tab.Screen 
          name="Chat" 
          component={InstanceChat} 
          initialParams={dataProps}
        />
      </Tab.Navigator>
    </SafeAreaView>
  )
}

export default manageForm


const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  text: {
      fontSize: 20,
  },
});
