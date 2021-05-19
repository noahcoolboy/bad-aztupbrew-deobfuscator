// Decompression, Decryption, toSmartBuffer

let SmartBuffer = require("smart-buffer").SmartBuffer
function decompress(constants) {
    // Lempel-Ziv Compression
    let marker = 0
    let dictionary = Array(256).fill(0).map((v,i) => String.fromCharCode(i))
    function read() {
        let length = parseInt(constants[marker],36)
        marker++
        let value = parseInt(constants.substring(marker, marker+length), 36)
        marker += length
        //console.log(value)
        return value
    }

    let previous = String.fromCharCode(read())
    let returnValue = []
    returnValue.push(previous)
    while(marker < constants.length) {
        let entry = read()
        let word
        if(dictionary[entry]) {
            word = dictionary[entry]
        } else {
            word = previous + previous[0]
        }
        dictionary.push(previous + word[0])
        //console.log(`Entry ${dictionary.length-1} now ${previous + word[0]}`)
        returnValue.push(word)
        previous = word
    }
    //console.log(returnValue.map(v=>v.split(x=>x).charCodeAt(0)))
    return Buffer.from(returnValue.map(v=>v.split("").map(x=>x.charCodeAt(0))).flat())
}

function decrypt(buffer, key) {
    return buffer.map(value => value ^ key)
}

function toSmartBuffer(buf) {
    return SmartBuffer.fromBuffer(buf)
}

module.exports = {decompress, decrypt, toSmartBuffer}