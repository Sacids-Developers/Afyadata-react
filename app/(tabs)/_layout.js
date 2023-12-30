import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
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
            },

            tabBarActiveTintColor: COLORS.tabBarActiveTintColor,
            tabBarInactiveTintColor: COLORS.tabBarInactiveTintColor,
        }}
        
    > 
        <Tabs.Screen name="updates" 
            options={{
                title: "Updates",
                tabBarIcon: ({ focused, color, size }) => (<Text style={{ fontSize: 16, color: color}}>Updates</Text>),
                title: '',
            }}>
        </Tabs.Screen>
        <Tabs.Screen name="tasks"
            options={{
                title: 'Tasks',
                tabBarIcon: ({ focused, color, size }) => (<Text style={{ fontSize: 16, color: color}}>Tasks</Text>),
                title: '',
            }}>
        </Tabs.Screen>
        <Tabs.Screen name="data"
            options={{
                title: 'Data',
                tabBarIcon: ({ focused, color, size }) => (<Text style={{ fontSize: 16, color: color }}>My Data</Text>),
                title: '',
            }}>

        </Tabs.Screen>

        <Tabs.Screen name="settings"
            options={{
                tabBarIcon: ({focused, color, size}) => (<Ionicons name="settings-outline" size={20} color={color} />),
                title: '',
            }}>

        </Tabs.Screen>
    </Tabs>
    );
  }