const canvas = document.getElementById('canvasOne');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let particles;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.width / 80) * (canvas.height / 80)
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
})
window.addEventListener('resize', ()=>{
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = (canvas.width / 80) * (canvas.height / 80);
    init();
})
window.addEventListener('mouseout', ()=>{
    mouse.x = undefined;
    mouse.y = undefined;
})


class Particles {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 4, false);
        ctx.fillStyle = 'greenyellow';
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0)
            this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0)
            this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;

        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x > canvas.width - this.size * 10)
                this.x += 10;
            if (mouse.x > this.x && this.x > this.size * 10)
                this.x -= 10;
            if (mouse.y > this.y && this.y > canvas.height - this.size * 10)
                this.y += 10;
            if (mouse.y > this.y && this.y > this.size * 10)
                this.y -= 10;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particles = [];
    let noOfParticles = (canvas.height * canvas.width) / 9000;

    for (let i = 0; i < noOfParticles * 2; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = 'white';

        particles.push(new Particles(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connect();
}

function connect() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            let distance = (( particles[i].x - particles[j].x) * (particles[i].x - particles[j].x))
            + ((particles[i].y - particles[j].y) * (particles[i].y - particles[j].y));
            if(distance < (canvas.width/7) * (canvas.height/7)){
                let opacity = 1-(distance/20000);
                ctx.strokeStyle = 'rgb(173, 255, 47,'+opacity+')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

init();
animate();