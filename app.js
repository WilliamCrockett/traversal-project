// use strict


// imports
const fs = require('fs')


// args
const args = process.argv.slice(2)
const boardFileDir = args[0]
const movesFileDir = args[1]

// globals
let boardTitle = null
let initialBoardSetUp = []
let initialMoves = []

// console.log(args)

fs.readFile(boardFileDir, 'utf8', parseBoardFile)
fs.readFile(movesFileDir, 'utf8', parseMovesFile)

// process imported board file
async function parseBoardFile(err, contents) {
    if (err) {
        console.log("there's an error reading the board file:", err)
        console.log('exiting')
        return
    }
    // split per line into array. 
    let boardContents = contents.split('\r\n')

    boardTitle = boardContents[0]
    console.log("Board Title:", boardTitle)

    const numBoardRows = Number(boardContents[1].split(' ')[0])
    const numBoardCols = Number(boardContents[1].split(' ')[1])

    const actualBoardInfo = []

    for (i = 2; i < boardContents.length; i++) {
        actualBoardInfo.push(boardContents[i])
    }

    // console.log(actualBoardInfo)

    // some validation for luls
    // validate the rows/cols
    if ((numBoardRows < 3 || numBoardCols < 3) || (numBoardRows > 15 || numBoardCols > 15) ) {
        console.log(`illegal number of columns or rows. Must be between 3 and 15`)
        console.log('exiting...')
        return
    }

    // validate that the number of rows given is correct
    if (actualBoardInfo.length != numBoardRows) {
        console.log('illegal number of rows defined. ' + actualBoardInfo.length + ' rows given when ' + numBoardRows + ' was expected' )
        console.log('exiting...')
        return
    }
    // validate that the row length is correct... 
    for (row of actualBoardInfo) {
        if (row.length != (numBoardCols)) {
            console.log('illegal row length:', row)
            console.log('exiting...')
            return
        }
    }

    // validate that we're dealing with valid rows...
    const allowedCharsBoard = '.sStTxXudlrUDLRhHvVkKpP'
    let populatedBoard = []

    for (row of actualBoardInfo) {
        let newArr = row.split('')
        for (char of newArr) {
            if (allowedCharsBoard.indexOf(char) == -1) {
                console.log('illegal character in row:', char)
                console.log('exiting...')
                return
            }
        }
        populatedBoard.push(newArr)
    }

    initialBoardSetUp = populatedBoard

    // console.log(initialBoardSetUp)
}

async function parseMovesFile(err, contents) {
    // return if read error
    if (err) {
        console.log("there's an error reading the board file:", err)
        console.log('exiting')
        return
    }

    const allowedCharsMoves = 'hljkx'

    const lineAsArray = contents.split('')

    for (char of lineAsArray) {
        if (allowedCharsMoves.indexOf(char) == -1) {
            console.log('illegal character in moves file:', char)
            console.log('exiting')
            return
        }
    }

    initialMoves = contents
    console.log('the initial moves', initialMoves)
}

