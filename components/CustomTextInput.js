import React, {useState} from 'react';
import { TextInput } from 'react-native';

export const CustomTextInput = (props) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <TextInput
            {...props}
            style={[props.style, isFocused && { borderWidth: 1, borderColor: '#781E14' }]}
            onBlur={() => setIsFocused(false)}
            onFocus={() => setIsFocused(true)}
            
        />
    );
};