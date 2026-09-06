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

export interface FloatingPopup {
  x: number;
  y: number;
  text: string;
  icon?: string;
  color: string;
  bgColor?: string;
  life: number;
  maxLife: number;
  vy: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private popups: FloatingPopup[] = [];

  public update(dt: number): void {
    // 1. Aggiornamento particelle fisiche
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

    // 2. Aggiornamento testi/badge fluttuanti arcade
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.life -= dt;
      if (pop.life <= 0) {
        this.popups.splice(i, 1);
        continue;
      }
      pop.y += pop.vy * dt;
      pop.vy *= Math.pow(0.45, dt);
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    // 1. Disegna particelle
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      ctx.restore();
    }

    // 2. Disegna Popup Fluttuanti Arcade (Nomi Collezionabili / Power-Up)
    for (const pop of this.popups) {
      const progress = 1 - pop.life / pop.maxLife;
      const alpha = pop.life < 0.35 ? pop.life / 0.35 : 1;

      // Pop-in elastico arcade
      let scale = 1;
      if (progress < 0.12) {
        scale = 0.6 + (progress / 0.12) * 0.55;
      } else if (progress < 0.25) {
        scale = 1.15 - ((progress - 0.12) / 0.13) * 0.15;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.translate(Math.round(pop.x), Math.round(pop.y));
      ctx.scale(scale, scale);

      const label = pop.icon ? `${pop.icon}  ${pop.text}` : pop.text;
      ctx.font = 'bold 12px "Outfit", "Segoe UI", system-ui, sans-serif';
      const textWidth = ctx.measureText(label).width;
      const pillWidth = textWidth + 20;
      const pillHeight = 24;
      const pillX = -pillWidth / 2;
      const pillY = -pillHeight / 2;

      // Sfondo pillola scuro semi-trasparente
      ctx.fillStyle = pop.bgColor || 'rgba(15, 23, 42, 0.90)';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 12);
      } else {
        ctx.rect(pillX, pillY, pillWidth, pillHeight);
      }
      ctx.fill();

      // Bordo illuminato al neon con colore del collezionabile
      ctx.strokeStyle = pop.color;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = pop.color;
      ctx.shadowBlur = 8;
      ctx.stroke();

      // Testo centrato con colore del collezionabile
      ctx.shadowBlur = 0;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = pop.color;
      ctx.fillText(label, 0, 0.5);

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

  public emitFloatingPopup(
    x: number,
    y: number,
    text: string,
    color: string = '#ffb703',
    icon?: string,
    duration: number = 1.35
  ): void {
    this.popups.push({
      x,
      y,
      text,
      icon,
      color,
      bgColor: 'rgba(15, 23, 42, 0.90)',
      life: duration,
      maxLife: duration,
      vy: -55,
    });
  }

  public reset(): void {
    this.particles = [];
    this.popups = [];
  }
}
