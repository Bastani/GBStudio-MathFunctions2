const alphaRX = /\D?/;
const numRX = /\d+/;

export const id = "EVENT_BASTANI_MATH_FUNCTIONS_2";

export const name = "Variable: Math Functions 2";

const updateVars = (args) => 
{	
	
}

const fields = 
[
	{
		key: "vectorX1",
		label: "Destination Variable and Multiplier",
		type: "variable"
	},
	{
		key: "vectorX2",
		type: "variable"
    },
    {
        key: "operation",
        type: "select",
        options: [
            ["set", "Set To"],
            ["add", "Add"],
            ["sub", "Subtract"],
            ["mul", "Multiply"],
            ["div", "Divide"]
        ],
        defaultValue: "set",
        width: "50%"
    },
    {
        key: "other",
        type: "select",
        options: [
            ["val", "Value"],
            ["var", "Variable"],
            ["rnd", "Random"]
        ],
        defaultValue: "val",
        width: "50%"
    },
    {
        key: "vectorY1",
        type: "variable",
        conditions: [
        {
            key: "other",
            eq: "var"
        }
        ],
        defaultValue: "LAST_VARIABLE"
    },
    {
        key: "vectorY2",
        type: "variable",
        conditions: [
        {
            key: "other",
            eq: "var"
        }
        ],
        defaultValue: "LAST_VARIABLE"
    },
    {
        key: "value",
        type: "number",
        conditions: [
        {
            key: "other",
            eq: "val"
        }
        ],
        min: 0,
        max: 65535,
        defaultValue: "1"
    },
    {
        key: "minValue",
        type: "number",
        conditions: [
          {
            key: "other",
            eq: "rnd"
          }
        ],
        min: 0,
        max: 65535,
        label: "Min Value",
        defaultValue: "0",
        width: "50%"
    },
    {
        key: "maxValue",
        type: "number",
        conditions: [
          {
            key: "other",
            eq: "rnd"
          }
        ],
        min: 0,
        max: 65535,
        label: "Max Value",
        defaultValue: "65535",
        width: "50%"
    }
];

const variablesDoMath = (variable1, variable1Mult, sign, variable2, variable2Mult, helpers) =>
{
	const {ifVariableValue, ifVariableCompare, variablesAdd, variablesSub, variablesMul, variablesDiv, variablesMod, variableInc, variableDec, variableSetToValue, variableCopy, labelGoto, labelDefine, textDialogue} = helpers;
	const tmp0 = customTemporaryVariable(0);
    const tmp1 = customTemporaryVariable(1);
    const endMathLoop = generateString();
	switch (sign) {
		case "+":
			variableCopy(tmp0, variable1); 
			variablesAdd(tmp0, variable2, 0);
			ifVariableCompare(tmp0, "<", variable1, () =>
			{
				variableCopy(variable1, tmp0);
				variableInc(variable1Mult);
				variablesAdd(variable1Mult, variable2Mult, 1);
			}, () =>
			{//Else
				variablesAdd(variable1, variable2, 1);
				variablesAdd(variable1Mult, variable2Mult, 1);
			});
			break;
		case "-":
			ifVariableCompare(variable1, ">=", variable2, () =>
			{
				ifVariableCompare(variable1Mult, ">=", variable2Mult, () =>
				{
					variablesSub(variable1, variable2, 0);
					variablesSub(variable1Mult, variable2Mult, 0);
				}, () =>
				{//Else
					variableSetToValue(variable1, 0);
					variableSetToValue(variable1Mult, 0);
				});
			}, () =>
			{
				ifVariableCompare(variable1Mult, ">", variable2Mult, () =>
				{
					variableDec(variable1Mult);
					variablesSub(variable1, variable2, 0);
					variablesSub(variable1Mult, variable2Mult, 0);
				}, () =>
				{//Else
					variableSetToValue(variable1, 0);
					variableSetToValue(variable1Mult, 0);
				});
			});
			break;
		case "*":
			let tmp2 = customTemporaryVariable(2);
			let tmp3 = customTemporaryVariable(3);
			let tmp4 = customTemporaryVariable(4);
			let tmp5 = customTemporaryVariable(5);
			let tmp6 = customTemporaryVariable(6);
			let tmp7 = customTemporaryVariable(7);
			let trueMid = customTemporaryVariable(8);
			let trueLow = customTemporaryVariable(9);
            const var1 = customTemporaryVariable(10);
            const var1Mult = customTemporaryVariable(11);
			let count1 = customTemporaryVariable(12);
			let count2 = customTemporaryVariable(13);

			variableSetToValue(trueMid, 0);
			variableSetToValue(trueLow, 0);
            multGetUpMidLow(variable1Mult, variable2Mult, helpers); //Upper
            ifVariableValue(var1Mult, ">", 0, () => //Check Overflow
			{
				variableSetToValue(variable1, 255);
                variableSetToValue(variable1Mult, 255);
                labelGoto(endMathLoop);
            }, []);
            ifVariableValue(var1, ">", 0, () => //Check Overflow
			{
				variableSetToValue(variable1, 255);
                variableSetToValue(variable1Mult, 255);
                labelGoto(endMathLoop);
			}, []);
            variableCopy(tmp5, var1);
            variableCopy(tmp6, var1Mult);
            multGetUpMidLow(variable1, variable2, helpers); //Lower
            variableCopy(trueLow, var1);
            variableCopy(trueMid, var1Mult);

            variableSetToValue(tmp1, 0);

            variablesDoMath(variable1, count1, "+", variable1Mult, tmp1, helpers);
            variablesDoMath(variable2, count2, "+", variable2Mult, tmp1, helpers);
            
            multGetUpMidLow(variable1, variable2, helpers); //Middle
        
            ifVariableValue(count1, "==", 1, () => 
            {
                ifVariableValue(count2, "==", 1, () => 
                { //(1,1)
                    //Don't think this can occur
                }, () => 
                { //(1,0)
                    variablesAdd(var1Mult, variable2);
                })
            }, () => 
            { //else
                ifVariableValue(count2, "==", 1, () => 
                {//(0,1)
                    variablesAdd(var1Mult, variable1);
                }, [])
            })
            variablesDoMath(var1, var1Mult, "-", tmp5, tmp6, helpers)
            variablesDoMath(var1, var1Mult, "-", trueLow, trueMid, helpers)


            ifVariableValue(var1Mult, ">", 0, () => //Check Overflow
			{
				variableSetToValue(variable1, 255);
                variableSetToValue(variable1Mult, 255);
                labelGoto(endMathLoop);
            }, []);
            variableCopy(tmp2, trueMid);
            variablesAdd(trueMid, var1);
            ifVariableCompare(tmp2, ">", trueMid, () => //Check Overflow
			{
				variableSetToValue(variable1, 255);
                variableSetToValue(variable1Mult, 255);
                labelGoto(endMathLoop);
            }, []);

            variableCopy(variable1, trueLow);
            variableCopy(variable1Mult, trueMid);
			break;
		case "/":
			ifVariableValue(variable2Mult, ">", 0, () => 
			{
				variablesDiv(variable1Mult, variable2Mult);
				variableCopy(variable1, variable1Mult);
				variableSetToValue(variable1Mult, 0);
			}, () => 
			{
				variableCopy(tmp0, variable1Mult);
				variablesDiv(variable1, variable2);
				variablesDiv(variable1Mult, variable2);
				variablesMod(tmp0, variable2);

				variableSetToValue(tmp1, 255);
				variablesDiv(tmp1, variable2);
				variablesMul(tmp1, tmp0)
				variablesAdd(variable1, tmp1)

				variableSetToValue(tmp1, 255);
				variablesMod(tmp1, variable2);
				variablesMul(tmp1, tmp0)
				variablesDiv(tmp1, variable2);
				variablesAdd(variable1, tmp1)

				variableSetToValue(tmp1, 1);
				variablesMul(tmp1, tmp0)
				variablesDiv(tmp1, variable2);
				variablesAdd(variable1, tmp1)
			});
	}
	labelDefine(endMathLoop);
}

const multGetUpMidLow = (variable1, variable2, helpers) =>
{
	const {ifVariableCompare, variableSetToValue, variableCopy, variablesDiv, variablesMul, variablesAdd, variablesSub, variableInc, textDialogue} = helpers;
	let sixteen = customTemporaryVariable(0);
	let tmp1 = customTemporaryVariable(1);
	let tmp2 = customTemporaryVariable(2);
	let tmp3 = customTemporaryVariable(3);
	let tmp4 = customTemporaryVariable(4);
    const var1 = customTemporaryVariable(10);
    const var1Mult = customTemporaryVariable(11);

	variableSetToValue(sixteen, 16);
	variableSetToValue(var1Mult, 0);
	variableSetToValue(var1, 0);
	variableSetToValue(tmp1, 0);
	variableSetToValue(tmp2, 0);
	variableSetToValue(tmp3, 0);
	variableSetToValue(tmp4, 0);

    //Set Upper
	variableCopy(var1Mult, variable1);
	variableCopy(tmp1, variable2);
	variablesDiv(var1Mult, sixteen);
    variablesDiv(tmp1, sixteen);

    //Set Lower
	variableCopy(var1, variable1);
	variableCopy(tmp2, variable2);
	variablesMul(var1, sixteen);
	variablesMul(tmp2, sixteen);
	variablesDiv(var1, sixteen);
	variablesDiv(tmp2, sixteen);

    //Set Middle
	variableCopy(tmp4, var1Mult);
	variableCopy(tmp3, tmp1);
	variablesAdd(tmp4, var1)
	variablesAdd(tmp3, tmp2)

    variablesMul(var1Mult, tmp1);
    variablesMul(var1, tmp2);
    
    variablesMul(tmp4, tmp3);
	variablesSub(tmp4, var1Mult);
    variablesSub(tmp4, var1);
    
    variableCopy(tmp2, tmp4);
    variablesDiv(tmp4, sixteen); // 0000xxxx
	variablesMul(tmp2, sixteen); // xxxx0000
    variablesAdd(var1Mult, tmp4);

    variableCopy(tmp3, var1);
    variablesAdd(var1, tmp2);

    ifVariableCompare(tmp3, ">", var1, () => 
    {
        variableInc(var1Mult);
    }, []);
}

const compile = (input, helpers) => 
{
    const {variableSetToValue, variableCopy, variableSetToRandom, ifVariableValue, temporaryEntityVariable, textDialogue} = helpers;
    const tmp1 = customTemporaryVariable(14)
    const tmp2 = customTemporaryVariable(15)
    const variable = input.value % 256, variableMult = Math.floor(input.value / 256);
    switch (input.other) {
        case "var": {
            variableCopy(tmp1, input.vectorY1);
            variableCopy(tmp2, input.vectorY2);
            break;
        }
        case "rnd": {
            const minVar = input.minValue % 256, minVarMult = Math.floor(input.minValue / 256);
            const maxVar = input.maxValue % 256, maxVarMult = Math.floor(input.maxValue / 256);
            const rangeMin = Math.min(254, Math.max(0, (255 || 0) - minVar));
            const rangeMed = Math.min(254, Math.max(0, maxVar - minVar));
            const rangeMax = Math.min(254, Math.max(0, (maxVar || 0)));
            const rangeMult = Math.min(254, Math.max(0, (maxVarMult || 0) - minVarMult));
            variableSetToRandom(tmp2, minVarMult, rangeMult); //Trigerring random twice gives better number generation
            variableSetToRandom(tmp2, minVarMult, rangeMult);
            ifVariableValue(tmp2, "==", maxVarMult, () => 
            {
                ifVariableValue(tmp2, "==", minVarMult, () => 
                {
                    variableSetToRandom(tmp1, minVar, rangeMed);
                }, () => 
                {
                    variableSetToRandom(tmp1, 0, rangeMax);
                });
            }, () => 
            {
                ifVariableValue(tmp2, "==", minVarMult, () => 
                {
                    variableSetToRandom(tmp1, minVar, rangeMin);
                }, () => 
                {
                    variableSetToRandom(tmp1, 0, 254);
                });
            });
            break;
        }
        case "val":
        default:
            variableSetToValue(tmp1, variable || 0);
            variableSetToValue(tmp2, variableMult || 0);
            break;
    }

    switch (input.operation) {
        case "add":
            variablesDoMath(input.vectorX1, input.vectorX2, "+", tmp1, tmp2, helpers);
            break;
        case "sub":
            variablesDoMath(input.vectorX1, input.vectorX2, "-", tmp1, tmp2, helpers);
            break;
        case "mul":
            variablesDoMath(input.vectorX1, input.vectorX2, "*", tmp1, tmp2, helpers);
            break;
        case "div":
            variablesDoMath(input.vectorX1, input.vectorX2, "/", tmp1, tmp2, helpers);
            break;
        case "set":
        default:
            variableCopy(input.vectorX1, tmp1);
            variableCopy(input.vectorX2, tmp2);
            break;
    }
};

const generateString = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const customTemporaryVariable = (result) => String(result + 490);

const canInteract = 489;

const globalZero = 511;

module.exports = 
{
	id,
	name,
	fields,
	compile
};