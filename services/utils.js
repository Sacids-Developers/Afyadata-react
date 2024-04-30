var Parser = require('expr-eval').Parser;
var parser = new Parser();

import * as FileSystem from 'expo-file-system';
import { PATH } from '../constants/global';

//let str = '.  >= today()'
//let str = "if(${name} > 10.51, . < 18.39) and (string-length(.) > 5 or date('2015-08-01') > today())"

function processVariable(variable, key, fields) {

	//console.log('PROCESS VARIABLE',variable, key, JSON.stringify(fields,null,4))
    if(variable === '.'){
		//console.log(fields[key]['val'])
		return fields[key]['val'] ? fields[key]['val'] : false
	}else{
		return fields[variable]['val'] ? fields[variable]['val'] : false
	}
}


function processFunction(str, func){
	
	args = str.substring(func.length+1, str.length-1)
	//console.log('PROCESS FUNCTION',func, args)

	switch(func){
		case 'regex':
			tokens = args.split(',')
			// get value of tokens[0] is 
			break;
		case 'selected':
			return compareStrings(args)
			break;
		case 'date':
			return args
			break;
		case 'today':
			return "'"+getTodaysDateAsString()+"'"

		case 'count-selected':
			break;

		case 'concat':
			return concatStrings(args)

		case 'string-length':
			// check if its an available field
			// check if args is null
			if(args === undefined || args === null){
				return 0
			}
			return args.length
		
	}

}

function concatStrings(input) {
  const parts = input.split(',').map(part => part.trim().replace(/^"|"$|^'|'$/g, ''));
  return parts.join('');
}
function compareStrings(input){
	const parts = input.split(',').map(part => part.trim().replace(/^"|"$|^'|'$/g, ''));
	// get last element of array
	const ele = parts.pop()
	const ava = parts.includes(ele)
	return ava


}

function getTodaysDateAsString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function replaceVariable(input, key, fields) {

    const pattern = /\$\{(\w+)\}|(?<!\d)[.]/g;
    const output = input.replace(pattern, (match, variable) => {
        // If match is a variable, process it; otherwise, return the match as is
		if(variable == undefined ) variable = "."
        return variable ? processVariable(variable, key, fields) : '.';
    });

    return output;
}


export function replaceFunctions(input) {

	//console.log('REPLACE FUNCTION: ',input)
	const pattern = /(selected|date|today|count-selected|string-length|regex|concat)\((.*?)\)/g;
    const output = input.replace(pattern, (match, variable) => {
		//console.log('patern :', match, variable)
        return variable ? processFunction(match, variable) : variable;
    });

    return output;
}


export function validate(str, key = "", fields = {}){

	if (typeof str !== 'string') {
		const result = Boolean(str)
		//console.log('not string',result)
		return result
	}

    const processedString = replaceVariable(str, key, fields);
    console.log("replace variable",processedString); // Output: This is a VARIABLE example
    
    const expression	= replaceFunctions(processedString)
    console.log("replace function",expression)
    
    const result = parser.evaluate(expression);
    console.log('validate result',result)
    return result
}

export const saveFormToFile = async (formId, formData) => {
	try {
	  await FileSystem.writeAsStringAsync(PATH.form_data + formId, formData, {
		encoding: FileSystem.EncodingType.UTF8,
	  });
	} catch (error) {
	  console.error('Error saving form:', error);
	}
  };