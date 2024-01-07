
import { Text, View, TextInput, Button } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import FormFields from '../../components/FormFields';
import { ScrollView } from 'react-native-gesture-handler';
import { Link, router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useLocalSearchParams, useNavigation } from 'expo-router'
import { PATH } from '../../constants/global';



const newForm = () => {

  const {form_fn, new_form} = useLocalSearchParams()

  const [mForm, setForm] = useState({pages: [{"fields": {}}]});
  const [formData, setFormData] = useState([])
  const [page, setPage]   = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const navigation = useNavigation();
  
  function update(index, newValue) {
    const nForm = {...mForm} // shallow copy
    nForm["pages"][page]['fields'][index]["val"] = newValue; // update index
    setForm(nForm); // set new json
  }

  
  
  
  const saveFormToFile = async (uid, filled_form) => {
    
    try {
      await FileSystem.writeAsStringAsync(PATH.form_data+uid, filled_form);
      console.log('String saved as file successfully.');
    } catch (error) {
      console.error('Error saving string as file:', error);
    }

  };

  const submitForm = (status) => {
    //event.preventDefault();
    //console.log(JSON.stringify(mForm))

    uuid =  Crypto.randomUUID();
    console.log(uuid)
    
    // update meta section of file
    const nForm = {...mForm} // shallow copy

    // check if uuid is set, if so, means its a draft form
    uid = nForm["meta"]["uuid"]
    nForm["meta"]["uuid"] = uid.length > 5 ? uid : uuid;

    //nForm["meta"]["uuid"] = uuid; // update index
    nForm["meta"]["status"] = status; // update index
    setForm(nForm); // set new json

    console.log(nForm)
    // save to file
    saveFormToFile(uuid,JSON.stringify(nForm))
    alert('success')
    // wait 1 second
    router.back()

  }

  const nextPage = (event) => { 
    event.preventDefault();
    setPage(page+1)
  }
  const prevPage = (event) => {
    event.preventDefault();
    setPage(page-1)
  }
  const pageLinks = () => {

    let prev = <View></View>;
    let next = <View></View>;
    if( page < totalPages ){
      next = <Button onPress={nextPage} title="Next Page" color="#841584" />
    }
    if( page > 0 ){
      prev = <Button onPress={prevPage} title="Prev Page" color="#841584" />
    }

    return (
      <View style={{flexDirection:"row",justifyContent:"space-between",borderTopColor: "#ccc", borderWidth: 1,}}>
        {prev}
        {next}
      </View>
    )
  }

  useEffect(() => {
    
    const file_path = ( new_form === "1" ? PATH.form_defn+form_fn : PATH.form_data+form_fn );
    console.log(file_path)
    
    FileSystem.readAsStringAsync(file_path).then(
      (xForm) =>{
        let tForm = JSON.parse(xForm)
        setForm(tForm)
        setTotalPages(tForm.pages.length)
      }
    ).catch(
      (e) => {console.log(e)}
    )
  }, []);

  //useEffect(() => {
      // action on update of page
      console.log(page,' - ',totalPages)

      let myFormData = []
      if(page < totalPages){
        myFormData.push(FormFields(mForm.pages[page],page,0))
        for (const key in mForm.pages[page].fields){
          myFormData.push(FormFields(mForm.pages[page].fields[key], key, update))
        }
        //setFormData(myFormData)
      }
  //}, [page]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Fill New Forms ',
    });
  }, [navigation]);

  return (
    <>
      { 
        page < totalPages ? ( 
          <View style={{flex: 1}}>
            <ScrollView style={{flex: 1, padding: 10, backgroundColor: "white", }}>
              {myFormData}
            </ScrollView>
            <View style={{backgroundColor: "white"}}>
              {pageLinks()}
            </View>
          </View>
        ):(
          <View style={{flex: 1}}>
            <View style={{flex: 1, padding: 10, backgroundColor: "white", justifyContent: 'center', paddingVertical:20,}}>

              <View style={{}}>
                <Text style={{fontWeight: "bold", fontSize: 20, paddingBottom: 20}}>
                  You are at the end of 
                </Text>
                <View style={{flexDirection: "row", backgroundColor: "#bde1f2", borderRadius: 20, padding: 20, fontSize: 16}}>
                  <MaterialCommunityIcons name="information-outline" size={24} color="black" />
                  <Text style={{paddingLeft: 10}}>Once the message is sent, you won't have the option to make edits. To make changes, "Save as Draft" until you're prepared to send it.</Text>
                </View>
              </View>
              <View style={{flexDirection: "row", marginTop: 30, justifyContent: "space-around" }}>
                <Button 
                  style={{borderWidth:1, borderColor: "maroon", paddingVertical: 3, paddingHorizontal: 10, borderRadius: 20}}
                  onPress={() => submitForm('draft')} 
                  title="Save Draft" 
                  color="#841584" 
                />
                <Button onPress={() => submitForm('Finalized')} title="Finalize" color="#841584" />
              </View>
            </View>
          </View>

        )
      }
    </>
  )
}

export default newForm


