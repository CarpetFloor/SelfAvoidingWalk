let c = document.getElementById("canvas");
let r = c.getContext("2d");
c.width = 500;
c.height = c.width;
let w = c.width;
let h = c.height;
let i = 0;
let max = 500;

let tile = {
    size: w / 25,
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
    x: 1.234,
    y: 4.321
};

function generatePath() {
    // initial position
    pos.x = Math.floor(Math.random() * tile.data.length);
    pos.y = Math.floor(Math.random() * tile.data.length);

    path.push(pos);
    
    renderBackground();
    iteration();
}
generatePath();

function iteration() {
    if(i < max) {
        console.log(i);
        ++i;

        let possible = getPossibleMoves(pos.x, pos.y);

        if(possible != false) {
            let newMove = Math.floor(Math.random() * possible.length);

            // set new position
            pos.x = possible[newMove][0];
            pos.y = possible[newMove][1];

            // add new position to path
            path.push([pos.x, pos.y]);

            // remove new position from available positions
            tile.data[pos.x][pos.y] = 1;

            renderPath(i == 0);

            window.setTimeout(iteration, 50);
        }
    }
}

function getPossibleMoves(x, y) {
    let left = true;
    let right = true;
    let up = true;
    let down = true;
    
    // edge case
    if(y == 0)
        up = false;
    // already moved into case
    else if(tile.data[x][y - 1] == 1)
        up = false
    
    // edge case
    if(y >= tile.data[0].length - 1)
        down = false;
    // already moved into case
    else if(tile.data[x][y + 1] == 1)
        down = false
    
    // edge case
    if(x == 0)
        left = false;
    // already moved into case
    else if(tile.data[x - 1][y] == 1)
        left = false;
    
    // edge case
    if(x >= tile.data.length - 1)
        right = false;
    // already moved into case
    else if(tile.data[x + 1][y] == 1)
        right = false;

    // do backtracking

    
    let possible = [];
    if(left)
        possible.push([x - 1, y]);
    if(right)
        possible.push([x + 1, y]);
    if(up)
        possible.push([x, y - 1]);
    if(down)
        possible.push([x, y + 1]);
    
    if(possible.length > 0)
        return possible;
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

function renderPath(firstTime) {
    r.strokeStyle = "#3F51B5";
    r.lineWidth = 5;
    let offset = tile.size / 4;

    if(firstTime) {
        r.fillStyle = "#2ECC71";

        r.fillRect(
            // x
            (path[[path.length - 1]][0] * tile.size) + 
            0, 
            // y
            (path[path.length - 1][1] * tile.size) + 
            0, 
            // width
            tile.size / 2, 
            //height
            tile.size / 2
            )
    }

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
