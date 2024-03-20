
import { Text, View, TextInput, Button, TouchableHighlight, StyleSheet, Pressable, SafeAreaView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useCallback, useMemo, useRef} from 'react'
import { useForm } from "react-hook-form";
import FormFields from '../../components/FormFields';
import { ScrollView } from 'react-native-gesture-handler';
import { Link, router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';

import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';

import { useLocalSearchParams, useNavigation } from 'expo-router'
import { PATH } from '../../constants/global';

import BottomSheet from '@gorhom/bottom-sheet';

import {COLORS} from "../../constants/colors"


const newForm = () => {

  const {form_fn, new_form} = useLocalSearchParams()

  const [mForm, setForm] = useState({pages: [{"fields": {}}]});
  const [formData, setFormData] = useState([])
  const [page, setPage]   = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formLang, setFormLang] = useState('')


    // Bottom Sheet
    //const bottomSheetRef = useRef();
    const bottomSheetRef = useRef(null);
    const finalized_bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);
    const handleBSOpenPress = () => {
      bottomSheetRef.current?.snapToIndex(0)
    }

  const navigation = useNavigation();

  function updateLanguage(lang){
    setFormLang(lang)
    bottomSheetRef.current?.close()
    console.log(formLang)
  }
  function update(index, newValue) {
    const nForm = {...mForm} // shallow copy

    // perform validation

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
    // update meta section of file
    const nForm = {...mForm} // shallow copy

    // check if uuid is set, if so, means its a draft form
    uid = nForm["meta"]["uuid"]
    nForm["meta"]["uuid"] = uid !== undefined ? uid : uuid;

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

    // perform validation on current page
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
    //console.log(file_path)
    
    FileSystem.readAsStringAsync(file_path).then(
      (xForm) =>{
        let tForm = JSON.parse(xForm)
        setForm(tForm)
        setTotalPages(tForm.pages.length)
        setFormLang('::English') //+tForm['meta']['default_language'])
      }
    ).catch(
      (e) => {console.log(e)}
    )
  }, []);


  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Fill New Forms ',
      headerRight: () => <Entypo name="dots-three-vertical" size={16} color={COLORS.fontColor} style={{paddingTop: 3}} onPress={() => handleBSOpenPress()} />, 
    });
  }, [navigation]);

  //setTotalPages(mForm.pages.length)
  //setFormLang('::')+mForm['meta']['default_language'])
  console.log(page,' - ',totalPages)
  console.log(formLang)

  let myFormData = []
  if(page < totalPages){
    myFormData.push(FormFields(mForm.pages[page],page,0,formLang))
    for (const key in mForm.pages[page].fields){
      console.log(key, formLang)
      myFormData.push(FormFields(mForm.pages[page].fields[key], key, update, formLang))
    }
  }

  

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
                <View style={{flexDirection: "row", backgroundColor: "#bde1f2", borderRadius: 10, padding: 15, fontSize: 16}}>
                  <MaterialCommunityIcons name="information-outline" size={24} color="black" />
                  <Text style={{paddingHorizontal: 10}}>Once the message is sent, you won't have the option to make edits. To make changes, "Save as Draft" until you're prepared to send it.</Text>
                </View>
              </View>
              <View style={{flexDirection: "row", marginTop: 30, justifyContent: "space-around" }}>
                <TouchableHighlight style={[styles.button]}>
                  <Button 
                    onPress={() => submitForm('draft')} 
                    title="Save as Draft" 
                    color="maroon" 
                  />
                </TouchableHighlight>
                <TouchableHighlight style={[styles.button, {backgroundColor: "maroon"}]} >
                  <Button
                    onPress={() => submitForm('Finalized')} 
                    title="Finalize Form" 
                    color="white" 
                  />
                </TouchableHighlight>
              </View>
            </View>
          </View>

        )
      }

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{backgroundColor: "#ddd"}}
        enablePanDownToClose={true}
      >
        <View style={styles.bs_wrp}>

          <Pressable onPress={() => updateLanguage("::English") } style={styles.bs_item_wrp} >
            <Text>English</Text> 
          </Pressable>

          <Pressable onPress={() => updateLanguage("::Swahili")} style={styles.bs_item_wrp} >
            <Text>Swahili</Text> 
          </Pressable>

          <Pressable onPress={() => bottomSheetRef.current?.close() } style={styles.bs_item_wrp} >
            <View style={{flexDirection: "row"}}>
              <MaterialCommunityIcons name="close-box-outline" size={26} color={COLORS.fontColor} />
              <Text style={[styles.bs_item_element, styles.bs_item_cancel]}>CLOSE</Text>
            </View>
          </Pressable>


        </View>
      </BottomSheet>
    </>
  )


}

export default newForm


const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  button: {
    borderWidth:1, 
    borderColor: "maroon", 
    paddingVertical: 3, 
    paddingHorizontal: 10, 
    borderRadius: 20,
    backgroundColor: "transparent",
  }

})