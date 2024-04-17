var Parser = require('expr-eval').Parser;
var parser = new Parser();

//let str = '.  >= today()'
let str = true

function processVariable(variable) {
    // Example processing function, e.g., converting the variable to uppercase
	//console.log('var: ',variable)

    if(variable === '.'){
		return 4
	}

	if(variable == 'name'){
		return 14
	}
}


function processFunction(str, func){
	
	args = str.substring(func.length+1, str.length-1)
	console.log(func, args)

	switch(func){
		case 'regex':
			tokens = args.split(',')
			// get value of tokens[0] is 
			break;
		case 'selected':
			break;
		case 'date':
			return args
			break;
		case 'today':
			return "'"+getTodaysDateAsString()+"'"

		case 'count-selected':
			break;

		case 'string-length':
			// check if its an available field
			return 5
		
	}

}

function getTodaysDateAsString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function replaceVariable(input) {

    const pattern = /\$\{(\w+)\}|(?<!\d)[.]/g;
    const output = input.replace(pattern, (match, variable) => {
        // If match is a variable, process it; otherwise, return the match as is
		if(variable == undefined ) variable = "."
        return variable ? processVariable(variable) : '.';
    });

    return output;
}


function replaceFunctions(input) {

	const pattern = /(selected|date|today|count-selected|string-length|regex)\((.*?)\)/g;
    const output = input.replace(pattern, (match, variable) => {
		console.log('patern :', match, variable)
        return variable ? processFunction(match, variable) : variable;
    });

    return output;
}


// Example usage
// check if it is a string
if (typeof str !== 'string') {
	// evaluate the object/boolean
	console.log(Boolean(str))
	return Boolean(str)
}
const processedString = replaceVariable(str, processVariable);
console.log(processedString); // Output: This is a VARIABLE example

const expression	= replaceFunctions(processedString)
console.log(expression)

const result = parser.evaluate(expression);
console.log(result)
