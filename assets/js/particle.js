class Particle {
    constructor() {
        this.ctx = document.querySelector("#whoawhoa").getContext("2d")
        this.canvas = document.querySelector("#whoawhoa")
    }

    setup() {
        this.resize()
        window.addEventListener('resize', this.resize)
    }

    createOne() {
        this.ctx.beginPath()
        this.ctx.fillStyle = `#${Math.floor(Math.random()*16777215).toString(16)}`
        this.ctx.arc(Math.random() * this.canvas.width, Math.random() * this.canvas.height, 4, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fill();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

export default Particle
