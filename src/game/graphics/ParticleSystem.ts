interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  gravity: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  public update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += p.gravity * dt;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      ctx.restore();
    }
  }

  public emitDust(x: number, y: number, count: number = 4): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 16 - 8),
        y: y + (Math.random() * 4 - 2),
        vx: (Math.random() * 80 - 40),
        vy: -Math.random() * 40 - 10,
        size: Math.random() * 3 + 2,
        color: '#cbd5e1',
        life: 0.25,
        maxLife: 0.25,
        gravity: 120,
      });
    }
  }

  public emitGoldSparks(x: number, y: number, count: number = 8): void {
    const colors = ['#ffb703', '#ffd166', '#fff3b0'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 150 + 60;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.4,
        maxLife: 0.4,
        gravity: 200,
      });
    }
  }

  public emitFeathers(x: number, y: number, count: number = 7): void {
    const colors = ['#94a3b8', '#64748b', '#e2e8f0'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() * 140 - 70),
        vy: -Math.random() * 120 - 40,
        size: Math.random() * 3 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0.5,
        maxLife: 0.5,
        gravity: 250,
      });
    }
  }

  public emitWaterDroplets(x: number, y: number, count: number = 10): void {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + (Math.random() * 6 - 3),
        y,
        vx: (Math.random() * 60 - 30),
        vy: -Math.random() * 160 - 60,
        size: Math.random() * 3 + 1.5,
        color: '#38bdf8',
        life: 0.45,
        maxLife: 0.45,
        gravity: 400,
      });
    }
  }

  public reset(): void {
    this.particles = [];
  }
}
