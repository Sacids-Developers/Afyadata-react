import { Tabs } from "expo-router";
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native'

import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from "react-native";

import {COLORS} from "../../constants/colors"

export default function Layout() {

    if(Platform.OS === 'android') NavigationBar.setBackgroundColorAsync(COLORS.backgroundColor);

    return (
    <Tabs
        screenOptions={{
            headerShown: false,

            tabBarStyle: {
                paddingTop: 8,
                borderColor: COLORS.borderColor,
                borderTopColor: COLORS.borderTopColor,
                backgroundColor: COLORS.borderColor,
                paddingHorizontal: 35,
            },

            tabBarActiveTintColor: COLORS.tabBarActiveTintColor,
            tabBarInactiveTintColor: COLORS.tabBarInactiveTintColor,
        }}
        
    > 
        <Tabs.Screen name="updates" 
            options={{
                title: "Inbox",
                tabBarIcon: ({ focused, color, size }) => (<Text style={{ fontSize: 18, color: color}}>Inbox</Text>),
                title: '',
            }}>
        </Tabs.Screen>
        <Tabs.Screen name="tasks"
            options={{
                title: 'Tasks',
                tabBarIcon: ({ focused, color, size }) => (<Text style={{ fontSize: 18, color: color}}>Tasks</Text>),
                title: '',
            }}>
        </Tabs.Screen>
        <Tabs.Screen name="data"
            options={{
                title: 'Data',
                tabBarIcon: ({ focused, color, size }) => (<Text style={{ fontSize: 18, color: color }}>Data</Text>),
                title: '',
            }}>

        </Tabs.Screen>

        <Tabs.Screen name="settings"
            options={{
                tabBarIcon: ({focused, color, size}) => (
                    <View style={{flexDirection: "row"}}>
                        <MaterialIcons name="menu" size={24} color="maroon" />
                    </View>),
                title: '',
            }}>

        </Tabs.Screen>

    </Tabs>
    );
  }