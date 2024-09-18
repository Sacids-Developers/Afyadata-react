
import { Text, View, TextInput, Button, TouchableHighlight, StyleSheet, Pressable, SafeAreaView, Platform } from 'react-native'
import React, { useEffect, useLayoutEffect, useState, useCallback, useMemo, useRef} from 'react'
import { useForm } from "react-hook-form";
import FormFields from '../../components/FormFields';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Link, Stack, router } from 'expo-router';
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign, Ionicons } from '@expo/vector-icons';

import { useLocalSearchParams, useNavigation } from 'expo-router'
import { PATH } from '../../constants/global';

import BottomSheet from '@gorhom/bottom-sheet';


import {COLORS} from "../../constants/colors"
import { replaceVariable, replaceFunctions, saveFormToFile, validate } from '../../services/utils';
import { StatusBar } from 'expo-status-bar';


const newForm = () => {

  const {form_fn, new_form} = useLocalSearchParams()
  //console.log(form_fn, new_form)

  const [mForm, setForm] = useState({pages: [{"fields": {}}]});
  const [instanceID, setInstanceID] = useState(0)
  const [formData, setFormData] = useState([])
  const [page, setPage]   = useState(0)
  const [repeatNo, setRepeatNo]   = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [formLang, setFormLang] = useState('')
  const [langOptions, setLangOptions] = useState([])


  // Bottom Sheet
  //const bottomSheetRef = useRef();
  const bottomSheetRef = useRef(null);
  const finalized_bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const handleSheetChanges = useCallback((index) => {
    //console.log('handleSheetChanges', index);
  }, []);
  const handleBSOpenPress = () => {
    bottomSheetRef.current?.snapToIndex(0)
  }

  const navigation = useNavigation();

  const updateLanguage = (selectedLang) => {
    bottomSheetRef.current?.close();
    setFormLang(selectedLang);
  };
  const updateField = (fieldIndex, newValue, columnName = 'val') => {
    const updatedForm = { ...mForm };
    //console.log('UPDATE FIELD',fieldIndex,newValue,columnName)
    updatedForm.pages[page].fields[repeatNo][fieldIndex][columnName] = newValue;
    setForm(updatedForm);
  };

  const updateMetaField = (columnName, newValue) => {
    const updatedForm = { ...mForm };
    updatedForm["meta"][columnName] = newValue;
    setForm(updatedForm);
  }

  const updatePageRelevance = (pageNumber, isRelevant) => {
    const updatedForm = { ...mForm };
    updatedForm.pages[pageNumber].is_relevant = isRelevant;
    setForm(updatedForm);
  };

  const setFormName = () => {

    // check if mform is set
    if (!mForm['meta']) {
      return "Untitled Form";
    }
    //console.log(mForm)
    const formName = replaceFunctions(replaceVariable(mForm["meta"]["instance_name"], "", getSetFields(totalPages - 1)));
    updateMetaField("title", formName)
    
  }


  const submitForm = (status) => {

    const nForm = {...mForm} // shallow copy

    // check if uuid is set, if so, means its a draft form
   
    //const instanceName = nForm["meta"]["instance_name"];
    //if (instanceName !== null) { 
    //  const formName = replaceFunctions(replaceVariable(instanceName, "", getSetFields(totalPages - 1)));
    //  nForm["meta"]["title"]  = formName
    //}
    
    nForm["meta"]["status"] = status; // update index
    nForm["meta"]["updated_on"] = new Date().toISOString();
    if(status = 'Finalized'){
      nForm["meta"]["end_time"] = new Date().getTime()
    }
    setForm(nForm); // set new json

    //console.log(nForm)
    // save to file
    saveFormToFile(instanceID,JSON.stringify(nForm))
    alert('success')
    // wait 1 second
    router.back()

  }



  const saveForm = () => {

    const nForm = {...mForm} // shallow copy

    nForm["meta"]["status"] = 'Draft'; // update index
    nForm["meta"]["updated_on"] = new Date().toISOString();
    setForm(nForm); // set new json
    saveFormToFile(instanceID,JSON.stringify(nForm))

  }


const verifyPage = (currentPageFields) => {
  isValid = true
  //console.log('current page fields',repeatNo, currentPageFields)
  for (const fieldKey in currentPageFields) {
    //console.log('fieldkye',fieldKey)
    if (!isFieldRelevant(page, fieldKey)) continue;
    if (fieldKey,'fieldkey',currentPageFields[fieldKey]['type'] == 'date') continue;

    const constraint = currentPageFields[fieldKey]['constraint'];
    const isRequired = currentPageFields[fieldKey]['required'];

    const fieldValue = currentPageFields[fieldKey]['val'];
    //console.log('FIELD FAVA',fieldKey,fieldValue)

    if(isRequired != null && isRequired.toLowerCase() === 'yes'){

      if (fieldValue == null || fieldValue === '') {
        //console.log('IS REQUIRED',fieldKey,fieldValue)
        isValid = false;
        updateField(fieldKey, true, 'error');
        continue
      }else{
        updateField(fieldKey, false, 'error');
      }
    }
    
    if (!(constraint === null || constraint === '')){
      //console.log('IS CONSTRAINT',fieldKey,fieldValue, constraint)
      const isFieldValid = validate(constraint, fieldKey, currentPageFields);
      updateField(fieldKey, !isFieldValid, 'error');
      isValid = isFieldValid && isValid;
    }
  } 

  return isValid
}
const addAnotherPage = () => {
  
  let isValid = true;
  const currentPageFields = mForm.pages[page].fields[repeatNo];

  isValid = verifyPage(currentPageFields);

  if (isValid) {
    // shallow copy current page
    const newPageFields = {...currentPageFields};

    console.log('before',JSON.stringify(newPageFields, null, 4))
    // empty value fields in current page
    for(const fieldKey in newPageFields){
      newPageFields[fieldKey]['val'] = ''
    }
    console.log('after',JSON.stringify(newPageFields, null, 4))

    // add new page
    const updatedForm = { ...mForm };
    updatedForm.pages[page]['fields'].push(newPageFields);
    setRepeatNo((prev) => prev + 1);
    setForm(updatedForm);
  
  }
}
const goToNextPage = (event) => {
  let isValid = true;
  const currentPageFields = mForm.pages[page].fields[repeatNo];

  isValid = verifyPage(currentPageFields);

  if (isValid) {
    for (let nextPageNum = page + 1; nextPageNum <= totalPages; nextPageNum++) {

      // update the form Name
      setFormName();
      if(nextPageNum == totalPages){
        setPage(nextPageNum);
        break;
      }

      if (isPageRelevant(nextPageNum)) {
        setPage(nextPageNum);
        break;
      }
    }
  }
};

  const goToPreviousPage = () => {
    let previousPageNumber = page - 1;
    while (previousPageNumber >= 0) {


      if (isPageRelevant(previousPageNumber)) {
        setPage(previousPageNumber);
        break;
      }
      previousPageNumber--;
    }
  }

  const isPageRelevant = (pageNumber) => {
    const relevantExpression = mForm.pages[pageNumber].relevant;
    //console.log('IS PAGE RELEVANT',relevantExpression,pageNumber,JSON.stringify(mForm.pages[pageNumber],null,4))
    if (relevantExpression === null || relevantExpression === '' || relevantExpression === undefined) {
      //updatePageRelevance(pageNumber, true);
      return true;
    }
    const isPageRelevantBasedOnFields = validate(relevantExpression, "", getSetFields(pageNumber));
    //updatePageRelevance(pageNumber, !isPageRelevantBasedOnFields);
    return isPageRelevantBasedOnFields;
  };

  const isPageRepeat = (pageNumber) => {
    return mForm.pages[pageNumber].repeat;
  }



  const updateFieldRelevance = (pageNumber, fieldName) => {
    const { fields } = mForm.pages[pageNumber];
    const fieldRelevance = fields[fieldName]?.relevant;


    if (fieldRelevance !== false) {
      updateField(fieldName, true, 'is_relevant');
      return;
    }

    const isFieldRelevant = validate(fieldRelevance, fieldName, getSetFields(pageNumber));
    updateField(fieldName, isFieldRelevant, 'is_relevant');
  };

const isFieldRelevant = (pageNumber, fieldName) => {

  
  const { fields } = mForm.pages[pageNumber];
  
  //console.log('kasa',fields[repeatNo],fieldName)
  if(fields[repeatNo][fieldName].type == 'date') return true;

  const fieldRelevance = fields[repeatNo][fieldName].relevant;

  if (fieldRelevance === null || fieldRelevance === '' || fieldRelevance === undefined) {
    return true;
  }
  //console.log('is field relevant func ', fieldName, fieldRelevance)
  return validate(fieldRelevance, fieldName, getSetFields(pageNumber));

};



  const getSetFields = (currentPage) => {
    fields  = {}
    for(i = 0; i <= currentPage; i++){
      const numbers = Object.keys(mForm.pages[i].fields);
      numbers.forEach(number => {
        for (let key in mForm.pages[i].fields[number]) {
          fields[key] = mForm.pages[i].fields[number][key];
        }
      });
    }
    //console.log(fields)
    return fields
  }

const renderPageLinks = () => {
  
  const prevButton = page > 0 ? (
    <MaterialIcons name="navigate-before" size={36} color={COLORS.fontColor} onPress={goToPreviousPage}
    />
  ) : (
    <View style={{width: 36,}}/>
  );

  const nextButton = page < totalPages ? (
    <MaterialIcons name="navigate-next" size={36} color={COLORS.fontColor} onPress={goToNextPage} />
  ) : (
    <View />
  );

  return (
    <View style={styles.page_links}>
      {prevButton}
      {nextButton}
    </View>
  );
};

const HeaderRightActions = () => {
  return (
    <View style={{flexDirection: 'row', gap: 15}}>
      <AntDesign name="save" size={26} color="black"  style={{paddingTop: 2}} onPress={() => saveForm()} />
      <Entypo name="dots-three-vertical" size={22} color="black" style={{paddingTop: 2}} onPress={() => handleBSOpenPress()} />
    </View>
  )
}

const AddAnotherPageButton = (title) => {
  return (
      <TouchableOpacity style={styles.AddAnotherPageButton} onPress={() => addAnotherPage()} key={page.toString()+repeatNo.toString()}> 
        <Entypo name="add-to-list" size={24} color="black" />
        <Text>Add Another {title} </Text>
      </TouchableOpacity>
  )
}
  useEffect(() => {
    
    const file_path = ( new_form === "1" ? PATH.form_defn+form_fn : PATH.form_data+form_fn );
    //console.log(file_path)
    
    FileSystem.readAsStringAsync(file_path).then(
      (xForm) =>{
        let tForm = JSON.parse(xForm)

        // if new form create uuid and set it as meta.uuid
        if(new_form === "1"){    
          tForm['meta']['uuid'] = Crypto.randomUUID();
          tForm['meta']['start_time'] = new Date().getTime();
        }

        setInstanceID(tForm['meta']['uuid'])
        setForm(tForm)
        setTotalPages(tForm.pages.length)
        if (tForm['languages'].includes(tForm['meta']['default_language'])){
          setFormLang('::'+tForm['meta']['default_language'])
        }else{
          setFormLang('::Default')
        }
        setLangOptions(tForm['languages'])
      }
    ).catch(
      (e) => {console.log(e)}
    )
  }, []);


  let myFormData = []
  if(page < totalPages){

    if(isPageRelevant(page)){
      //console.log('is page relevant')
      myFormData.push(FormFields(mForm.pages[page],page,0,formLang))
      for (const key in mForm.pages[page].fields[repeatNo]){ 
        // check relevance
        //console.log('field relevant',key)
        if(isFieldRelevant(page, key)){
          myFormData.push(FormFields(mForm.pages[page].fields[repeatNo][key], key, updateField, formLang)) 
        }
      }

      if(isPageRepeat(page)){
        myFormData.push(AddAnotherPageButton(mForm.pages[page].label))
      }
    }
  }

  let languageBSChoice = [] 
  for(const k in langOptions){
    languageBSChoice.push(
      <Pressable onPress={() => updateLanguage("::"+langOptions[k] ) } style={styles.bs_item_wrp} key={k} >
        <Text>{langOptions[k]}</Text> 
      </Pressable>
    )
  }
  

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      
        <SafeAreaView style={styles.AndroidSafeArea}>
          <Stack.Screen options={
            {
              title: 'Fill Form',
              headerTintColor: "black",
              headerStyle: {
                backgroundColor: COLORS.slate,
              },
              headerRight: () => HeaderRightActions(),
            }
          } />
          { 
            page < totalPages ? ( 

              <View style={{flex: 1}}>
                <ScrollView style={{flex: 1, paddingHorizontal: 10, backgroundColor: "white", }}>
                  {myFormData}
                </ScrollView>
                <View style={{backgroundColor: "white"}}>
                  {renderPageLinks()}
                </View>
              </View>
            ):(
              <View style={{flex: 1}}>
                <View style={{flex: 1, padding: 10, backgroundColor: "white", justifyContent: 'center', paddingVertical:20,}}>

                  <View style={{}}>
                    <Text style={{fontWeight: "bold", fontSize: 20, paddingBottom: 20}}>
                      You are at the end of 
                    </Text>
                    <TextInput
                      multiline={false}
                      style={styles.input}
                      value={ mForm['meta'] == undefined ? "Untitled Form" : mForm['meta']['title']}
                      onChangeText={(e) => { updateMetaField('title', e); }}
                    />
                    <View style={{flexDirection: "row", backgroundColor: "#bde1f2", borderRadius: 10, padding: 15, fontSize: 16}}>
                      <MaterialCommunityIcons name="information-outline" size={24} color="black" />
                      <Text style={{paddingHorizontal: 10}}>Once the message is sent, you won't have the option to make edits. To make changes, "Save as Draft" until you're prepared to send it.</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: "row", marginTop: 30, justifyContent: "space-around" }}>
                    <Pressable onPress={() => submitForm('draft')} style={[styles.button, {backgroundColor: "white"}]} >
                      <Text style={{color: "black", fontSize: 18 }}>Save as Draft</Text> 
                    </Pressable>
                    <Pressable onPress={() => submitForm('Finalized')} style={[styles.button, {backgroundColor: "maroon"}]} >
                      <Text style={{color: "white", fontSize: 18 }}>Finalize Form</Text> 
                    </Pressable>
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
              
              {languageBSChoice}

              <Pressable onPress={() => bottomSheetRef.current?.close() } style={styles.bs_item_wrp} >
                <View style={{flexDirection: "row"}}>
                  <MaterialCommunityIcons name="close-box-outline" size={26} color={COLORS.fontColor} />
                  <Text style={[styles.bs_item_element, styles.bs_item_cancel]}>CLOSE</Text>
                </View>
              </Pressable>


            </View>
          </BottomSheet>
        </SafeAreaView>
      
    </GestureHandlerRootView>
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
    paddingVertical: 12, 
    paddingHorizontal: 20, 
    borderRadius: 20,
    backgroundColor: "transparent",
  },

  input: {
    height: 40,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    padding: 10, 
    borderRadius: 5,
    backgroundColor: 'transparent',
  },

  bs_item_wrp:{
    paddingVertical: 11,
    paddingHorizontal:15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  bs_item_element: {
    paddingHorizontal:15,
    color: "#333",
    fontSize: 18,
  },

  bs_item_cancel: {
    color: COLORS.fontColor,
  },

  bs_wrp:{
    flex: 1, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20, 
    paddingTop:20,
  },

  page_links: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopColor: COLORS.headerBgColor,
    borderTopWidth: 1,
  },

  
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },

  AddAnotherPageButton: {
    marginTop: 10, 
    borderColor: 'black', 
    borderWidth: 1, 
    padding: 10, 
    borderRadius: 5, 
    flexDirection: 'row', 
    gap: 15, 
    alignItems: 'center', 
    alignSelf: 'start'
  },


})