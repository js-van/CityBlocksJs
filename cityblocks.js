SCREEN_WIDTH = 1600;
SCREEN_HEIGHT = 900;

class Line {
	constructor(start, end) {
		this.start = start;
		this.end = end;
	}

	draw (ctx) {
		ctx.moveTo(...this.start);
		ctx.lineTo(...this.end);
	}
}

class GenNode {
	constructor(pos, exits) {
		this.pos = pos;
		this.exits = exits;
		this.branches = [];
	}

	createBranch(dir) {
		this.branches.push(dir);
	}
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomChoice(arr) {
	let ret = Math.floor(Math.random() * arr.length);
	return arr[ret];
}

let frontier = [];
let nodes = [];
let objects = [];

function branchesToLines(node) {
	let ends = [];
	let distance = getRandomInt(1,10) * 10;
	if (node.branches.indexOf('n') > -1)
        ends.push([node.pos[0], node.pos[1] - distance]);
    if (node.branches.indexOf('e') > -1)
        ends.push([node.pos[0] + distance, node.pos[1]]);
    if (node.branches.indexOf('s') > -1)
        ends.push([node.pos[0], node.pos[1] + distance]);
    if (node.branches.indexOf('w') > -1)
        ends.push([node.pos[0] - distance, node.pos[1]]);

    ends.forEach((end) => {
    	while (end[0] < 0) end[0] += 100;
    	while (end[0] > SCREEN_WIDTH) end[0] -= 100;
    	while (end[1] < 0) end[1] += 100;
		while (end[1] > SCREEN_HEIGHT) end[1] -= 100;
		if (getRandomInt(0,4) === 3) { // weights toward center of the screen for picking nodes
			let new_node = new GenNode([SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2], ['n', 's', 'e', 'w']);
			objects.push(new Line(node.pos, end, 3));
        	frontier.push(new_node);
		} else {
		    let new_node = new GenNode(end, ['n', 's', 'e', 'w']);
	        objects.push(new Line(node.pos, end, 3));
	        frontier.push(new_node);
    	}
    });
}

function pick_branches(node) {
    if (getRandomInt(0,10) > 8)
        return;
    for (i = 0; i < 3; i++) {
        node.createBranch(randomChoice(node.exits));
    }
}

function generate(steps) {
    let n = new GenNode([SCREEN_WIDTH/2, SCREEN_HEIGHT/2], ['n', 's', 'e', 'w'])
    frontier.push(n);

    let j = 0
    while (frontier.length > 0 && j < steps) {
        if (getRandomInt(0, 50) < 20)
            n = frontier.pop();
        else
            n = frontier.unshift();
        if (n instanceof GenNode) {
        	pick_branches(n);
        	branchesToLines(n);
        	j += 1;
    	}
    }

    if (frontier.length === 0)
        console.log("failed");
}

let canvas = document.getElementById('cityBlocks');
var ctx = "";
if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
	ctx.lineWidth = 2;
}

generate(2000);

let beforeDraw = performance.now();
console.log(beforeDraw);
for (i = 0; i < objects.length; i++) {
	objects[i].draw(ctx);
}
ctx.stroke();
console.log(performance.now() - beforeDraw);