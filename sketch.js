function setup() {
    createCanvas(windowWidth * 3 / 4, windowHeight, WEBGL);
    angleMode(DEGREES);
}
let angle = 0;
let starList;
function preload() {
    starList = loadStrings("stars/starList.txt");
}
function draw() {
    background(0);
    let v = new p5.Vector(1, 1, 1);
    rotate(angle, v);
    rect(0, 0, 100, 100);
    angle++;
}