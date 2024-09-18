import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

import moment from 'moment';


const DataItem = ({ item, onPress, onLongPress, isSelected }) => (

  <TouchableOpacity
    onPress={onPress}
    onLongPress={onLongPress}
    style={[styles.item, isSelected && styles.selectedItem]}
  >
    <View style={{flexDirection: "row",alignItems: "center"}}>
      <View style={[styles.icon, isSelected && {backgroundColor: COLORS.primaryColor}]}>
        {isSelected ? <AntDesign name="check" size={24} color="white" /> :  <Text style={{fontSize: 18, color: "white"}}>{item.status[0].toUpperCase()}</Text>}
      </View>
      <View style={{paddingLeft: 0, flexDirection: "column",gap:2}}>
        <Text style={{fontSize: 17,color: "#000", fontWeight: "500" }}>{item.title} </Text>
        <Text style={{fontSize: 15, color: "#999",}}>Last Update: { item.updated_on == undefined ? 'N/A' : moment(item.updated_on).format('Do MMMM YY, H:mm')}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default DataItem

const styles = StyleSheet.create({


  item: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomColor: COLORS.backgroundColor,
  },
  item_title: {
    fontSize: 16,
  },
  item_text: {
    fontSize: 12,
  },
  selectedItem: {
    backgroundColor: COLORS.secondaryColor,
    borderRadius: 0,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    color:"white",
    backgroundColor: "#999",
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  }

})