// ===== ULTIMATE CUSTOM CURSOR =====
class UltimateCursor {
  constructor() {
    this.dot = document.querySelector('.cursor-dot');
    this.ring = document.querySelector('.cursor-ring');
    this.glow = document.querySelector('.cursor-glow');
    this.mouseX = 0;
    this.mouseY = 0;
    this.ringX = 0;
    this.ringY = 0;
    this.glowX = 0;
    this.glowY = 0;
    
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      
      this.dot.style.left = e.clientX + 'px';
      this.dot.style.top = e.clientY + 'px';
    });

    this.animate();
  }

  animate() {
    // Smooth follow for ring
    const ringDx = this.mouseX - this.ringX;
    const ringDy = this.mouseY - this.ringY;
    this.ringX += ringDx * 0.15;
    this.ringY += ringDy * 0.15;
    
    // Even smoother for glow
    const glowDx = this.mouseX - this.glowX;
    const glowDy = this.mouseY - this.glowY;
    this.glowX += glowDx * 0.08;
    this.glowY += glowDy * 0.08;
    
    this.ring.style.left = this.ringX + 'px';
    this.ring.style.top = this.ringY + 'px';
    this.glow.style.left = this.glowX + 'px';
    this.glow.style.top = this.glowY + 'px';
    
    requestAnimationFrame(() => this.animate());
  }
}

if (window.matchMedia('(pointer: fine)').matches) {
  new UltimateCursor();
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 120;
    this.connectionDistance = 150;
    
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
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 107, 53, ${p.opacity})`;
      this.ctx.fill();
      
      // Draw connections
      this.particles.slice(i + 1).forEach(p2 => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.connectionDistance) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(255, 107, 53, ${0.2 * (1 - distance / this.connectionDistance)})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

new ParticleSystem();

// ===== 3D SOUND ORB =====
class SoundOrb3D {
  constructor() {
    this.canvas = document.getElementById('sound-orb-3d');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.time = 0;
    this.points = [];
    this.numPoints = 200;
    
    this.resize();
    this.createPoints();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
  }

  createPoints() {
    for (let i = 0; i < this.numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      this.points.push({ theta, phi });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.time += 0.01;
    
    // Create gradient
    const gradient = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 0,
      this.centerX, this.centerY, this.radius
    );
    gradient.addColorStop(0, 'rgba(255, 107, 53, 0.8)');
    gradient.addColorStop(0.5, 'rgba(0, 229, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(199, 125, 255, 0.2)');
    
    this.points.forEach((point, i) => {
      const wobble = Math.sin(this.time * 2 + i * 0.1) * 20;
      const r = this.radius + wobble;
      
      const x = this.centerX + r * Math.sin(point.phi) * Math.cos(point.theta);
      const y = this.centerY + r * Math.sin(point.phi) * Math.sin(point.theta);
      const z = r * Math.cos(point.phi);
      
      const scale = (z + r) / (2 * r);
      const size = 2 + scale * 3;
      const opacity = 0.3 + scale * 0.7;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 107, 53, ${opacity})`;
      this.ctx.fill();
      
      point.theta += 0.002;
      point.phi += 0.001;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

new SoundOrb3D();

// ===== FREQUENCY VISUALIZER =====
class FrequencyVisualizer {
  constructor() {
    this.canvas = document.getElementById('frequency-visualizer');
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.bars = [];
    this.barCount = 64;
    
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
        height: Math.random(),
        target: Math.random(),
        speed: 0.02 + Math.random() * 0.03
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    const barWidth = this.canvas.width / this.barCount;
    const gradient = this.ctx.createLinearGradient(0, this.canvas.height, 0, 0);
    gradient.addColorStop(0, '#ff6b35');
    gradient.addColorStop(0.5, '#00e5ff');
    gradient.addColorStop(1, '#c77dff');
    
    this.bars.forEach((bar, i) => {
      if (Math.abs(bar.height - bar.target) < 0.01) {
        bar.target = Math.random() * 0.9 + 0.1;
      }
      bar.height += (bar.target - bar.height) * bar.speed;
      
      const x = i * barWidth;
      const h = bar.height * this.canvas.height;
      const y = this.canvas.height - h;
      
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, y, barWidth - 2, h);
      
      // Glow effect
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#ff6b35';
      this.ctx.fillRect(x, y, barWidth - 2, h);
      this.ctx.shadowBlur = 0;
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

new FrequencyVisualizer();

// ===== 3D CARD TILT EFFECT =====
class CardTilt {
  constructor(element) {
    this.element = element;
    this.rect = null;
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.init();
  }

  init() {
    this.element.addEventListener('mouseenter', () => this.handleEnter());
    this.element.addEventListener('mousemove', (e) => this.handleMove(e));
    this.element.addEventListener('mouseleave', () => this.handleLeave());
  }

  handleEnter() {
    this.rect = this.element.getBoundingClientRect();
    this.element.style.transition = 'none';
  }

  handleMove(e) {
    this.mouseX = e.clientX - this.rect.left;
    this.mouseY = e.clientY - this.rect.top;
    
    const centerX = this.rect.width / 2;
    const centerY = this.rect.height / 2;
    
    const rotateX = ((this.mouseY - centerY) / centerY) * -10;
    const rotateY = ((this.mouseX - centerX) / centerX) * 10;
    
    this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Update mouse position for card effects
    const mouseXPercent = (this.mouseX / this.rect.width) * 100;
    const mouseYPercent = (this.mouseY / this.rect.height) * 100;
    this.element.style.setProperty('--mouse-x', mouseXPercent + '%');
    this.element.style.setProperty('--mouse-y', mouseYPercent + '%');
  }

  handleLeave() {
    this.element.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
  }
}

// Initialize all tilt cards
document.querySelectorAll('[data-tilt]').forEach(card => {
  new CardTilt(card);
});

// ===== ADVANCED AUDIO PLAYER =====
class AdvancedAudioPlayer {
  constructor(card) {
    this.card = card;
    this.audio = card.querySelector('audio');
    this.toggleBtn = card.querySelector('.player-toggle');
    this.canvas = card.querySelector('.waveform-canvas');
    this.progress = card.querySelector('.waveform-progress');
    this.scrubber = card.querySelector('.waveform-scrubber');
    this.waveformContainer = card.querySelector('.player-waveform');
    this.timeCurrent = card.querySelector('.time-current');
    this.timeDuration = card.querySelector('.time-duration');
    
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.waveform = [];
    this.isPlaying = false;
    
    this.init();
  }

  init() {
    this.generateWaveform();
    this.drawWaveform();
    this.resizeCanvas();
    
    this.toggleBtn.addEventListener('click', () => this.togglePlay());
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.timeDuration.textContent = this.formatTime(this.audio.duration);
    });
    
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.reset());
    
    // Seek
    this.waveformContainer.addEventListener('click', (e) => this.seek(e));
    
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.drawWaveform();
    });
  }

  resizeCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  generateWaveform() {
    const samples = 100;
    for (let i = 0; i < samples; i++) {
      const value = Math.sin(i / 8) * 0.4 + Math.random() * 0.3 + 0.3;
      this.waveform.push(value);
    }
  }

  drawWaveform() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const centerY = height / 2;
    
    this.ctx.clearRect(0, 0, width, height);
    
    const barWidth = width / this.waveform.length;
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 107, 53, 0.6)');
    gradient.addColorStop(0.5, 'rgba(255, 107, 53, 1)');
    gradient.addColorStop(1, 'rgba(255, 107, 53, 0.6)');
    
    this.waveform.forEach((amp, i) => {
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
    
    this.progress.style.width = percent + '%';
    this.scrubber.style.left = percent + '%';
    
    this.timeCurrent.textContent = this.formatTime(this.audio.currentTime);
  }

  reset() {
    this.card.classList.remove('playing');
    this.isPlaying = false;
    this.progress.style.width = '0%';
    this.scrubber.style.left = '0%';
    this.timeCurrent.textContent = '0:00';
  }

  seek(e) {
    const rect = this.waveformContainer.getBoundingClientRect();
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

// ===== STAT NUMBER COUNTER =====
class StatCounter {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      { threshold: 0.5 }
    );
    
    this.init();
  }

  init() {
    document.querySelectorAll('.stat-number[data-count]').forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        this.countUp(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }

  countUp(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, duration / steps);
  }
}

new StatCounter();

// ===== SCROLL ANIMATIONS =====
class ScrollAnimations {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );
    
    this.init();
  }

  init() {
    document.querySelectorAll('section').forEach(section => {
      this.observer.observe(section);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }
}

// Initialize sections with animation state
document.querySelectorAll('section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(50px)';
  section.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
});

new ScrollAnimations();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ===== PARALLAX EFFECTS =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  
  // Parallax background layers
  document.querySelectorAll('.bg-layer').forEach((layer, i) => {
    const speed = 0.2 + (i * 0.1);
    layer.style.transform = `translateY(${scrolled * speed}px)`;
  });
  
  // Parallax separator
  const separator = document.querySelector('.separator-glow');
  if (separator) {
    separator.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0005})`;
  }
});

// ===== PERFORMANCE OPTIMIZATION =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('[style*="animation"]').forEach(el => {
    el.style.animation = 'none';
  });
  
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '1';
    section.style.transform = 'none';
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
  document.body.style.transition = 'opacity 0.6s ease-out';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

// ===== EASTER EGG: CONSOLE MESSAGE =====
console.log(
  '%c🎙️ VOICE PORTFOLIO',
  'color: #ff6b35; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0 #00e5ff;'
);
console.log(
  '%cEvery voice tells a story.',
  'color: #00e5ff; font-size: 16px; font-style: italic;'
);
console.log(
  '%c✨ Built with passion for storytelling ✨',
  'color: #c77dff; font-size: 12px;'
);

// Log performance
console.log('%c⚡ Performance Stats:', 'color: #ffd60a; font-weight: bold;');
window.addEventListener('load', () => {
  const perfData = performance.getEntriesByType('navigation')[0];
  console.log(`📊 Page Load Time: ${Math.round(perfData.loadEventEnd)}ms`);
  console.log(`🎨 DOM Content Loaded: ${Math.round(perfData.domContentLoadedEventEnd)}ms`);
});
