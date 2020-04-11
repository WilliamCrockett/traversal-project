// use strict


// imports
const fs = require('fs')


// args
const args = process.argv.slice(2)
const boardFileDir = args[0]
const movesFileDir = args[1]

// globals
let initialStartingPos = null;
let maxCols = null
let maxRows = null

// console.log(args)

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
    maxCols = numBoardCols
    maxRows = numBoardRows

    const actualBoardInfo = []

    for (i = 2; i < boardContents.length; i++) {
        actualBoardInfo.push(boardContents[i])
    }


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
    initialStartingPos = getStartingPosition(initialBoardSetUp)

    fs.readFile(movesFileDir, 'utf8', parseMovesFile)

    console.log(initialBoardSetUp)
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

    initialMoves = lineAsArray
    startGame()
}

const checkNextCell = function(row,col) {
    // console.log(row,col)
    const nextCell = initialBoardSetUp[row][col]
    // console.log('this is what is in the next cell', nextCell)
}

const moveToLeft = function(curPos) {
    let newRow = (curPos[0])
    let newCol = (curPos[1]-1)
    if (newCol < 0) {
        // console.log('move has no effect')
        return([curPos[0],curPos[1]])
    } else {
        checkNextCell(newRow,newCol)
        return([newRow, newCol])
    }
    
}

const moveToRight = function(curPos) {
    let newRow = (curPos[0])
    let newCol = (curPos[1]+1)
    if (newCol >= maxCols) {
        // console.log('move has no effect')
        return([curPos[0],curPos[1]])
    } else {
        checkNextCell(newRow,newCol)
        return([newRow, newCol])
    }
    
    // console.log('shockingly that worked right', curPos)
}

const moveDown = function(curPos) {
    let newRow = (curPos[0]+1)
    let newCol = (curPos[1])
    if (newRow >= (maxRows)) {
        // needToWrap bottom to top
        // if we wrapping from bottom to top, we just going to the first row right? 
        // so then newRow would = 0
        newRow = 0
        return([newRow,newCol])
    } else {
        checkNextCell(newRow,newCol)
        return([newRow, newCol])
    }
    
    // console.log('shockingly that worked down', curPos)
}

const moveUp = function(curPos) {
    let newRow = (curPos[0]-1)
    let newCol = (curPos[1])
    if (newRow < 0) {
        // console.log('should wrap')
        // need to wrap
        newRow = maxRows-1
        return([newRow,newCol])
    } else {
        // console.log('moveUp' + newRow + newCol)
        checkNextCell(newRow,newCol)
        return([newRow, newCol])
    }
    
    // console.log('shockingly that worked up', newRow, newCol)
}

const quitGame = function(curPos) {
    console.log('shockingly that worked', curPos)
}


async function startGame() {
    console.log('starting game')
    let currentPos = initialStartingPos
    for (let i=0; i<initialMoves.length; i++) {
        try {
            // console.log('the move before operation', initialMoves[i])
            let newPos = await movePiece(currentPos, initialMoves[i])
            console.log('the new pos', newPos)
           
            currentPos = newPos
        } catch (e) {
            console.error(e)
        }
        
    }
    console.log('final position', currentPos)
}

const movePiece = function(currentPos, moveType) {
    const movesMap = {
        h: 'moveToLeft',
        l: 'moveToRight',
        j: 'moveDown',
        k: 'moveUp',
        x: 'quitGame'
    }
    // console.log('cur pos', currentPos)
    return new Promise(function(resolve, reject) {
        const move = movesMap[moveType]
        let newPos = eval(move+`([${currentPos[0]}, ${currentPos[1]}])`)
        // let newPos = currentPos
        resolve(newPos)
    })
    
}

const getStartingPosition = function(initialBoardSetUp) {
    const startingChar = 'S'
    for (let i =0; i < initialBoardSetUp.length; i++) {
        for (let x =0; x < initialBoardSetUp[i].length; x++) {
            if (initialBoardSetUp[i][x].toUpperCase() == startingChar) { //technically dont need to upper case it since using lose equality.
                console.log('start pos', [i,x])
                return [i,x]
            }
        }
    }
}

const setCurrentPosition = function(pos) {

}

fs.readFile(boardFileDir, 'utf8', parseBoardFile)

// fs.readFile(movesFileDir, 'utf8', parseMovesFile)
