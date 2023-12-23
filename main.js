class clock {
    hour;
    minute;
    second;

    hourOffset;
    minuteOffset;
    secondOffset;

    constructor() {
        this.hourOffset = 7;
        this.minuteOffset = 0;
        this.secondOffset = 0;
    }

    update() {
        this.hour = Date.now() / 3.6e+6 % 12 + this.hourOffset;
        this.minute = Date.now() / 60000 % 60 + this.minuteOffset;
        this.second = Date.now() / 1000 % 60 + this.secondOffset;
    }
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d")

const Clock = new clock();
var mousePos = { x: 0, y: 0 };
var mouseDist = 0;
var scale = 0;
var radius = 0;
var angle = 0;

function drawLine(angle, start, end, strokeWidth = ctx.lineWidth) {
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 + Math.sin(angle)*start, canvas.height/2 - Math.cos(angle)*start);
    ctx.lineTo(canvas.width/2 + Math.sin(angle)*end, canvas.height/2 - Math.cos(angle)*end);
    ctx.stroke();
}

function drawPointer(angle) {
    var textX = canvas.width/2 + Math.sin(angle)*Math.sign(mousePos.y)*(radius*1.135);
    var textY = canvas.height/2 - Math.cos(angle)*Math.sign(mousePos.y)*(radius*1.135);
    var hour = Math.floor((angle/(Math.atan(0) + Math.PI) - 0.5 + 1*(mousePos.y > 0))/2 * 12 + 9) % 12;
    var minute = Math.floor((angle/(Math.atan(0) + Math.PI) - 0.5 + 1*(mousePos.y > 0))/(1/6) % 1 * 60) % 60;
    var time = "";

    ctx.lineWidth = scale/300;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 + Math.sin(angle)*Math.sign(mousePos.y)*(radius*0.95), canvas.height/2 - Math.cos(angle)*Math.sign(mousePos.y)*(radius*0.95));
    ctx.lineTo(canvas.width/2 + Math.sin(angle+0.05)*Math.sign(mousePos.y)*(radius), canvas.height/2 - Math.cos(angle+0.05)*Math.sign(mousePos.y)*(radius));
    ctx.lineTo(canvas.width/2 + Math.sin(angle+0.04)*Math.sign(mousePos.y)*(radius*1.3), canvas.height/2 - Math.cos(angle+0.04)*Math.sign(mousePos.y)*(radius*1.3));
    ctx.lineTo(canvas.width/2 + Math.sin(angle-0.04)*Math.sign(mousePos.y)*(radius*1.3), canvas.height/2 - Math.cos(angle-0.04)*Math.sign(mousePos.y)*(radius*1.3));
    ctx.lineTo(canvas.width/2 + Math.sin(angle-0.05)*Math.sign(mousePos.y)*(radius), canvas.height/2 - Math.cos(angle-0.05)*Math.sign(mousePos.y)*(radius));
    ctx.lineTo(canvas.width/2 + Math.sin(angle)*Math.sign(mousePos.y)*(radius*0.95), canvas.height/2 - Math.cos(angle)*Math.sign(mousePos.y)*(radius*0.95));
    ctx.fill();
    ctx.stroke();

    time += hour > 9? "" : "0";
    time += hour + ":";
    time += minute > 9? "" : "0";
    time += minute + " ";
    
    ctx.font = "20px Josefin Sans";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.save();
    ctx.translate(textX, textY)
    ctx.rotate(Math.PI*(angle > Math.PI) + angle - Math.PI/2);
    ctx.fillText(time, 0, 12/2);
    ctx.restore();
}

function load() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (canvas.width > canvas.height) {
        scale = canvas.height;
    } else {
        scale = canvas.width;
    }

    window.addEventListener('mousemove', (event) => {
        mousePos = { x: event.clientX - window.innerWidth/2 - scale*0.01, y: event.clientY - window.innerHeight/2 - scale*0.01};
    });
    setInterval(update, 1);
}

function update() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    mouseDist = Math.sqrt(mousePos.x*mousePos.x + mousePos.y*mousePos.y);
    
    if (canvas.width > canvas.height) {
        scale = canvas.height;
    } else {
        scale = canvas.width;
    }
    radius = scale*0.37;
    
    ctx.lineWidth = scale/200;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, radius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.lineWidth = scale/300;
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, radius*0.012, 0, 2 * Math.PI);
    ctx.fill();

    for (let i = 0; i <= 60; i++) {
        drawLine(i/60 * 2 * Math.PI, radius*0.9, radius*0.95);
    }

    for (let i = 0; i <= 12; i++) {
        drawLine(i/12 * 2 * Math.PI, radius*0.83, radius*0.95);
    }
    
    Clock.update();

    drawLine(Math.floor(Clock.second-30 + 0.5)/60 * 2 * Math.PI, 0, radius*0.8);
    drawLine(Clock.minute/60 * 2 * Math.PI, 0, radius*0.75, scale/250);
    drawLine(Clock.hour/12 * 2 * Math.PI, 0, radius*0.5, scale/200);

    if (mouseDist < radius*1.5) {
        var angle = -Math.atan(mousePos.x/mousePos.y) + Math.PI;
        drawPointer(angle);
    }
}