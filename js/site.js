var i = 0;
var width, height;
function Fish() {
    this.pos = p.createVector(p.random(0, width), p.random(0, height));
    this.angle = p.random(0, 360);
    this.color = Fish.colors[i++ % Fish.colors.length];
    this.pidAng = {
        lastError: null,
        kP: 0.01,
        kD: 0.3
    };
    this.pidFwd = {
        lastError: 0,
        kP: 1,
        kD: 1
    };
    this.target = p.createVector(p.random(0, width), p.random(0, height));
    if (this.pos.dist(this.target) < 50) {
        do {
            this.target = p.createVector(p.random(0, height), p.random(0, height));
        } while (this.pos.dist(this.target) < 100);
    }
    this.z = p.random(0, 1);
    this.startVel = 0.8;
    this.startAng = 1.0;
    this.velocity = this.startVel;
    this.maxAngularVelocity = this.startAng;
}
Fish.prototype.draw = function () {
    p.noStroke();
    p.fill(this.color);
    //pushMatrix();
    p.translate(this.pos.x, this.pos.y);
    p.rotate(this.angle);
    p.beginShape();
    p.vertex(-20, 30);
    p.vertex(0.1, 15);
    p.vertex(0.1, -15);
    p.vertex(-20, -30);
    p.endShape();
    p.bezier(0, 15, 100, 70, 100, -70, 0, -15);
    p.stroke(0);
    p.strokeWeight(10);
    p.point(60, 15);
    p.point(40, 15);
    p.strokeWeight(3);
    p.arc(46, 2, 19, 5, -180, 0);
    p.resetMatrix();

    var errorFwd = this.target.dist(this.pos);
    var dFwd = errorFwd - this.pidFwd.lastError;
    this.pidFwd.lastError = errorFwd;
    var speed = dFwd * this.pidFwd.kD + errorFwd * this.pidFwd.kP;
    speed = p.min(speed, this.velocity) * speed / p.abs(speed);
    var errorAng = p5.Vector.sub(this.pos, this.target).heading() - this.angle + 180;
    while (errorAng > 180) {
        errorAng -= 360;
    }
    while (errorAng < -180) {
        errorAng += 360;
    }
    if (this.pidAng.lastError === null) {
        this.pidAng.lastError = errorAng;

    }
    speed *= this.pos.dist(this.target) < 150 ? p.min(p.max(1 - p.abs(errorAng) / 120, 0.2 + this.pos.dist(this.target) / 150 * 0.8), 1) : 1;

    var dAng = errorAng - this.pidAng.lastError;
    dAng *= -1;
    this.pidAng.lastError = errorAng;
    var angSpeed = dAng * this.pidAng.kD + errorAng * this.pidAng.kP;
    angSpeed = p.min(p.abs(angSpeed), this.maxAngularVelocity) * (angSpeed / p.abs(angSpeed));

    var vel = p.createVector(speed, 0);
    vel.rotate(this.angle);
    this.angle += angSpeed;
    this.pos.add(vel);

    if (this.pos.dist(this.target) < 50) {
        do {
            this.target = p.createVector(p.random(0, width), p.random(0, height));
        } while (this.pos.dist(this.target) < 100);
        this.pidAng.lastError = null;
    }
    p.strokeWeight(5);
    p.stroke(79, 47, 0);
    p.point(this.target.x, this.target.y);
    this.z += 0.0005;
    this.velocity = this.startVel + (p.noise(this.z)) * this.startVel * 2;
    this.maxAngularVelocity = this.startAng + (p.noise(this.z)) * this.startAng;
};
var fishes;
//Just dont look in here
const s = pi => {
    p = pi;
    pi.setup = function () {
        pi.createCanvas(p.windowWidth, p.windowHeight);
        width = p.windowWidth;
        height = p.windowHeight;
        $("canvas").contextmenu(e => {
            e.preventDefault();

        });
        //AKA 20 fish on my monitor
        var fishCount = p.max(p.windowWidth * p.windowHeight / 1783680 * 20, 5);
        console.log(p.windowHeight * p.windowWidth, p.windowHeight, p.windowWidth, fishCount);
        fishes = [new Fish()];
        while (fishes.length <= fishCount) {
            fishes.push(new Fish());
        }
        p.angleMode(p.DEGREES);
    };
    Fish.colors = [
        p.color(0, 26, 255, 120),
        p.color(0, 120, 12, 120),
        p.color(255, 157, 0, 120),
        p.color(63, 138, 145, 120),
        p.color(255, 0, 200, 120),
        p.color(35, 135, 60, 120)
    ];


    pi.draw = function () {
        p.background(255);
        for (var i in fishes) {
            fishes[i].draw();
        }
        p.fill(0, 230, 255, 100);
        p.noStroke();
        p.rect(0, 0, width, height);
    };
    pi.mouseDragged = function () {
    }
    pi.mouseClicked = function (e) {


    }
    pi.mouseReleased = function (e) {
    };
};

