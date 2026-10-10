/** Tiny pooled particle system. Flat solid squares, one colour, no glow. Max 48 live particles (Part 13.13). */
interface Particle { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number }

const MAX_PARTICLES = 48;

export class Sparks {
  private ctx: CanvasRenderingContext2D | null;
  private particles: Particle[] = [];
  private raf = 0;
  private last = 0;
  private dpr = Math.min(window.devicePixelRatio || 1, 2); // capped: sparks are small, extra pixels are waste
  private color = '#d4a83a';

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext('2d');
    this.fit();
    window.addEventListener('resize', this.fit);
  }

  private fit = () => {
    this.canvas.width = Math.round(window.innerWidth * this.dpr);
    this.canvas.height = Math.round(window.innerHeight * this.dpr);
    this.ctx?.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  };

  /** speed is in pixels per second; life in seconds. */
  burst(x: number, y: number, n = 36, o: { speed?: number; life?: number } = {}) {
    if (!this.ctx) return;
    this.color = getComputedStyle(document.documentElement).getPropertyValue('--bu-gold-500').trim() || this.color;
    const speed = o.speed ?? 420;
    const life = o.life ?? 0.9;
    for (let i = 0; i < n; i++) {
      if (this.particles.length >= MAX_PARTICLES) this.particles.shift();
      const a = Math.random() * Math.PI * 2;
      const v = (0.35 + Math.random() * 0.65) * speed;
      this.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: life * (0.6 + Math.random() * 0.6), r: 1.5 + Math.random() * 2.2 });
    }
    if (!this.raf) {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  private loop = (t: number) => {
    const ctx = this.ctx;
    if (!ctx) return;
    const dt = Math.min((t - this.last) / 1000, 0.033);
    this.last = t;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = this.color;
    this.particles = this.particles.filter((q) => q.life < q.max);
    for (const q of this.particles) {
      q.life += dt;
      const drag = Math.pow(0.04, dt); // ~0.96 per frame at 60fps
      q.vx *= drag;
      q.vy *= drag;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      ctx.globalAlpha = Math.max(0, 1 - q.life / q.max);
      ctx.fillRect(q.x - q.r, q.y - q.r, q.r * 2, q.r * 2);
    }
    ctx.globalAlpha = 1;
    if (this.particles.length) {
      this.raf = requestAnimationFrame(this.loop);
    } else {
      this.raf = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.particles = [];
    window.removeEventListener('resize', this.fit);
    this.canvas.width = 0; // releases the canvas backing store
  }
}
