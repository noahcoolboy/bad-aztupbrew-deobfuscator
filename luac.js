let outputFile = "deobfuscated.luac"
let fs = require("fs")
let buffer = new (require("smart-buffer").SmartBuffer)

function setOutputFile(file) {
    outputFile = file
}

function writeString(str) {
    buffer.writeUInt32LE(str.length + 1)
    buffer.writeStringNT(str)
}

function writeHeader() {
    buffer.writeString("\x1bLua") // Signature
    buffer.writeUInt8(0x51) // Version - Lua 5.1
    buffer.writeUInt8(0) // Format - 0 (official)
    buffer.writeUInt8(1) // Endianness - 0 -> Big endian, 1 -> Little endian
    buffer.writeUInt8(4) // Size of int
    buffer.writeUInt8(4) // Size of string size
    buffer.writeUInt8(4) // Instruction size
    buffer.writeUInt8(8) // Number size (8 is for doubles)
    buffer.writeUInt8(0) // Are the numbers integral? 0=floating-point, 1=integral number type
}

function writeChunkHeader() {
    writeString("@Print.txt") // Source file name
    buffer.writeUInt32LE(0) // First line defined
    buffer.writeUInt32LE(0) // Last line defined
    buffer.writeUInt8(0) // Upvalue count
    buffer.writeUInt8(0) // Parameter count
    buffer.writeUInt8(2) // Is vararg (bitfield, I don't know how it works but 2 seems fine)
    buffer.writeUInt8(128) // Register amount (128 should do the trick??)
}

function writeInstruction(instr) {
    if(instr[0] == "ABC") {
        buffer.writeUInt32LE((instr[3] << 9 << 8 << 6) + (instr[4] << 8 << 6) + (instr[2] << 6) + (instr[1]))
    } else if(instr[0] == "ABx") {
        buffer.writeUInt32LE((instr[3] << 8 << 6) + (instr[2] << 6) + instr[1])
    } else if(instr[0] == "AsBx") {
        buffer.writeUInt32LE(((instr[3]+131071) << 8 << 6) + (instr[2] << 6) + instr[1])
    } else {
        console.log("Unkown instruction type "+instr[0])
    }
}

function writeConstant(consta) {
    if(consta == null) {
        buffer.writeUInt8(0)
    } else if(typeof(consta) == "boolean") {
        buffer.writeUInt8(1)
        buffer.writeUInt8(Number(consta))
    } else if(typeof(consta) == "number") {
        buffer.writeUInt8(3)
        buffer.writeDoubleLE(consta)
    } else if(typeof(consta) == "string") {
        buffer.writeUInt8(4)
        writeString(consta)
    } else {
        console.log("Unkown type?")
    }
}

function writeUInt32(num) {
    buffer.writeUInt32LE(num)
}

function endChunk() {
    // This is some debug stuff we don't care about
    buffer.writeUInt32LE(0) // Source lines
    buffer.writeUInt32LE(0) // locals
    buffer.writeUInt32LE(0) // upvalues
}

function done() {
    fs.writeFileSync(outputFile, buffer.toBuffer())
}

module.exports = {writeHeader,setOutputFile, done, writeChunkHeader, writeInstruction, writeConstant, endChunk, writeUInt32}