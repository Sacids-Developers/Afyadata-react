var Parser = require('expr-eval').Parser;
var parser = new Parser();

import * as FileSystem from 'expo-file-system';
import { PATH } from '../constants/global';
import moment from 'moment';

//let str = '.  >= today()'
//let str = "if(${name} > 10.51, . < 18.39) and (string-length(.) > 5 or date('2015-08-01') > today())"

function processVariable(variable, key, fields) {

	//console.log('PROCESS VARIABLE',variable, key, JSON.stringify(fields,null,4))
    if(variable === '.'){
		//console.log(fields[key]['type'])
		if(fields[key]['type'] == 'date'){
			return fields[key]['val'] ? "'"+moment(fields[key]['val']).format('YYYY-MM-DD')+"'" : false
		}
		return fields[key]['val'] ? fields[key]['val'] : false
	}else{
		return fields[variable]['val'] ? fields[variable]['val'] : false
	}
}


function processFunction1(str, func){
	
	args = str.substring(func.length+1, str.length-1)
	//console.log('PROCESS FUNCTION',func, args)

	switch(func){
		case 'regex':
			tokens = args.split(',')
			// get value of tokens[0] is 
			break;
		case 'selected':
			//console.log('selected',args)
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

function processFunction(str, func){
	
	args = str.substring(func.length+1, str.length-1)
	//console.log('PROCESS FUNCTION',func, args)

	switch(func){
		case 'regex':
			tokens = args.replace(/["']/g, '').split(',')
			const regex = new RegExp(tokens[1]);
			return regex.test(tokens[0])
		case 'selected':
			//console.log('selected',args)
			return compareStrings(args)
		case 'date':
			//console.log('wer are in date',args)
			return args

		case 'today':
			return "'"+getTodaysDateAsString()+"'"

		case 'sql':
			//tbl, select, cond, 
			return do_query(args) 

		case 'count-selected':
			//console.log('count-selected',args)
			return args.split(',').length

		case 'decimal-date-time':
			const days 	= (new Date(args.replace(/["'\[\]]/g, ''))).getTime()/86400000
			return days.toFixed(0)

		case 'round':
			//console.log('Round items we have',args, str, func)
			// get numbers from (4,5)
			try{
				const matches = args.split(',') //str.match(/\d+/g);
				//console.log('matches',args,matches)
				// Convert the matched strings to numbers and destructure them into variables
				const [num1, num2] = matches.map(Number);
				return num1.toFixed(num2)
			}catch(e){
				console.log('some error', e)
				return 'error'
			}
			
		case 'ceil':
			//console.log('in ceil',args,str,Math.ceil(args))
			return Math.ceil(args)
		case 'recomended_hectars':
			// 57 BARN FORM
			// Farmer ID
			tmp 	= args.split(',')
			let recomended_hectars = 0
			let farmerData = getFormDataByFarmer(tmp[0], tmp[1])
			//console.log('farmerdata', farmerData)
			for(i = 0; i < farmerData.length; i++){
				let data = JSON.parse(farmerData[i].form_data)
				if(!isNaN(parseFloat(data.calculation_hect_plant)) && isFinite(data['calculation_hect_plant'])){

					//console.log('recomended hectars',i, recomended_hectars)
					recomended_hectars += parseFloat(data['calculation_hect_plant'])
				}
			}
			return recomended_hectars

		case 'survey_data_sum':
			tmp 	= args.split(',')
			let farmer_id 	= tmp[0]
			let form_id 	= tmp[1]
			let calc_field 	= tmp[2].replace(/["'\[\]]/g, '');
			
			let survey_data = 0
			farmerData 		= getFormDataByFarmer(farmer_id, form_id)
			
			for(i = 0; i < farmerData.length; i++){
				let data = JSON.parse(farmerData[i].form_data)
				if(!isNaN(parseFloat(data[calc_field])) && isFinite(data[calc_field])){
					survey_data += parseFloat(data[calc_field])
				}
			}
			return survey_data

		case 'sql':
			return true
			//do_query(args)
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
	//console.log('compare strings',input)
	const parts = input.split(',').map(part => part.trim().replace(/^"|"$|^'|'$/g, ''));
	// get last element of array
	const ele = parts.pop()
	const ava = parts.includes(ele)
	return ava


}

function getTodaysDateAsString() {
	return moment().format('YYYY-MM-DD')
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


	console.log('in validate',key,str)
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