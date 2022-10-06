/**
 * TODO:
 * -Get rid of ignoreMove and instead use following:
 * -When at dead end, make current position unreachable (make it 1) and push it to an array, 
 *      then with backTracking boolean keep backtracking until a valid move is found, 
 *      and when a valid move is found set all of the tiles in the array to a 
 *      reachable state (make them 0), and then clear the array. By doing this, 
 *      should be able to keep going until the path.length is the same length as 
 *      the total number of tiles (which is tile.data.length * tile.data[0].length)
 * -Make maze generation work by getting rid of array and basically make any already visited
 *      tile unreachable, but backtrack to next availible spot. To render, don't clear each
 *      render call, and remove background tiles
 * -Improve rendering by making everything more scalable with tiles, line size, and space 
 *      between lines. Also, maybe make everything centered on screen. And, maybe add 
 *      controls/ customization such as color, board size, and self-avoiding walk or maze.
 */

let c = document.getElementById("canvas");
let r = c.getContext("2d");
// c.width = Math.floor(window.innerWidth * 0.95);
// c.height = Math.floor(window.innerHeight * 0.95);
c.width = 500;
c.height = c.width;
let w = c.width;
let h = c.height;
let i = 0;
let max = 500;
let ignoreMove = [-1, 1];
let backTracking = false;
let setBackToValidMoves = [];

let showBackground = true;
// this was mistankenly discovered but
let mazeMode = false;
if(mazeMode)
    showBackground = false;

let tile = {
    pathColor: "#EC407A",
    size: w / 10,
    data: [],
    generateData: () => {
        let repeat = w / tile.size;

        for(let i = 0; i < repeat; i++) {
            let next = [];

            for(let j = 0; j < repeat; j++) {
                next.push(0);
            }

            tile.data.push(next);
        }
    }
}
tile.generateData();

let path = [];
let pos = {
    x: -1,
    y: -1
};

function generatePath() {
    // initial position
    pos.x = Math.floor(Math.random() * tile.data.length);
    pos.y = Math.floor(Math.random() * tile.data.length);

    path.push(pos);
    
    iteration();
}
generatePath();

function iteration() {
    // console.log(i, path.length, tile.data.length * tile.data[0].length);
    if(path.length < tile.data.length * tile.data[0].length) {
        //console.log(i);
        ++i;

        let possible = getPossibleMoves(pos.x, pos.y, ignoreMove);

        if(possible != false) {
            // console.log("regular move");
            ignoreMove = [-1, -1];
            let newMove = Math.floor(Math.random() * possible.length);

            // set new position
            pos.x = possible[newMove][0];
            pos.y = possible[newMove][1];

            // add new position to path
            path.push([pos.x, pos.y]);

            // remove new position from available positions
            tile.data[pos.x][pos.y] = 1;
        }
        // backtracking
        else {
            backTracking = true;
            // console.log("backtracking");
            // when backtracking ignore tile in before
            ignoreMove = [pos.x, pos.y];
            // console.log("ignore should be " + ignoreMove);

            // remove last movement of path
            path.pop();

            // make removed part of path availible as a move
            tile.data[pos.x][pos.y] = 0;
            setBackToValidMoves.push([pos.x, pos.y])

            // update position
            pos.x = path[path.length - 1][0];
            pos.y = path[path.length - 1][1];
        }

        renderPath();

        // no delay for maze mode or if backtracking
        if(mazeMode/* || possible == false*/)
            window.setTimeout(iteration, 0);
        else
            window.setTimeout(iteration, 200);
    }
}

function getPossibleMoves(x, y, ignoreMove) {
    let left = true;
    let right = true;
    let up = true;
    let down = true;

    // console.log("pos " + x + ", " + y);
    console.log("ignore " + ignoreMove);
    


    // edge case
    if(y == 0)
        up = false;
    // already moved into case
    else if(tile.data[x][y - 1] == 1 || tile.data[x][y - 1] == ignoreMove[1])
        up = false
    
    // edge case
    if(y >= tile.data[0].length - 1)
        down = false;
    // already moved into case
    else if(tile.data[x][y + 1] == 1 || tile.data[x][y + 1] == ignoreMove[1])
        down = false
    
    // edge case
    if(x == 0)
        left = false;
    // already moved into case
    else if(tile.data[x - 1][y] == 1 || tile.data[x - 1][y] == ignoreMove[0])
        left = false;
    
    // edge case
    if(x >= tile.data.length - 1)
        right = false;
    // already moved into case
    else if(tile.data[x + 1][y] == 1 || tile.data[x + 1][y] == ignoreMove[0])
        right = false;
    
    let possible = [];
    if(left)
        possible.push([x - 1, y]);
    if(right)
        possible.push([x + 1, y]);
    if(up)
        possible.push([x, y - 1]);
    if(down)
        possible.push([x, y + 1]);
    
    //console.log(path.length, tile.data.length * tile.data[0].length);
    // normal move
    if(possible.length > 0)
        return possible;
    // entire board is filled
    else
        return false;
}

function renderBackground() {
    r.clearRect(0, 0, w, h);

    r.fillStyle = "#3498DB";
    let sizeTimes = 0.5

    for(let i = 0; i < tile.data.length; i++) {
        for(let j = 0; j < tile.data[0].length; j++) {
            r.fillRect(i * tile.size, j * tile.size, 
                tile.size * sizeTimes, tile.size * sizeTimes);
        }
    }
}

function renderPath() {
    r.strokeStyle = tile.pathColor;
    r.lineWidth = 5;
    let offset = tile.size / 4;

    r.clearRect(0, 0, w, h);

    if(showBackground)
        renderBackground();

    for(let i = 0; i < path.length - 1; i++) {
        r.beginPath();

        r.moveTo(
            // x
            (path[[i]][0] * tile.size) + 
            offset, 
            // y
            (path[i][1] * tile.size) + 
            offset
            );

        r.lineTo(
            // x
            (path[[i + 1]][0] * tile.size) +
            offset, 
            // y
            (path[i + 1][1] * tile.size) + 
            offset
            );
        
        r.stroke();

        r.closePath();
    }
}
