import { Tabs } from "expo-router";
import { Entypo, MaterialIcons,MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
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
                borderColor: COLORS.borderColor,
                borderTopColor: COLORS.borderTopColor,
                backgroundColor: COLORS.tabBackgroundColor,
                height: 65,
                paddingTop: 10,
                
            },
            tabBarLabelStyle: {
                fontSize: 13,
                marginBottom: 8,
            },
            padding: 15,

            tabBarActiveTintColor: COLORS.tabBarActiveTintColor,
            tabBarInactiveTintColor: COLORS.tabBarInactiveTintColor,
        }}
        
    > 
        <Tabs.Screen name="updates" 
            options={{
                title: "Inbox",
                tabBarIcon: ({ focused, color, size }) => (<MaterialCommunityIcons name="message-settings-outline" size={24} color={color} />),
                title: 'Inbox',
            }}>
        </Tabs.Screen>
        <Tabs.Screen name="tasks"
            options={{
                title: 'Tasks',
                tabBarIcon: ({ focused, color, size }) => (<FontAwesome5 name="tasks"  size={24} color={color} />),
                title: 'Tasks',
            }}>
        </Tabs.Screen>
        <Tabs.Screen name="data"
            options={{
                title: 'Data',
                tabBarIcon: ({ focused, color, size }) => (<AntDesign name="database"  size={24} color={color} />),
                title: 'Data',
            }}>

        </Tabs.Screen>

        <Tabs.Screen name="settings"
            options={{
                tabBarIcon: ({focused, color, size}) => (<MaterialCommunityIcons name="view-day-outline" size={24} color={color} />),
                title: 'More',
            }}>

        </Tabs.Screen>

    </Tabs>
    );
  }