const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

document.addEventListener("keypress", keyPressHandler);
canvas.addEventListener("mousedown", mouseDownHandler);
canvas.addEventListener("contextmenu", contextMenuHandler);

function keyPressHandler(e) {
	/*
    if(e.key == "w") points[selectedPoint].y -= 10;
    if(e.key == "s") points[selectedPoint].y += 10;
    if(e.key == "a") points[selectedPoint].x -= 10;
    if(e.key == "d") points[selectedPoint].x += 10;
	*/
    if(e.key == "z") {
        selectedPoint--;
        if(selectedPoint < 0)
            selectedPoint = points.length - 1;
    }
    if(e.key == "x") {
        selectedPoint++;
        if(selectedPoint > points.length - 1)
            selectedPoint = 0;
    }  
}

function mouseDownHandler(e){
    const offsetX=canvas.offsetLeft;
    const offsetY=canvas.offsetTop;
    const mouseX = parseInt(e.clientX - offsetX);
    const mouseY = parseInt(e.clientY - offsetY);
    const p = new Point(mouseX, mouseY);
    if(e.button === 0) {
        //console.log("Down: "+ mouseX + " / " + mouseY);
        const distance = p.distance(points[selectedPoint]);
        points[selectedPoint].x += distance.x
        points[selectedPoint].y += distance.y
    }
    else if(e.button === 2) {
        points.push(p)
    }
}

function contextMenuHandler(e) {
    e.preventDefault()
}

var selectedPoint = 0;
const looped = true;

const getSplinePoint = function(t, looped) {
    var p0, p1, p2, p3;
    if(!looped) {
        p1 = Math.floor(t) + 1;
        p2 = p1 + 1;
        p3 = p2 + 1;
        p0 = p1 - 1;
    } else {
        p1 = Math.floor(t);
        p2 = (p1 + 1) % points.length;
        p3 = (p2 + 1) % points.length;
        p0 = p1 >= 1 ? p1 - 1 : points.length - 1;
    }

    t = t - Math.floor(t);

    var tt = t*t;
    var ttt = tt*t;

    var q1 = -ttt + 2*tt - t;
    var q2 = 3*ttt - 5*tt + 2;
    var q3 = -3*ttt + 4*tt + t;
    var q4 = ttt - tt;

    tx = 0.5 * (points[p0].x * q1 + points[p1].x * q2 + points[p2].x * q3 + points[p3].x * q4);
    ty = 0.5 * (points[p0].y * q1 + points[p1].y * q2 + points[p2].y * q3 + points[p3].y * q4);

    //tx = 1/2*( ( (-points[0].x + 3*points[1].x - 3*points[2].x + points[3].x)*t + (2*points[0].x - 5*points[1].x + 4*points[2].x - points[3].x) )*t +(-points[0].x + points[2].x) )*t + points[1].x
    //ty = 1/2*( ( (-points[0].y + 3*points[1].y - 3*points[2].y + points[3].y)*t + (2*points[0].y - 5*points[1].y + 4*points[2].y - points[3].y) )*t +(-points[0].y + points[2].y) )*t + points[1].y

    return new Point(tx, ty);
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(p) {
        return {x: this.x - p.x, y: this.y - p.y};
    }
}

var points = [new Point(100, 300), new Point(150, 300),
              new Point(200, 300), new Point(250, 300),
              new Point(300, 300), new Point(350, 300),
              new Point(400, 300), new Point(450, 300)];

const drawSpline = function() {
    context.save();
    for(t = 0.0; t < (looped ? points.length : (points.length - 3)); t += 0.001) {
        var pos = getSplinePoint(t, looped);
        context.fillStyle = "green";
        context.fillRect(pos.x, pos.y, 1, 1);
        //console.log(pos);
    }
    context.restore();
}

const drawPoint = function(pts) {
    for(i in pts) {
        context.save();
        context.translate(pts[i].x, pts[i].y);
        if(i == selectedPoint)
            context.fillStyle = "yellow";
        else
            context.fillStyle = "red";
        context.fillRect(-10, -10, 20, 20);
        context.font = "10px Tahoma";
        context.fillStyle = "black";
        context.fillText(i, -3, 3);
        context.restore();
    }
}

const update = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSpline()
    drawPoint(points);
}

//update()
setInterval(update, 1000/30);