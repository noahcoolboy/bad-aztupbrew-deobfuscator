/*const toDump = "25X25Z27525X25U27525Z24N24L25A25524J25X26327925727D24Y26V26E26V25224L24W27M25V27925H27827525Y27U27427Y27427925T27928027927927Y287279"
const xorKey = 215
const typeMapping = [
    1, // Bool
    0, // Number
    2, // String
]*/



let luaParse = require("luaparse").parse
let parsed = luaParse(require("fs").readFileSync("./example.lua").toString())

let util = require("./util")
let parseUtil = require("./parser")
let deserializer = require("./deserializer")

//console.log(parseUtil.getTypeMapping(parsed))
let toDump = parseUtil.getConstantsString(parsed)
let xorKey = parseUtil.getXorKey(parsed)
let typeMapping = parseUtil.getTypeMapping(parsed)

let decompressed = util.decompress(toDump)
let decrypted = util.decrypt(decompressed, xorKey)
let constantsBuffer = util.toSmartBuffer(decrypted)

function readChunk() {
    let constants = deserializer.readConstants(constantsBuffer, typeMapping)

    let protos = []
    let protoLength = deserializer.readProtoLength(constantsBuffer)
    for (let x = 0; x < protoLength; x++) {
        protos.push(readChunk())
    }

    let parameterCount = deserializer.readParameterLength(constantsBuffer)

    let instructions = deserializer.readInstructionRegisters(constantsBuffer, constants)

    let info = {
        constants,
        instructions,
        protos,
        parameterCount
    }

    return info
}

let topChunk = readChunk()

let ifStatements = parseUtil.getIfStatements(parsed)
let instructionLib = require("./instructions")
instructionLib.init(parsed)

let write = require("./luac")
write.writeHeader()

function writeChunk(chunk) {
    write.writeChunkHeader()

    let final = []

    for (let x = 0; x < chunk.instructions.length; x++) {
        console.log(chunk.instructions[x][0])
        let clause = parseUtil.findClause(ifStatements.clauses, chunk.instructions[x][0])
        let instruction = instructionLib.findOpcode(clause, chunk.instructions[x], chunk.instructions, x)
        if (typeof (instruction[0]) == "object") {
            for (let y = 0; y < instruction.length; y++) {
                console.log(instruction[y])
                final.push(instruction[y])
            }
            x += instruction.length - 2
        } else {
            console.log(instruction)
            final.push(instruction)
        }
    }

    write.writeUInt32(final.length)

    for (let x = 0; x < final.length; x++) {
        console.log(final[x])
        write.writeInstruction(final[x])
    }

    write.writeUInt32(chunk.constants.length)

    for (let x = 0; x < chunk.constants.length; x++) {
        write.writeConstant(chunk.constants[x])
    }

    write.writeUInt32(chunk.protos.length)

    for (let x = 0; x < chunk.protos.length; x++) {
        write(chunk.protos[x]) // Recursion :O
    }

    write.endChunk()
}

writeChunk(topChunk)

write.done()

/*setTimeout(() => {

}, 500000);*/
