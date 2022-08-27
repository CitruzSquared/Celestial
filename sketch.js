class innerPlanet {
    constructor(period, radius, offset, h, s, b, thickness) {
        this.period = period;
        this.radius = radius;
        this.offset = offset;
        this.h = h;
        this.s = s;
        this.b = b;
        this.thickness = thickness;
    }

    calculateElongation(t) {
        let s = 360 / this.period * t + 360 / this.period * this.offset;
        let x = atan2(R * cos(90 - sunEclipticPosition) - this.radius * cos(s - 90), R * sin(90 - sunEclipticPosition) + this.radius * sin(s - 90));
        return x;
    }

    drawPlanet() {
        strokeWeight(this.thickness);
        stroke(this.h, this.s, this.b);
        point(celestialRadius * cos(this.calculateElongation(time)), 0, celestialRadius * sin(this.calculateElongation(time)));
    }
}

class outerPlanet {
    constructor(period, radius, offset, h, s, b, thickness) {
        this.period = period;
        this.radius = radius;
        this.offset = offset;
        this.h = h;
        this.s = s;
        this.b = b;
        this.thickness = thickness;
    }

    calculateElongation(t) {
        let s = 360 / this.period * t + 360 / this.period * this.offset;
        let x = atan2(R * cos(sunEclipticPosition) - this.radius * sin(s), this.radius * cos(s) - R * cos(sunEclipticPosition));
        return (180 - x + 180) % 360 - 180;
    }

    drawPlanet() {
        strokeWeight(this.thickness);
        stroke(this.h, this.s, this.b);
        point(celestialRadius * cos(this.calculateElongation(time)), 0, celestialRadius * sin(this.calculateElongation(time)));
    }
}

class Star {
    constructor(rightAscension, declination, magnitude) {
        this.rightAscension = rightAscension;
        this.declination = declination;
        this.magnitude = magnitude;
    }

    drawStar() {
        switch (floor(this.magnitude)) {
            case -2:
                stroke(0, 0, 100);
                break;
            case -1:
                stroke(0, 50, 100);
                break;
            case 0:
                stroke(0, 100, 100);
                break;
            case 1:
                stroke(30, 100, 100);
                break;
            case 2:
                stroke(60, 100, 100);
                break;
            case 3:
                stroke(90, 100, 100);
                break;
            case 4:
                stroke(180, 100, 100);
                break;
            case 5:
                stroke(210, 100, 100);
                break;
            case 6:
                stroke(240, 100, 100);
                break;
        }
        strokeWeight(size * sqrt(pow(pow(100, 0.2), -this.magnitude)));
        let x = celestialRadius * sin(180 + this.rightAscension) * cos(this.declination);
        let y = -celestialRadius * sin(this.declination);
        let z = -celestialRadius * cos(180 + this.rightAscension) * cos(this.declination);
        point(x, y, z);
    }
}
function setup() {
    createCanvas(windowWidth * 4 / 5, windowHeight, WEBGL);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 100);
    console.log(starListtext.length);
    for (let i = 0; i < starListtext.length; i++) {
        let values = split(starListtext[i], " ");
        let star = new Star(values[0], values[1], values[2]);
        starList.push(star);
        star.drawStar();
    }
    console.log(starList.length);
    camera = createCamera();

    fovlabel = createElement("h5", "FOV Level");
    fovlabel.position(windowWidth - 235, -5);
    fovnumber = createElement("h5", "FOV: " + 60 + "˚");
    fovnumber.position(windowWidth - 235, 20);
    fovslider = createSlider(5, 100, 60, 5);
    fovslider.position(windowWidth - 160, 15);
    fovslider.style('width', '120px');

    speedlabel = createElement("h5", "Speed");
    speedlabel.position(windowWidth - 235, 60);
    speedslider = createSlider(0, 10, 2, 1);
    speedslider.position(windowWidth - 185, 80);
    speednumber = createElement("h5", "Speed: 1 spf");
    speednumber.position(windowWidth - 235, 85);
    speedslider.style('width', '120px');

    h = createCheckbox("Show Horizon", true);
    h.position(windowWidth - 235, 150);
    hm = createCheckbox("Show Horizon Meridians", true);
    hm.position(windowWidth - 235, 170);
    e = createCheckbox("Show Equator", true);
    e.position(windowWidth - 235, 200);
    em = createCheckbox("Show Equator Meridians", false);
    em.position(windowWidth - 235, 220);
    E = createCheckbox("Show Ecliptic", true);
    E.position(windowWidth - 235, 250);
    Em = createCheckbox("Show Ecliptic Meridians", false);
    Em.position(windowWidth - 235, 270);

    latinput = createInput();
    latinput.position(windowWidth - 235, 330);
    latinput.size(80);
    latbutton = createButton("Enter Latitude");
    latbutton.position(latinput.x + latinput.width, 330);
    latbutton.mousePressed(updateLatitude);

    tiltinput = createInput();
    tiltinput.position(windowWidth - 235, 350);
    tiltinput.size(80);
    tiltbutton = createButton("Enter Axial Tilt");
    tiltbutton.position(tiltinput.x + tiltinput.width, 350);
    tiltbutton.mousePressed(updateTilt);

    timeinput = createInput();
    timeinput.position(windowWidth - 235, 370);
    timeinput.size(80);
    timebutton = createButton("Enter Time (days)");
    timebutton.position(timeinput.x + timeinput.width, 370);
    timebutton.mousePressed(updateTime);

    yearinput = createInput();
    yearinput.position(windowWidth - 235, 390);
    yearinput.size(80);
    yearbutton = createButton("Days in a year");
    yearbutton.position(yearinput.x + yearinput.width, 390);
    yearbutton.mousePressed(updateYear);

    latnum = createElement("h5", "Latitude: 30˚");
    latnum.position(windowWidth - 235, 410);
    tiltnum = createElement("h5", "Axial Tilt: 23˚");
    tiltnum.position(windowWidth - 235, 430);
    timenum = createElement("h5", "Time: 0.5 days");
    timenum.position(windowWidth - 235, 450);
    yearnum = createElement("h5", "Year Length: 365 days");
    yearnum.position(windowWidth - 235, 470);

    sizelabel = createElement("h5", "Size");
    sizelabel.position(windowWidth - 235, 490);
    sizeslider = createSlider(10, 70, 40, 6);
    sizeslider.position(windowWidth - 185, 510);
}

function preload() {
    starListtext = loadStrings("starList.txt");
}
let starListtext = [];
var fovlabel, fovnumber, fovslider;
var speedlabel, speednumber, speedslider;
var h, hm, e, em, E, Em;
var latinput, latbutton;
var tiltinput, tiltbutton;
var timeinput, timebutton;
var yearinput, yearbutton;
var latnum, tiltnum, timenum, yearnum;
var sizelabel, sizeslider;

let time = 0.5;
let year = 365;
let realtime = 360 / (3600 * 24);
let angle = 0;
let celestialRadius = 1000;
let starList = [];
let latitude = 35;
let tilt = 23;
let size = 40;

let siderealTime;

let speed = 360 / (24 * 3600);
let opacity = 50;

let showHorizon = true;
let showHorizonMeridians = true;
let showEquator = true;
let showEquatorMeridians = false;
let showEcliptic = true;
let showEclipticMeridians = false;

let sunEclipticPosition = 0
let R = 126.096;
let planetA = new innerPlanet(169.0587391, 86.4136, 13.15, 0, 50, 100, 30);
let planetC = new outerPlanet(543.7880553, 188.297, -60.31, 90, 50, 100, 30);
let planetD = new outerPlanet(2934.3, 579.286, -1366.08, 200, 50, 100, 30);
let planetE = new outerPlanet(7716.6, 1036.74, 1654.1, 300, 50, 100, 30);

function draw() {
    siderealTime = (time - 0.5) * (year + 1) / (year) - floor((time - 0.5) * (year + 1) / (year));
    angle = siderealTime * 360;
    showHorizon = h.checked();
    showHorizonMeridians = hm.checked();
    showEquator = e.checked();
    showEquatorMeridians = em.checked();
    showEcliptic = E.checked();
    showEclipticMeridians = Em.checked();

    background(0);
    let fov = fovslider.value();
    fovnumber.html("FOV: " + fov + "˚");
    size = sizeslider.value();
    speed = 1 / 86400 * pow(2, speedslider.value() - 2);
    speednumber.html("Speed: " + pow(2, speedslider.value() - 2) + " spf");
    if (speedslider.value() === 0) {
        speed = 0;
        speednumber.html("Speed: Paused");
    }
    latnum.html("Latitude: " + latitude + "˚");
    tiltnum.html("Axial Tilt: " + tilt + "˚");
    timenum.html("Time: " + round(time * 1000) / 1000 + " days");
    yearnum.html("Year Length: " + year + " days");
    perspective(fov);
    orbitControl(-fov / 60, -fov / 60, 0);
    //equator
    if (showEquator) {
        push();
        rotateX(180 - latitude);
        noStroke();
        fill(190, 50, 100);
        torus(celestialRadius, 2, 40);
        pop();
    }

    //horizon
    if (showHorizon) {
        push();
        rotateX(90);
        noStroke();
        fill(0, 50, 100);
        torus(celestialRadius, 2, 40);
        pop();
    }
    //Horizon meridians
    if (showHorizonMeridians) {
        push();
        fill(0, 50, 100, opacity);
        torus(celestialRadius, 2, 40);
        push();
        rotateY(90);
        torus(celestialRadius, 2, 40);
        pop();
        pop();
    }
    //camera(0, 0, (height / 2) / (fov / 2), 0, 0, 0, 0, 1, 0);

    push(); //start rotation of the earth
    rotateX(90 - latitude);
    rotateY(-angle);
    //Equator meridians
    if (showEquatorMeridians) {
        push();
        rotateX(90);
        fill(190, 50, 100, opacity);
        rotateX(90);
        if (!showEclipticMeridians) {
            torus(celestialRadius, 2, 40);
        }
        push();
        rotateY(90);
        torus(celestialRadius, 2, 40);
        pop();

        pop();
    }
    //ecliptic
    if (showEcliptic) {
        push();
        rotateY(180);
        rotateY(90);
        rotateX(90 - tilt);
        noStroke();
        fill(50, 50, 100);
        torus(celestialRadius, 2, 40);

        //sun
        rotateX(90);


        stroke(30, 100, 100);
        strokeWeight(40);
        point(celestialRadius * cos(sunEclipticPosition), 0, celestialRadius * sin(sunEclipticPosition));
        planetA.drawPlanet();
        planetC.drawPlanet();
        planetD.drawPlanet();
        planetE.drawPlanet();
        pop();
    }
    if (showEclipticMeridians) { //ecliptic meridians
        push();
        rotateY(180);
        rotateY(90);
        rotateX(90 - tilt);
        fill(50, 50, 100, opacity);
        rotateX(90);
        torus(celestialRadius, 2, 40);
        push();
        rotateY(90);
        torus(celestialRadius, 2, 40);
        pop();
        pop();
    }
    for (let i = 0; i < starList.length; i++) {
        starList[i].drawStar();
    }
    pop();  //end rotation of the earth
    time += speed;

    sunEclipticPosition = (time % year) / year * 360;
}

function updateLatitude() {
    latitude = latinput.value();
    latinput.value("");
}

function updateTilt() {
    tilt = tiltinput.value();
    tiltinput.value("");
}

function updateTime() {
    let x = timeinput.value();
    time = x - 1;
    time++;
    timeinput.value("");
}

function updateYear() {
    year = yearinput.value();
    yearinput.value("");
}