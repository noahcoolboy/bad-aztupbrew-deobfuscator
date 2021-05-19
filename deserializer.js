function readConstants(constantBuffer, typeMapping) {
    let returnValue = []
    let length = constantBuffer.readUInt32LE()
    console.log(length + " constants")
    for(let x = 0; x < length; x++) {
        let read = undefined
        let type = constantBuffer.readUInt8()
        if(type == typeMapping[0]) {
            read = Boolean(constantBuffer.readUInt8())
            console.log("Bool: "+read)
        } else if(type == typeMapping[1]) {
            read = constantBuffer.readDoubleLE()
            console.log("Number: "+read)
        } else if(type == typeMapping[2]) {
            let stringLength = constantBuffer.readUInt32LE()
            read = constantBuffer.readString(stringLength)
            console.log("String: "+read)
        } else {
            console.log("Nil!")
        }
        returnValue.push(read)
    }
    return returnValue
}

function readInstructionRegisters(constantBuffer, constants) {
    let returnValue = []
    let length = constantBuffer.readUInt32LE()
    console.log(length + " instructions")
    for(let x = 0; x < length; x++) {
        let instruction = constantBuffer.readUInt8()
        //console.log("Instruction: "+instruction)
        if((instruction & 0b00000001) == 0) {
            let outputtedInstruction = [constantBuffer.readUInt16LE(), constantBuffer.readUInt16LE(), null, null]
            let instructionType = (instruction & 0b00000110) >> 1
            if(instructionType == 0) { // ABC
                outputtedInstruction[2] = constantBuffer.readUInt16LE()
                outputtedInstruction[3] = constantBuffer.readUInt16LE()
            } else if(instructionType == 1) { // AB
                outputtedInstruction[2] = constantBuffer.readUInt32LE()
            } else if(instructionType == 2) { // AsBx
                outputtedInstruction[2] = constantBuffer.readUInt32LE() - (2 ** 16)
            } else if(instructionType == 3) {
                outputtedInstruction[2] = constantBuffer.readUInt32LE() - (2 ** 16)
                outputtedInstruction[3] = constantBuffer.readUInt16LE()
            }
            /*if(instruction & 0b00001000) {
                outputtedInstruction[1] = constants[outputtedInstruction[1]]
            }
            if(instruction & 0b00010000) {
                outputtedInstruction[2] = constants[outputtedInstruction[2]]
            }
            if(instruction & 0b00100000) {
                outputtedInstruction[3] = constants[outputtedInstruction[3]]
            }*/ // Not needed when converting to luac
            returnValue.push(outputtedInstruction)
        }
    }
    return returnValue
}

function readProtoLength(constantBuffer) {
    return constantBuffer.readUInt32LE()
}

function readParameterLength(constantBuffer) {
    return constantBuffer.readUInt8()
}

module.exports = {readConstants, readInstructionRegisters, readProtoLength, readParameterLength}