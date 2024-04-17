import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import * as FileSystem from 'expo-file-system';
import MapView from 'react-native-maps';


import {COLORS} from "../../constants/colors"
import { PATH } from '../../constants/global'

const InstanceData = ({ route }) => {


  const [mForm, setForm] = useState({pages: [{"fields": {}}]});
  const [instanceID, setInstanceID] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formLang, setFormLang] = useState('English')

  const { form_file_name } = route.params;

    const renderFormFields = (field) => {
        if(field.type === 'group'){
            return (
                <View style={styles.group_wrapper} key={field['name']}>
                    <Text style={styles.group_label}>{field['label::'+formLang]}</Text>
                </View>
            )
        }else if(field.type === 'image'){
            return (
              <View style={styles.item_wrapper} key={field['name']}>
                <Text style={styles.item_label}>{field['label::'+formLang]}</Text>
                <Image 
                  source={{uri: field['val']['uri']}} 
                  style={styles.image}
                />
              </View>
            )
        }
        else if(field.type === 'geopoint'){
            return  (
              <View style={styles.item_wrapper} key={field['name']}>
                <Text style={styles.item_label}>{field['label::'+formLang]}</Text>
                <MapView
                  style={{width: "100%", height: 180}}
                  initialRegion={{
                    latitude: -6.835305, 
                    longitude: 37.646935,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                </MapView>
              </View>
            )
        }
        else{
            return (
                <View style={styles.item_wrapper} key={field['name']}>
                    <Text style={styles.item_label}>{field['label::'+formLang]}</Text>
                    <Text style={styles.item_value}>{field['val']}</Text>
                </View>
            )
        }

    }
    useEffect(() => {

        const file_path = PATH.form_data+form_file_name;
        FileSystem.readAsStringAsync(file_path).then(
            (xForm) =>{
            let tForm = JSON.parse(xForm)
            setInstanceID(tForm['meta']['uuid'])
            setForm(tForm)
            setTotalPages(tForm.pages.length)
            }
        ).catch(
            (e) => {console.log(e)}
        )
    }, []);


    let myFormData = []

    for(let i = 0; i < totalPages; i++){

        myFormData.push(renderFormFields(mForm.pages[i]))
        for (const key in mForm.pages[i].fields){
            myFormData.push(renderFormFields(mForm.pages[i].fields[key]))
        }
    }

  return (
    <ScrollView style={styles.container}>
      {myFormData}
    </ScrollView>
  )
}

export default InstanceData

const styles = StyleSheet.create({

    container:{
        paddingHorizontal: 15,
    },
  group_wrapper: {
    paddingVertical: 5,
    marginVertical: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  group_label: {
    fontSize: 14,
    color: COLORS.primaryColor,
  },
  item_wrapper:{
    marginVertical: 5,
  },    
  item_label: {
    fontSize: 14,
  },

  item_value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  
  image: {
    width: Dimensions.get('window').width, // Set the width to 80% of the screen width
    aspectRatio: 1, // Maintain the aspect ratio of the image
  },
})