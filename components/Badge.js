import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { AntDesign} from '@expo/vector-icons';

const Badge = ({title,icon}) => {
  return (
    <View style={{backgroundColor: "#eee", borderRadius:20,paddingVertical:10, paddingHorizontal:15, flexDirection: "row", gap: 5 }}>
      <AntDesign name="laptop" size={14} color="black" />
      <Text style={{color: "#444"}}>{title}</Text>
    </View>
  )
}

export default Badge

const styles = StyleSheet.create({



})