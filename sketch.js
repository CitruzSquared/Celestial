function setup() {
    createCanvas(windowWidth * 3 / 4, windowHeight, WEBGL);
    angleMode(DEGREES);
}
let angle = 0;
let starList;
let celestialRadius = 200;
function preload() {
    starList = loadStrings("starList.txt");
}
function draw() {
    background(0);
    for (let i = 0; i < starList.length; i++) {
        let values = split(starList[i], " ");
        let star = new Star(values[0], values[1], values[2]);
        star.drawStar();
    }
}

class Star {
    constructor(rightAscension, declination, magnitude) {
        this.rightAscension = rightAscension;
        this.declination = declination;
        this.magnitude = magnitude;
    }

    drawStar() {
        stroke(255);
        strokeWidth(20 * sqrt(pow(pow(100, 0.2), -this.magnitude)));
        point(celestialRadius * cos(this.rightAscension) * cos(this.declination), celestialRadius * sin(this.declination), -celestialRadius * cos(this.rightAscension) * cos(this.declination));
    }
}
