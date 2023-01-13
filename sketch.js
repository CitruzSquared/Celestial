class innerPlanet {
    constructor(period, radius, offset, h, s, b, thickness) {
        this.period = period;
        this.radius = radius;
        this.offset = offset;
        this.h = h;
        this.s = s;
        this.b = b;
        this.thickness = thickness;
        this.synodic = year / (1 / (this.period / year) - 1);
    }

    calculateElongation(t) {
        let n = t % this.synodic;
        let s = 360 * n / this.period + 360 * this.offset / this.period;
        let x = atan2(R * cos(90 - sv(n)) - this.radius * cos(s - 90), R * sin(90 - sv(n)) + this.radius * sin(s - 90));
        return ((x - sunEclipticPosition(n)) + 180) % 360 - 180;
    }

    drawPlanet() {
        strokeWeight(this.thickness);
        stroke(this.h, this.s, this.b);
        point(celestialRadius * cos(sunEclipticPosition(time) + this.calculateElongation(time)), 0, celestialRadius * sin(sunEclipticPosition(time) + this.calculateElongation(time)));
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
        this.synodic = year / -(1 / (period / year) - 1);
    }

    calculateElongation(t) {
        let n = t % this.synodic;
        let s = 360 / this.period * n + 360 / this.period * this.offset;
        let x = atan2(R * sin(sv(n)) - this.radius * sin(s), this.radius * cos(s) - R * cos(sv(n)));
        let y = (180 - x + 180) % 360 - 180;
        return (y - sunEclipticPosition(n) + 180) % 360 - 180;
    }

    drawPlanet() {
        strokeWeight(this.thickness);
        stroke(this.h, this.s, this.b);
        point(celestialRadius * cos(sunEclipticPosition(time) + this.calculateElongation(time)), 0, celestialRadius * sin(sunEclipticPosition(time) + this.calculateElongation(time)));
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
        if (this.magnitude < magn) {
            strokeWeight(size * sqrt(pow(pow(100, 0.2), -this.magnitude)));
            let x = celestialRadius * sin(this.rightAscension) * cos(this.declination);
            let y = -celestialRadius * sin(this.declination);
            let z = celestialRadius * cos(this.rightAscension) * cos(this.declination);
            point(x, y, z);
        }
    }
}
function setup() {
    createCanvas(windowWidth * 4 / 5, windowHeight, WEBGL);
    angleMode(DEGREES);
    colorMode(HSB, 360, 100, 100, 100);
    for (let i = 0; i < starListtext.length; i++) {
        let values = split(starListtext[i], " ");
        let star = new Star(values[0], values[1], values[2]);
        starList.push(star);
        star.drawStar();
    }
    camera = createCamera();

    fovlabel = createElement("h5", "FOV Level");
    fovlabel.position(windowWidth - 235, -5);
    fovnumber = createElement("h5", "FOV: " + 60 + "˚");
    fovnumber.position(windowWidth - 235, 20);
    fovslider = createSlider(10, 180, 100, 5);
    fovslider.position(windowWidth - 160, 15);
    fovslider.style('width', '120px');

    speedlabel = createElement("h5", "Speed");
    speedlabel.position(windowWidth - 235, 60);
    speedslider = createSlider(-12, 12, 2, 1);
    speedslider.position(windowWidth - 185, 80);
    speednumber = createElement("h5", "Speed: 1 spf");
    speednumber.position(windowWidth - 235, 85);
    speedslider.style('width', '150px');

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
    latinput.position(windowWidth - 235, 320);
    latinput.size(80);
    latbutton = createButton("Enter Latitude");
    latbutton.position(latinput.x + latinput.width, 320);
    latbutton.mousePressed(updateLatitude);

    timeinput = createInput();
    timeinput.position(windowWidth - 235, 340);
    timeinput.size(80);
    timebutton = createButton("Enter Time (days)");
    timebutton.position(timeinput.x + timeinput.width, 340);
    timebutton.mousePressed(updateTime);

    latnum = createElement("h5", "Latitude: 30˚");
    latnum.position(windowWidth - 235, 360);
    tiltnum = createElement("h5", "Axial Tilt: 23˚");
    tiltnum.position(windowWidth - 235, 380);
    timenum = createElement("h5", "Time: 0, 12:00:00 (0.5000 dy)");
    timenum.position(windowWidth - 235, 400);
    yearnum = createElement("h5", "Year Length: 298 days");
    yearnum.position(windowWidth - 235, 440);

    sizelabel = createElement("h5", "Size");
    sizelabel.position(windowWidth - 235, 460);
    sizeslider = createSlider(10, 60, 20, 5);
    sizeslider.position(windowWidth - 185, 480);

    magnlabel = createElement("h5", "Limiting Magnitude");
    magnlabel.position(windowWidth - 235, 480);
    magnslider = createSlider(-2, 6, 4.5, 0.5);
    magnslider.position(windowWidth - 185, 520);
}

function preload() {
    starListtext = loadStrings("starList.txt");
}
let starListtext = [];
var fovlabel, fovnumber, fovslider;
var speedlabel, speednumber, speedslider;
var h, hm, e, em, E, Em;
var latinput, latbutton;
var timeinput, timebutton;
var yearinput, yearbutton;
var latnum, tiltnum, timenum, yearnum;
var sizelabel, sizeslider;
var magnlabel, magnslider;

let time = 0.5;
let year = 298;
let realtime = 360 / (3600 * 24);
let angle = 0;
let celestialRadius = 2000;
let starList = [];
let latitude = 40.8;
let tilt = 24.7;
let size = 20;
let magn = 4.5;

let siderealTime;

let speed = 360 / (24 * 3600);
let opacity = 50;

let showHorizon = true;
let showHorizonMeridians = true;
let showEquator = true;
let showEquatorMeridians = false;
let showEcliptic = true;
let showEclipticMeridians = false;

let R = 126.096;
let lunarObliquity = 4.92;
let moonSynodic = 298 / (12 + 5 / 18);
let moonPeriod = (year * moonSynodic) / (year + moonSynodic);
let moonoffset = -(-78 / moonPeriod + 78 / year) * moonPeriod;
let nodalPrecessionPerYear = 15.42840432988;
let nodalPrecessionPeriod = 360 / nodalPrecessionPerYear * 298;
let nodalPrecessionOffset = 81.6675511647;
let planetA = new innerPlanet(169.0587391, 86.4136, 13.15, 0, 50, 100, 35);
let planetC = new outerPlanet(543.7880553, 188.297, -60.31, 90, 50, 100, 30);
let planetD = new outerPlanet(2934.3, 579.286, -1366.08, 200, 50, 100, 25);
let planetE = new outerPlanet(7716.6, 1036.74, 1654.1, 300, 50, 100, 20);

let moonRadius = 2260.113;
let earthRadius = 5512;
let sunRadius = 673320;
let moonDistance = 294000.241;
let sunDistance = 126096000;
let moonAngularRad = Math.atan(moonRadius / moonDistance);
let earthUmbra = Math.atan((sunRadius - (sunRadius - earthRadius) * (sunDistance + moonDistance) / sunDistance) / moonDistance);
let earthPenumbra = Math.atan(((sunRadius + earthRadius) * (sunDistance + moonDistance) / sunDistance - sunRadius) / moonDistance)
let umbral = Math.abs((earthUmbra - moonAngularRad)) * 180 / Math.PI;
let partial = (moonAngularRad + earthUmbra) * 180 / Math.PI;
let penumbral = (moonAngularRad + earthPenumbra) * 180 / Math.PI;

let comet_semi_major = 2088.58;
let comet_time_offset = 147;
let comet_period = 20088.1975777;
let eccentricity = 0.95;

let LON = 265.52 * Math.PI / 180;
let AOP = 67.413 * Math.PI / 180;
let inc = 51.721 * Math.PI / 180;

let matrix_1 = Math.cos(LON) * Math.cos(AOP) - Math.sin(LON) * Math.cos(inc) * Math.sin(AOP);
let matrix_2 = -Math.cos(LON) * Math.sin(AOP) - Math.sin(LON) * Math.cos(inc) * Math.cos(AOP);
let matrix_3 = Math.sin(LON) * Math.cos(AOP) + Math.cos(LON) * Math.cos(inc) * Math.sin(AOP);
let matrix_4 = -Math.sin(LON) * Math.sin(AOP) + Math.cos(LON) * Math.cos(inc) * Math.cos(AOP);
let matrix_5 = Math.sin(inc) * Math.sin(AOP);
let matrix_6 = Math.sin(inc) * Math.cos(AOP);

function draw() {
    day = time % year;
    siderealTime = (day) * (year + 1) / (year) - floor((day) * (year + 1) / (year));
    angle = siderealTime * 360 + 180;
    showHorizon = h.checked();
    showHorizonMeridians = hm.checked();
    showEquator = e.checked();
    showEquatorMeridians = em.checked();
    showEcliptic = E.checked();
    showEclipticMeridians = Em.checked();
    magn = magnslider.value();
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
    else if (speedslider.value() < 0) {
        speed = -1 / 86400 * pow(2, -speedslider.value() - 2);
        speednumber.html("Speed: " + -1 * pow(2, -speedslider.value() - 2) + " spf");
    }
    if (speedslider.value() >= 12) {
        speed = pow(2, speedslider.value() - 12);
        speednumber.html("Speed: " + pow(2, speedslider.value() - 12) + " dpf");
    }
    else if (speedslider.value() <= -12) {
        speed = -pow(2, -speedslider.value() - 12);
        speednumber.html("Speed: " + -1 * pow(2, -speedslider.value() - 12) + " dpf");
    }
    latnum.html("Latitude: " + latitude + "˚");
    tiltnum.html("Axial Tilt: " + tilt + "˚");
    let date = floor(time);
    let hour = floor(24 * (time - date));
    let minute = floor(60 * ((24 * (time - date)) - hour));
    let second = floor(60 * ((60 * ((24 * (time - date)) - hour)) - minute))
    timenum.html("Time: " + date + ", " + ("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) + ":" + ("0" + second).slice(-2) + " (" + time.toFixed(3) + " dy)");
    yearnum.html("Year Length: " + year + " days");
    perspective(fov * height / width, width / height, -10000, 10000);
    orbitControl(-fov / 100, -fov / 100, 0);
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


        stroke(45, 100, 100);
        strokeWeight(45);
        point(celestialRadius * cos(sunEclipticPosition(time)), 0, celestialRadius * sin(sunEclipticPosition(time)));
        planetA.drawPlanet();
        planetC.drawPlanet();
        planetD.drawPlanet();
        planetE.drawPlanet();

        //comet
        stroke(220, 100, 60);
        strokeWeight(20);
        let comet_coords = comet_perifocal(time);
        let comet_ecliptic_coords = comet_ecliptic([comet_coords[0], comet_coords[1]]);
        let earth_ecliptic_coords = earth_ecliptic(time);
        let comet_x = -comet_ecliptic_coords[0] + earth_ecliptic_coords[0];
        let comet_y = -comet_ecliptic_coords[1] + earth_ecliptic_coords[1];
        let comet_z = -comet_ecliptic_coords[2];
        let dist = sqrt(comet_x * comet_x + comet_y * comet_y + comet_z * comet_z);
        console.log(dist);
        let M = 0;
        let K = 4;
        let brightness = M + 2.5 * K * Math.log10(comet_coords[2] / R) + 5 * Math.log10(dist / R);
        if (brightness < 2) {
            stroke(50, 20, 100);
        }
        else if (brightness < 6.5) {
            stroke(50, 30, 60);
        }
        console.log("Mag: " + brightness);
        comet_x = comet_x / dist * celestialRadius;
        comet_y = comet_y / dist * celestialRadius;
        comet_z = comet_z / dist * celestialRadius;
        point(comet_x, comet_z, comet_y);
        rotateX(-90);

        push(); //moon
        rotateZ((((time + 78) % nodalPrecessionPeriod) + nodalPrecessionOffset) * 360 / nodalPrecessionPeriod);
        rotateY(lunarObliquity);
        noStroke();
        fill(240, 50, 100);
        let moonPos = (calculateMoonPosition(time) + sunEclipticPosition(time) + 180) % 360 - 180;
        let moonfull = (calculateMoonPosition(time) + 180) % 360 - 180;
        let diff1 = min(abs((moonPos - calculateNodePosition(time))) % 360, abs(360 - abs((moonPos - calculateNodePosition(time))) % 360)); //ascending

        let shadowPos = (sunEclipticPosition(time) + 180 + 180) % 360 - 180
        let fullness = min(abs((moonfull - 180)), abs((moonfull + 180)));

        let deltaLongitude = (abs(moonPos - shadowPos) % 360);
        let moonLatitude = asin(sin(lunarObliquity) * sin(diff1));
        let distance = abs((acos(cos(moonLatitude) * cos(deltaLongitude)) + 180) % 360 - 180)

        torus(celestialRadius, 2, 40);
        rotateZ(-(((time + 78) % nodalPrecessionPeriod) + nodalPrecessionOffset) * 360 / nodalPrecessionPeriod);
        rotateX(90);
        stroke(240, 50, 100);
        if (distance < umbral) {
            stroke(0, 80, 80);
        }
        else if (distance < partial) {
            stroke(0, 50, 60);
        }
        else if (distance < penumbral) {
            stroke(0, 0, 60);
        }
        else if (fullness <= 7.5) {
            stroke(50, 50, 100);
        }
        strokeWeight(45);
        point((celestialRadius) * cos(sunEclipticPosition(time) + calculateMoonPosition(time)), 0, (celestialRadius) * sin(sunEclipticPosition(time) + calculateMoonPosition(time)));
        pop();

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
}
function sunEclipticPosition(t) {
    return (sv(t) + 180) % 360 - 180;
}
function sv(t) {
    return 360 / year * (t % year);
}
function calculateMoonPosition(t) {
    let n = t % moonSynodic;
    let s = 360 / moonPeriod * (n + moonoffset);
    let m = (s + 180) % 360 - 180;
    return (m - sunEclipticPosition(n) + 180) % 360 - 180;
}

function calculateNodePosition(t) {
    let node = (((t + 78) % nodalPrecessionPeriod) + nodalPrecessionOffset) * 360 / nodalPrecessionPeriod + 90;
    return -((node + 180) % 360 - 180);
}

function updateLatitude() {
    latitude = latinput.value();
    latinput.value("");
}

function updateTime() {
    let x = timeinput.value();
    time = x - 1;
    time++;
    timeinput.value("");
}
function comet_perifocal(t) {
    let n = (t - comet_time_offset) % comet_period;
    let mean_anomaly = (2 * Math.PI) / comet_period * n;
    let eccentric_anomaly = calc_eccentric_anomaly(mean_anomaly, mean_anomaly);
    eccentric_anomaly = calc_eccentric_anomaly(eccentric_anomaly, mean_anomaly);
    eccentric_anomaly = calc_eccentric_anomaly(eccentric_anomaly, mean_anomaly);
    eccentric_anomaly = calc_eccentric_anomaly(eccentric_anomaly, mean_anomaly);
    let P = Math.tan(eccentric_anomaly / 2) * Math.sqrt((1 + eccentricity) / (1 - eccentricity));
    let true_anomaly = 2 * Math.atan(P);
    let comet_distance = comet_semi_major * (1 - eccentricity * Math.cos(eccentric_anomaly));
    return [comet_distance * Math.cos(true_anomaly), comet_distance * Math.sin(true_anomaly), comet_distance]
}

function comet_ecliptic(arr) {
    let x = matrix_1 * arr[0] + matrix_2 * arr[1];
    let y = matrix_3 * arr[0] + matrix_4 * arr[1];
    let z = matrix_5 * arr[0] + matrix_6 * arr[1];
    return [x, y, z]
}

function earth_ecliptic(t) {
    let s = sv(t) * Math.PI / 180;
    return [R * Math.cos(s), R * Math.sin(s), 0]
}

function calc_eccentric_anomaly(E, M) {
    return E - (E - eccentricity * Math.sin(E) - M) / (1 - eccentricity * Math.cos(E));
}