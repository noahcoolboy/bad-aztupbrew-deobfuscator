let constantTable;
let upvaluesTable;
let envTable;
let stackTable
let instructionVarName;
let instructionNumName;
let instructionTableName;
function init(parsed) {
    constantTable = parsed.body[0].arguments[0].base.body[1].parameters[0].name
    upvaluesTable = parsed.body[0].arguments[0].base.body[1].parameters[1].name
    envTable = parsed.body[0].arguments[0].base.body[1].parameters[2].name
    stackTable = parsed.body[0].arguments[0].base.body[1].body[1].arguments[0].body[5].variables[0].name
    instructionVarName = parsed.body[0].arguments[0].base.body[1].body[1].arguments[0].body[0].body.reverse()[0].variables[0].name
    instructionNumName = parsed.body[0].arguments[0].base.body[1].body[1].arguments[0].body.reverse()[4].variables[0].name
    instructionTableName = parsed.body[0].arguments[0].base.body[1].body[1].arguments[0].body[0].variables[0].name
}

function gn(num) {
    // Get Number for when add memes is activated
    return num
}

function deepCompare(a, b, verbose) {
    if (a == undefined || b == undefined || a.type != b.type || (!a.type && b.type) || (!b.type && a.type)) {
        return false
    } else {
        for (let x = 0; x < Object.keys(a).length; x++) {
            let key = Object.keys(a)[x]
            let valueA = a[key]
            let valueB = b[key]
            if(verbose) {
                console.log(key, valueA, valueB)
            }
            //
            if (typeof (valueA) == "object") {
                if (!deepCompare(valueA, valueB, verbose)) {
                    if(verbose) {
                        console.log("INVALID")
                    }
                    return false
                }
            } else if (valueA == constantTable ||
                    valueA == upvaluesTable ||
                    valueA == envTable ||
                    valueA == stackTable ||
                    valueA == instructionVarName ||
                    valueA == instructionNumName ||
                    valueA == instructionTableName ||
                    valueB == constantTable ||
                    valueB == upvaluesTable ||
                    valueB == envTable ||
                    valueB == stackTable ||
                    valueB == instructionVarName ||
                    valueB == instructionNumName ||
                    valueB == instructionTableName) {
                if (valueA != valueB) {
                    return false
                }
            } else if(typeof(valueA) == "number") {
                if(valueA != valueB) return false
            } else {
            }
        }
        return true
    }
}

function replaceKeywords(str) {
    return str
        .replace(/Const\[(.+?)\]/g, "$1")
        .replace(/OP_ENUM/g, "1")
        .replace(/OP_A/g, "2")
        .replace(/OP_B/g, "3")
        .replace(/OP_C/g, "4")
        .replace(/Stk/g, stackTable)
        .replace(/InstNum/g, instructionNumName)
        .replace(/InstTable/g, instructionTableName)
        .replace(/Inst/g, instructionVarName)
        .replace(/Env/g, envTable)
        .replace(/Upvalue/g, upvaluesTable)
}

function compareInstructions(a, b, verbose) {
    let bParsed = require("luaparse").parse(replaceKeywords(b)).body
    return deepCompare(a, bParsed, verbose)
}
//console.log(compareInstructions(require("luaparse").parse("a=3").body, "a=3"))

function findOpcode(instruction, instrRegisters, otherInstructions, instructionIndex) {
    // I'm sorry
    if(compareInstructions(instruction, 'Stk[Inst[OP_A]]=Env[Const[Inst[OP_B]]];')) {
        // OpGetGlobal
        return ["ABx", 5, instrRegisters[1], instrRegisters[2] - 1]
    } else if(compareInstructions(instruction, 'Stk[Inst[OP_A]]=Const[Inst[OP_B]];')) {
        // OpLoadK
        return ["ABx", 1, instrRegisters[1], instrRegisters[2] - 1]
    } else if(compareInstructions(instruction, 'local Register=Inst[OP_A];Stk[Register](Stk[Register+1])')) {
        // OpCallB2C1
        return ["ABC", 28, instrRegisters[1], 2, 1]
    } else if(compareInstructions(instruction, 'Stk[Inst[OP_A]]();Top=A;')) {
        // OpCallB1C1
        return ["ABC", 28, instrRegisters[1], 1, 1]
    } else if(compareInstructions(instruction, 'local A=Inst[OP_A];local Results,Limit=_R(Stk[A]());Top=A-1;Limit=Limit+A-1;local Edx=0;for Idx=A,Limit do Edx=Edx+1;Stk[Idx]=Results[Edx];end;Top=Limit;')) {
        // OpCallB1C0
        return ["ABC", 28, instrRegisters[1], 1, 0]
    } else if(compareInstructions(instruction, 'local d; Stk[Inst[OP_A]]=Env[Inst[OP_B]];')) {
        // OpCall
        return ["ABC", 28, instrRegisters[1], instrRegisters[2], instrRegisters[3]]
    } else if(compareInstructions(instruction, 'do return end')) {
        // OpReturnB1
        return ["ABC", 30, instrRegisters[1], 1]
    } else if(compareInstructions(instruction, 'Stk[Inst[OP_A]] = {}')) {
        // OpNewtable
        return ["ABC", 10, instrRegisters[1], 0, 0]
    } else if(compareInstructions(instruction, 'Stk[Inst[OP_A]] = Stk[Inst[OP_B]][Inst[OP_C]]')) {
        // OpGetTable
        return ["ABC", 6, instrRegisters[1], instrRegisters[2], instrRegisters[3]]
    } else if(compareInstructions(instruction, 'Stk[Inst[OP_A]][Inst[OP_B]]=Stk[Inst[OP_C]]')) {
        // OpSetTable
        return ["ABC", 9, instrRegisters[1], instrRegisters[2], instrRegisters[3]]
    } else if(compareInstructions(instruction, 'Stk[Inst[OP_A]][Inst[OP_B]]=Inst[OP_C]')) {
        // OpSetTable
        return ["ABC", 9, instrRegisters[1], instrRegisters[2], instrRegisters[3]]
    } else if(compareInstructions(instruction, 'local a = Inst[OP_A]; Stk[a](Stk[a + 1])')) {
        // Call
        return ["ABC", 28, instrRegisters[1], instrRegisters[2], instrRegisters[3]]
    } else if(instruction[0].type == "LocalStatement" && instruction.find(v => v.type == "AssignmentStatement" && v.variables[0].name == instruction[0].variables[0].name)) {
        // Push arguments to stack + Call
        // I absolutely hate this because I had to make so many modifications to the code architecture
        let returnValue = []
        let instrNum = instructionIndex
        for (let index = 1; index < instruction.length; index++) {
            if(instruction[index].type == "AssignmentStatement") {
                if(compareInstructions([instruction[index]], 'InstNum = InstNum + 1')) {
                    instrNum++
                } else if(compareInstructions([instruction[index]], 'Inst = InstTable[InstNum]')) {
                } else if(compareInstructions([instruction[index]], 'f = Inst[OP_A]')) {
                } else if(compareInstructions([instruction[index]], 'Stk[f] = Stk[f](g(Stk, f + 1, Inst[3]))')) {
                    returnValue.push(["ABC", 28, 0, otherInstructions[instrNum][2], 2])
                } else {
                    returnValue.push(findOpcode([instruction[index]], otherInstructions[instrNum]))
                }
            } else if(instruction[index].type == "CallStatement") {
                returnValue.push(["ABC", 28, otherInstructions[instrNum][1], otherInstructions[instrNum][2] + 1, 1])
            } else if(compareInstructions([instruction[index]], 'do return end')) {
                returnValue.push(["ABC", 30, otherInstructions[instrNum][1], otherInstructions[instrNum][2]])
            }
        }
        return returnValue
    } else {
        console.log("Unkown opcode")
        //console.log("Unkown opcode, message noah#8315 the script")
        console.log(instrRegisters)
        console.log(JSON.stringify(instruction))
        //console.log("Matches: " + compareInstructions(instruction, 'Stk[Inst[OP_A]][Inst[OP_B]]=Inst[OP_C]', true))
        console.log({
            constantTable,
            upvaluesTable,
            envTable,
            stackTable,
            instructionVarName,
            instructionNumName,
            instructionTableName,
        })
        console.trace()
        console.log("Exiting")
        process.exit(1)
    }
}

module.exports = { findOpcode, init }