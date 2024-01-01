import { Text, View, input, TextInput, StyleSheet} from 'react-native'
import { Input } from '@rneui/base';


export default function FormFields(props, index, update) {

    if(props.as === 'input'){
        return (
            <View style={styles.item_wrp} key={index}>
                <Text style={styles.item_label }> {props.label} </Text>
                <TextInput style={styles.input} placeholder={props.label} name={props.name} value={props.val} onChangeText={(e) => { update(index,e);}}/>
            </View>
        )
    }
    if(props.as === 'password'){
        return (
            <View style={styles.item_wrp} key={index}>
                <Text style={styles.item_label }> {props.label} </Text>
                <TextInput style={styles.input} placeholder={props.label} value={props.val} onChange={(e) => {update(index,e.nativeEvent.text)}}/>
            </View>
        )
    }


    if(props.as === 'email'){
        return (
            <View style={styles.item_wrp} key={index}>
                <Text style={styles.item_label }> {props.label} </Text>
                <TextInput style={styles.input} placeholder={props.label} value={props.val} onChangeText={text => update(index,text) }  />
            </View>
        )
    }
};





const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item_wrp: {
      paddingVertical: 5,
    },
    item_label:{
        fontSize: 18,
        paddingBottom: 3,
    },
    item_input: {
        fontSize: 18,
        borderWidth: 1,
        borderColor: "#CCC",
        paddingVertical: 3,
        
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

});