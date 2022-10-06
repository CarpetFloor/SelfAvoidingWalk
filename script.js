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
let showBackground = false;
// this was mistankenly discovered but
let mazeMode = true;
if(mazeMode)
    showBackground = false;

let tile = {
    size: w / 50,
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
    if(path.length < tile.data.length * tile.data[0].length) {
        console.log(i);
        ++i;

        // to not ignore any moves, because for backtracking only,
        // initialize as a position that is not valid;
        let ignoreMove = [-1, -1];

        let possible = getPossibleMoves(pos.x, pos.y, ignoreMove);

        if(possible != false) {
            let newMove = Math.floor(Math.random() * possible.length);

            // set new position
            pos.x = possible[newMove][0];
            pos.y = possible[newMove][1];

            // add new position to path
            path.push([pos.x, pos.y]);

            // remove new position from available positions
            tile.data[pos.x][pos.y] = 1;

            renderPath();
        }
        // backtracking
        else {
            console.log("backtracking");
            // when backtracking ignore tile in before
            ignoreMove = [pos.x, pos.y];

            // remove last movement of path
            path.pop();

            // make removed part of path availible as a move
            tile.data[pos.x][pos.y] = 1;

            // update position
            pos.x = path[path.length - 1][0];
            pos.y = path[path.length - 1][1];
        }

        if(mazeMode)
            window.setTimeout(iteration, 0);
        else
            window.setTimeout(iteration, 50);
    }
}

function getPossibleMoves(x, y, ignoreMove) {
    let left = true;
    let right = true;
    let up = true;
    let down = true;
    
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
    if(mazeMode) {
        r.strokeStyle = "#3F51B5";
        r.lineWidth = 5;
        let offset = tile.size / 4;

        r.moveTo(
            // x
            (path[[path.length - 2]][0] * tile.size) + 
            offset, 
            // y
            (path[path.length - 2][1] * tile.size) + 
            offset);
        
        r.lineTo(
            // x
            (path[[path.length - 1]][0] * tile.size) + 
            offset, 
            // y
            (path[path.length - 1][1] * tile.size) + 
            offset);
        
        r.stroke();
    }
    else {
        r.clearRect(0, 0, w, h);

        if(showBackground)
            renderBackground();
    }
}
