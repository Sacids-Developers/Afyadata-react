import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';



const DataItem = ({ item, onPress, onLongPress, isSelected }) => (
  <TouchableOpacity
    onPress={onPress}
    onLongPress={onLongPress}
    style={[styles.item, isSelected && styles.selectedItem]}
  >
    <View style={{flexDirection: "row"}}>
      <View style={[styles.icon, isSelected && {backgroundColor: COLORS.primaryColor}]}>
        {isSelected ? <AntDesign name="check" size={24} color="white" /> :  <Text style={{fontSize: 18}}>{item.status[0].toUpperCase()}</Text>}
      </View>
      <View style={{paddingLeft: 0,}}>
        <Text style={{fontSize: 15,color: "black" }}>{item.title} </Text>
        <Text style={{fontSize: 12, color: "#aaa",}}>{item.uuid}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default DataItem

const styles = StyleSheet.create({


  item: {
    paddingVertical: 10,
    marginVertical: 2,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    borderBottomColor: COLORS.backgroundColor,
  },
  item_title: {
    fontSize: 20,
  },
  item_text: {
    fontSize: 12,
  },
  selectedItem: {
    backgroundColor: COLORS.secondaryColor,
    borderRadius: 10,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
    backgroundColor: COLORS.secondaryColor,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
  }

})