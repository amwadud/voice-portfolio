// ===== MAGNETIC CURSOR =====
class MagneticCursor {
  constructor() {
    this.cursorDot = document.querySelector('.cursor-dot');
    this.cursorFollower = document.querySelector('.cursor-follower');
    this.mouseX = 0;
    this.mouseY = 0;
    this.followerX = 0;
    this.followerY = 0;
    
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.cursorDot.style.left = e.clientX + 'px';
      this.cursorDot.style.top = e.clientY + 'px';
    });

    this.animate();
    
    // Magnetic effect for elements
    document.querySelectorAll('.magnetic-element').forEach(el => {
      el.addEventListener('mouseenter', () => this.magnetize(el));
      el.addEventListener('mouseleave', () => this.demagnetize(el));
      el.addEventListener('mousemove', (e) => this.updateMagnet(el, e));
    });
  }

  animate() {
    const dx = this.mouseX - this.followerX;
    const dy = this.mouseY - this.followerY;
    
    this.followerX += dx * 0.1;
    this.followerY += dy * 0.1;
    
    this.cursorFollower.style.left = this.followerX + 'px';
    this.cursorFollower.style.top = this.followerY + 'px';
    
    requestAnimationFrame(() => this.animate());
  }

  magnetize(el) {
    el.style.transition = 'transform 0.3s ease-out';
  }

  demagnetize(el) {
    el.style.transform = 'translate(0, 0)';
  }

  updateMagnet(el, e) {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;
    
    el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  }
}

if (window.matchMedia('(pointer: fine)').matches) {
  new MagneticCursor();
}

// ===== AUDIO VISUALIZER BACKGROUND =====
class BackgroundVisualizer {
  constructor() {
    this.canvas = document.getElementById('audio-visualizer');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 100;
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, i) => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 184, 77, ${p.opacity})`;
      this.ctx.fill();
      
      // Draw connections
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(255, 184, 77, ${0.1 * (1 - distance / 150)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

new BackgroundVisualizer();

// ===== SPECTRUM ANALYZER =====
class SpectrumAnalyzer {
  constructor() {
    this.canvas = document.getElementById('spectrum-analyzer');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.barCount = 64;
    this.bars = [];
    
    this.resize();
    this.initBars();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  initBars() {
    for (let i = 0; i < this.barCount; i++) {
      this.bars.push({
        height: Math.random() * 0.5 + 0.2,
        target: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.02 + 0.01
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const barWidth = this.canvas.width / this.barCount;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#ffb84d');
    gradient.addColorStop(1, '#00d4ff');
    
    this.bars.forEach((bar, i) => {
      // Update height smoothly
      if (Math.abs(bar.height - bar.target) < 0.01) {
        bar.target = Math.random() * 0.8 + 0.2;
      }
      bar.height += (bar.target - bar.height) * bar.speed;
      
      const x = i * barWidth;
      const h = bar.height * this.canvas.height;
      const y = this.canvas.height - h;
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, y, barWidth - 2, h);
      
      // Add glow effect
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = 'rgba(255, 184, 77, 0.5)';
      this.ctx.fillRect(x, y, barWidth - 2, h);
      this.ctx.shadowBlur = 0;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

new SpectrumAnalyzer();

// ===== ADVANCED AUDIO PLAYER =====
class AdvancedAudioPlayer {
  constructor(card) {
    this.card = card;
    this.audio = card.querySelector('audio');
    this.playBtn = card.querySelector('.play-button');
    this.canvas = card.querySelector('.waveform-canvas');
    this.overlay = card.querySelector('.waveform-overlay');
    this.progressBar = card.querySelector('.progress-bar');
    this.progressFill = card.querySelector('.progress-fill');
    this.progressThumb = card.querySelector('.progress-thumb');
    this.timeCurrent = card.querySelector('.time-current');
    this.timeTotal = card.querySelector('.time-total');
    this.durationDisplay = card.querySelector('.sample-duration');
    
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.waveformData = [];
    this.isPlaying = false;
    
    this.init();
  }

  init() {
    this.generateWaveform();
    this.drawWaveform();
    
    this.playBtn.addEventListener('click', () => this.togglePlay());
    
    this.audio.addEventListener('loadedmetadata', () => {
      const duration = this.formatTime(this.audio.duration);
      this.timeTotal.textContent = duration;
      this.durationDisplay.textContent = duration;
    });
    
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.reset());
    
    // Seek functionality
    this.progressBar.addEventListener('click', (e) => this.seek(e));
    
    // Mouse tracking for sample cards
    this.card.addEventListener('mousemove', (e) => {
      const rect = this.card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      this.card.style.setProperty('--mouse-x', x + '%');
      this.card.style.setProperty('--mouse-y', y + '%');
    });
  }

  generateWaveform() {
    const samples = 100;
    for (let i = 0; i < samples; i++) {
      const amp = Math.sin(i / 10) * 0.3 + Math.random() * 0.4 + 0.3;
      this.waveformData.push(amp);
    }
  }

  drawWaveform() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerY = height / 2;
    
    this.ctx.clearRect(0, 0, width, height);
    
    const barWidth = width / this.waveformData.length;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 184, 77, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 184, 77, 1)');
    gradient.addColorStop(1, 'rgba(255, 184, 77, 0.8)');
    
    this.waveformData.forEach((amp, i) => {
      const x = i * barWidth;
      const barHeight = amp * height * 0.8;
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, centerY - barHeight / 2, barWidth - 1, barHeight);
    });
  }

  togglePlay() {
    // Pause all other players
    document.querySelectorAll('audio').forEach(audio => {
      if (audio !== this.audio && !audio.paused) {
        audio.pause();
        const otherCard = audio.closest('.sample-card');
        otherCard.classList.remove('playing');
      }
    });

    if (this.audio.paused) {
      this.audio.play();
      this.card.classList.add('playing');
      this.isPlaying = true;
    } else {
      this.audio.pause();
      this.card.classList.remove('playing');
      this.isPlaying = false;
    }
  }

  updateProgress() {
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    
    this.progressFill.style.width = percent + '%';
    this.progressThumb.style.left = percent + '%';
    this.overlay.style.width = percent + '%';
    
    this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
  }

  reset() {
    this.card.classList.remove('playing');
    this.isPlaying = false;
    this.progressFill.style.width = '0%';
    this.progressThumb.style.left = '0%';
    this.overlay.style.width = '0%';
    this.timeCurrent.textContent = '0:00';
  }

  seek(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    this.audio.currentTime = percent * this.audio.duration;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Initialize all audio players
document.querySelectorAll('.sample-card').forEach(card => {
  new AdvancedAudioPlayer(card);
});

// ===== SCROLL REVEAL ANIMATIONS =====
class ScrollReveal {
  constructor() {
    this.sections = document.querySelectorAll('.reveal-section');
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
      }
    );
    
    this.init();
  }

  init() {
    this.sections.forEach(section => {
      this.observer.observe(section);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Animate stat circles when visible
        if (entry.target.classList.contains('about-section')) {
          this.animateStats();
        }
      }
    });
  }

  animateStats() {
    document.querySelectorAll('.stat-progress').forEach(circle => {
      const progress = circle.style.getPropertyValue('--progress');
      circle.style.strokeDashoffset = 283 - (283 * progress / 100);
    });
  }
}

new ScrollReveal();

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== PARALLAX EFFECT FOR ORBS =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  document.querySelectorAll('.orb').forEach((orb, i) => {
    const speed = 0.3 + (i * 0.1);
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });
});

// ===== PERFORMANCE OPTIMIZATION =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal-section').forEach(el => {
    el.classList.add('visible');
  });
  
  document.querySelectorAll('[class*="animation"]').forEach(el => {
    el.style.animation = 'none';
  });
}

// ===== ACCESSIBILITY =====
document.querySelectorAll('button, a').forEach(el => {
  el.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      el.click();
    }
  });
});

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s';
    document.body.style.opacity = '1';
  }, 100);
});

// ===== HERO WAVEFORM ANIMATION =====
class HeroWaveform {
  constructor() {
    this.paths = document.querySelectorAll('.wave-path');
    this.animate();
  }

  animate() {
    this.paths.forEach((path, i) => {
      const offset = Date.now() / (1000 + i * 200);
      const points = [];
      
      for (let x = 0; x <= 400; x += 20) {
        const y = 100 + Math.sin((x / 50) + offset) * (20 + i * 10);
        points.push(`${x},${y}`);
      }
      
      let d = `M0,${points[0].split(',')[1]}`;
      for (let i = 0; i < points.length - 1; i++) {
        const [x1, y1] = points[i].split(',');
        const [x2, y2] = points[i + 1].split(',');
        const cx = (parseFloat(x1) + parseFloat(x2)) / 2;
        d += ` Q${x1},${y1} ${cx},${(parseFloat(y1) + parseFloat(y2)) / 2}`;
      }
      
      path.setAttribute('d', d);
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

new HeroWaveform();

console.log('%c🎙️ Voice Portfolio Loaded', 'color: #ffb84d; font-size: 20px; font-weight: bold;');
console.log('%cEvery voice tells a story.', 'color: #00d4ff; font-size: 14px; font-style: italic;');
