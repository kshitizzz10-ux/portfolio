/**
 * Pipeline Canvas Background Animation
 * Simulates high-throughput streaming data packets passing through Lakehouse nodes
 */

(function () {
  const canvas = document.getElementById('pipeline-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let nodes = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initNodes();
  }

  function initNodes() {
    nodes = [];
    const count = Math.floor(width / 220) + 4;
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: (width / (count - 1)) * i + (Math.random() - 0.5) * 60,
        y: height * 0.35 + (Math.sin(i) * height * 0.25) + (Math.random() - 0.5) * 80,
        radius: Math.random() * 3 + 2.5,
        baseColor: i % 3 === 0 ? '#F59E0B' : (i % 3 === 1 ? '#94A3B8' : '#38BDF8'),
        pulse: 0
      });
    }
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.nodeIndex = 0;
      this.progress = 0;
      this.speed = 0.003 + Math.random() * 0.004;
      this.size = Math.random() * 2.5 + 1.5;
      this.color = ['#38BDF8', '#06B6D4', '#10B981', '#F59E0B', '#818CF8'][Math.floor(Math.random() * 5)];
      this.glow = Math.random() > 0.5;
    }

    update() {
      this.progress += this.speed;
      if (this.progress >= 1) {
        this.progress = 0;
        this.nodeIndex++;
        if (this.nodeIndex >= nodes.length - 1) {
          this.reset();
        }
      }
    }

    draw() {
      if (nodes.length < 2 || this.nodeIndex >= nodes.length - 1) return;

      const n1 = nodes[this.nodeIndex];
      const n2 = nodes[this.nodeIndex + 1];

      // Smooth cubic bezier or linear interpolation
      const x = n1.x + (n2.x - n1.x) * this.progress;
      const y = n1.y + (n2.y - n1.y) * this.progress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      if (this.glow) {
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.restore();
    }
  }

  // Floating background ambient particles
  class AmbientDust {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha})`;
      ctx.fill();
    }
  }

  let ambientDust = [];

  function init() {
    resize();
    particles = [];
    ambientDust = [];
    for (let i = 0; i < 40; i++) {
      particles.push(new Particle());
    }
    for (let i = 0; i < 50; i++) {
      ambientDust.push(new AmbientDust());
    }
    window.addEventListener('resize', resize);
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw ambient dust
    for (let dust of ambientDust) {
      dust.update();
      dust.draw();
    }

    // Draw connecting pipelines between nodes
    if (nodes.length > 1) {
      ctx.save();
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      for (let i = 0; i < nodes.length - 1; i++) {
        const n1 = nodes[i];
        const n2 = nodes[i + 1];
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();

        // Draw node markers
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fillStyle = n1.baseColor;
        ctx.fill();
      }
      ctx.restore();
    }

    // Update and draw streaming data packets
    for (let p of particles) {
      p.update();
      p.draw();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
