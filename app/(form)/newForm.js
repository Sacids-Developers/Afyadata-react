
import { Text, View, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import FormFields from '../../components/FormFields';
import { ScrollView } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';


import { useLocalSearchParams, useNavigation } from 'expo-router'
import { PATH } from '../../constants/global';



const newForm = () => {

  const myForm = require('../../assets/forms/defn/test_1.json');
  const {form_fn} = useLocalSearchParams()

  const [mForm, setForm] = useState({fields: [{}]});
  const [page, setPage]   = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  
  function update(index, newValue) {
    const nForm = {...mForm} // shallow copy
    nForm["fields"][page][index]["val"] = newValue; // update index
    setForm(nForm); // set new json
  }

  let myFormData = []
  for (const key in mForm.fields[page]){
    myFormData.push(FormFields(mForm.fields[page][key],key, update))
  }
  
  const saveFormToFile = async (uid, filled_form) => {
    
    try {
      await FileSystem.writeAsStringAsync(PATH.file_data, filled_form);
      console.log('String saved as file successfully.');
    } catch (error) {
      console.error('Error saving string as file:', error);
    }

  };

  const showSubmit = (event) => {
    event.preventDefault();
    //console.log(JSON.stringify(mForm))

    uuid =  Crypto.randomUUID();
    
    // update meta section of file
    const nForm = {...mForm} // shallow copy
    nForm["meta"]["uuid"] = uuid; // update index
    setForm(nForm); // set new json

    //console.log(mForm)
    // save to file
    saveFormToFile(uuid,JSON.stringify(nForm))

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
    if( page <= totalPages ){
      next = <Button onPress={nextPage} title="Next Page" color="#841584" />
    }
    if( page > 0 ){
      prev = <Button onPress={prevPage} title="Prev Page" color="#841584" />
    }

    return (
      <View style={{flexDirection:"row",justifyContent:"space-between"}}>
        {prev}
        {next}
      </View>
    )
  }

  useEffect(() => {
    FileSystem.readAsStringAsync(PATH.form_defn+form_fn).then(
      (xForm) =>{
        let tForm = JSON.parse(xForm)
        setForm(tForm)
        setTotalPages(tForm.fields.length)
      }
    ).catch(
      (e) => {console.log(e)}
    )
  }, []);

  return (
      <ScrollView style={{flex: 1, padding: 10,}}>

        { 
          page < totalPages ? ( 
              <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                  {myFormData}
                </View>
                {pageLinks()}
              </View>
          ):(

            <Button
              onPress={showSubmit}
              title="Submit"
              color="#841584"
            />

          )
        }
      </ScrollView>
  )
}

export default newForm


