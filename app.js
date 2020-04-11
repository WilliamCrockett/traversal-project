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

    console.table(initialBoardSetUp)
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

const togglePorts = function() {
    // toggle ports depending on state
}

const changeStart = function(row,col) {
    const curState = initialBoardSetUp[row][col]
    if (curState.toUpperCase() == 'S') {        
        initialBoardSetUp[row][col] = '.'
    }
}

const toggleKey = function(row,col) {
    const curState = initialBoardSetUp[row][col];
    if (curState === 'p') {
        initialBoardSetUp[row][key] = 'P'
    } else if (curState === 'P') {
        initialBoardSetUp[row][key] = 'p'
    }
}

const checkNextCell = function(row,col) {
    // console.log(row,col)
    const nextCell = initialBoardSetUp[row][col]
    // console.log('this is what is in the next cell', nextCell)
    const cellTypes = {
        '.': 'empty',
        'x': 'wall',
        'X': 'wall',
        'u': 'horizontalMoverUp',
        'd': 'horizontalMoverDown',
        'l': 'horizontalMoverLeft',
        'r': 'horizontalMoverRight',
        'U': 'verticalMoverUp',
        'D': 'verticalMoverDown',
        'L': 'verticalMoverLeft',
        'R': 'verticalMoverRight',
        'h': 'closedHorizontalSwitch',
        'H': 'openHorizontalSwitch',
        'v': 'closedVerticalSwitch',
        'V': 'openVerticalSwitch',
        'k': 'aKey',
        'K': 'aKey',
        'p': 'closedPort',
        'P': 'openPort',
        't': 'target',
        'T': 'target',
        's': 'start',
        'S': 'start'
    }
    const cellType = cellTypes[nextCell]
    // console.log('cellType', cellType)
    // console.log('nextCell', nextCell)

    let canMove = false;

    switch(cellType) {
        case 'empty':
            canMove = true;
            break;
        case 'wall':
            canMove = false; 
            break;
        case 'horizontalMoverUp':
            //code 
            canMove = false; 
            break;
        case 'horizontalMoverDown':
            //code 
            canMove = false; 
            break;
        case 'horizontalMoverLeft':
            //code 
            canMove = false; 
            break;
        case 'horizontalMoverRight':
            //code 
            canMove = false; 
            break;
        case 'verticalMoverUp':
            //code 
            canMove = false; 
            break;
        case 'verticalMoverDown':
            //code 
            canMove = false; 
            break;
        case 'verticalMoverLeft':
            //code 
            canMove = false; 
            break;
        case 'verticalMoverRight':
            //code 
            canMove = false; 
            break;
        case 'closedHorizontalSwitch':
            canMove = false; 
            //code 
            break;
        case 'openHorizontalSwitch':
            canMove = true;
            //code 
            break;
        case 'closedVerticalSwitch':
            canMove = false; 
            //code 
            break;
        case 'openVerticalSwitch':
            canMove = true;
            //code 
            break;
        case 'aKey':
            canMove = true;
            togglePorts()
            toggleKey(row,col)
            //code 
            break;
        case 'closedPort':
            //code 
            canMove = false;
            break;
        case 'openPort':
            canMove = true;
            break;
        case 'target':
            canMove = true;
            break;
        case 'start':
            canMove = true;
            changeStart(row,col)
            break;
        default:
            console.log("You really shouldn't ever see this...")
            break;    

    }
    // console.log(cellTypes[nextCell])
    return {canMove, cellType}
}

const moveToLeft = function(curPos) {
    let newRow = (curPos[0])
    let newCol = (curPos[1]-1)
    if (newCol < 0) {
        // console.log('move has no effect')
        return([curPos[0],curPos[1]])
    } else {
        let ans = checkNextCell(newRow,newCol)
        if (ans.canMove) {
            if (ans.cellType == 'target') {
                console.log('you win')
            }
            return([newRow, newCol])
        } else {
            if (ans.cellType.indexOf('Mover') >=0) {
                console.log(ans)
                console.log('in move to left and it should show if mover move')
                // it was a mover. Just can't move there. Not over
                return([curPos[0],curPos[1]])
            }
        }
    }
    
}

const moveToRight = function(curPos) {
    let newRow = (curPos[0])
    let newCol = (curPos[1]+1)
    if (newCol >= maxCols) {
        // console.log('move has no effect')
        return([curPos[0],curPos[1]])
    } else {
        let ans = checkNextCell(newRow,newCol)
        if (ans.canMove) {
            if (ans.cellType == 'target') {
                console.log('you win')
            }
            return([newRow, newCol])
        } else {    
            if (ans.cellType.indexOf('Mover') >=0) {
                console.log(ans)
                console.log('in move to right and it should show if mover move')
                // it was a mover. Just can't move there. Not over
                return([curPos[0],curPos[1]])
            }
        }
    }
}

const moveDown = function(curPos) {
    let newRow = (curPos[0]+1)
    let newCol = (curPos[1])
    if (newRow >= (maxRows)) {
        newRow = 0
        return([newRow,newCol])
    } else {
        let ans = checkNextCell(newRow,newCol)
        if (ans.canMove) {
            if (ans.cellType == 'target') {
                console.log('you win')
            }
            return([newRow, newCol])
        } else {
            if (ans.cellType.indexOf('Mover') >=0) {
                console.log(ans)
                console.log('in move down and it should show if mover move')
                // it was a mover. Just can't move there. Not over
                return([curPos[0],curPos[1]])
            }
        }
    }
}

const moveUp = function(curPos) {
    let newRow = (curPos[0]-1)
    let newCol = (curPos[1])
    if (newRow < 0) {
        newRow = maxRows-1
        return([newRow,newCol])
    } else {
        let ans = checkNextCell(newRow,newCol)
        if (ans.canMove) {
            if (ans.cellType == 'target') {
                console.log('you win')
            }
            return([newRow, newCol])
        } else {
            if (ans.cellType.indexOf('Mover') >=0) {
                console.log(ans)
                console.log('in move up and it should show if mover move')
                // it was a mover. Just can't move there. Not over
                return([curPos[0],curPos[1]])
            }
        }
    }
}

const quitGame = function(curPos) {
    console.log('shockingly that worked', curPos)
}

const toggleCellsWithNewPlayerPos = function(oldRow, oldCol, newRow,newCol) {
    // console.log(oldRow,oldCol)
    // console.log(newRow,newCol)
    initialBoardSetUp[oldRow][oldCol] = '.'
    initialBoardSetUp[newRow][newCol] = 'Y'
}

async function startGame() {
    console.log('starting game')
    let currentPos = initialStartingPos
    for (let i=0; i<initialMoves.length; i++) {
        try {
            console.log('#######################################################################################')
            const oldRow = currentPos[0]
            const oldCol = currentPos[1]
            let newPos = await movePiece(currentPos, initialMoves[i])
            // console.log('the new pos', newPos)
            currentPos = newPos
            console.log(currentPos)
            const row = newPos[0]
            const col = newPos[1]
            toggleCellsWithNewPlayerPos(oldRow,oldCol,row, col)
            console.table(initialBoardSetUp)
            console.log('#######################################################################################')
        } catch (e) {
            console.error(e)
        }
        
    }
    console.log('final position', currentPos)
}

const movePiece = function(currentPos, moveType) {
    // console.log('in move piece, currentPos is', currentPos)
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
