"use client";

import React, { useRef, useEffect, useCallback } from 'react';

export const MusicReactiveHeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const beamRef = useRef<any>(null);

  // Film grain generator class
  class FilmGrain {
    width: number;
    height: number;
    grainCanvas: HTMLCanvasElement;
    grainCtx: CanvasRenderingContext2D;
    grainData: ImageData | null;
    frame: number;

    constructor(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.grainCanvas = document.createElement('canvas');
      this.grainCanvas.width = width;
      this.grainCanvas.height = height;
      this.grainCtx = this.grainCanvas.getContext('2d')!;
      this.grainData = null;
      this.frame = 0;
      this.generateGrainPattern();
    }

    generateGrainPattern() {
      const imageData = this.grainCtx.createImageData(this.width, this.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const grain = Math.random();
        const value = grain * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 255;
      }
      
      this.grainData = imageData;
    }

    update() {
      this.frame++;
      
      if (this.frame % 2 === 0 && this.grainData) {
        const data = this.grainData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const grain = Math.random();
          const time = this.frame * 0.01;
          const x = (i / 4) % this.width;
          const y = Math.floor((i / 4) / this.width);
          
          const pattern = Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 - time);
          const value = (grain * 0.8 + pattern * 0.2) * 255;
          
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
        }
        
        this.grainCtx.putImageData(this.grainData, 0, 0);
      }
    }

    apply(ctx: CanvasRenderingContext2D, intensity: number = 0.05, colorize: boolean = true, hue: number = 0) {
      ctx.save();
      
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = intensity * 0.5;
      ctx.drawImage(this.grainCanvas, 0, 0);
      
      ctx.globalCompositeOperation = 'multiply';
      ctx.globalAlpha = 1 - (intensity * 0.3);
      ctx.drawImage(this.grainCanvas, 0, 0);
      
      if (colorize) {
        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = intensity * 0.3;
        ctx.fillStyle = `hsla(${hue}, 50%, 50%, 1)`;
        ctx.fillRect(0, 0, this.width, this.height);
      }
      
      ctx.restore();
    }

    resize(width: number, height: number) {
      this.width = width;
      this.height = height;
      this.grainCanvas.width = width;
      this.grainCanvas.height = height;
      this.generateGrainPattern();
    }
  }

  // Initialize canvas and animation
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (beam.filmGrain) {
        beam.filmGrain.resize(canvas.width, canvas.height);
      }
    };
    
    // Initialize film grain
    const filmGrain = new FilmGrain(window.innerWidth, window.innerHeight);
    
    // Beam state with dynamic color system
    const beam = {
      bassIntensity: 0,
      midIntensity: 0,
      trebleIntensity: 0,
      time: 0,
      filmGrain: filmGrain,
      colorState: {
        hue: 30,
        targetHue: 30,
        saturation: 80,
        targetSaturation: 80,
        lightness: 50,
        targetLightness: 50
      },
      waves: [
        { 
          amplitude: 30, 
          frequency: 0.003, 
          speed: 0.02, 
          offset: 0,
          thickness: 1,
          opacity: 0.9
        },
        { 
          amplitude: 25, 
          frequency: 0.004, 
          speed: 0.015, 
          offset: Math.PI * 0.5,
          thickness: 0.8,
          opacity: 0.7
        },
        { 
          amplitude: 20, 
          frequency: 0.005, 
          speed: 0.025, 
          offset: Math.PI,
          thickness: 0.6,
          opacity: 0.5
        },
        { 
          amplitude: 35, 
          frequency: 0.002, 
          speed: 0.01, 
          offset: Math.PI * 1.5,
          thickness: 1.2,
          opacity: 0.6
        }
      ],
      bassHistory: new Array(20).fill(0),
      postProcessing: {
        filmGrainIntensity: 0.04,
        vignetteIntensity: 0.4,
        chromaticAberration: 0.8,
        scanlineIntensity: 0.02
      }
    };
    beamRef.current = beam;
    
    resizeCanvas();
    
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Clear canvas with slight fade for motion blur
      ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Demo animation (no audio)
      beam.bassIntensity = 0.4 + Math.sin(beam.time * 0.01) * 0.3;
      beam.midIntensity = 0.3 + Math.sin(beam.time * 0.015) * 0.2;
      beam.trebleIntensity = 0.2 + Math.sin(beam.time * 0.02) * 0.1;
      
      beam.colorState.targetHue = 180 + Math.sin(beam.time * 0.005) * 180;
      beam.colorState.targetSaturation = 70 + Math.sin(beam.time * 0.01) * 30;
      beam.colorState.targetLightness = 50 + Math.sin(beam.time * 0.008) * 20;
      
      // Smooth color transitions
      beam.colorState.hue += (beam.colorState.targetHue - beam.colorState.hue) * 0.5;
      beam.colorState.saturation += (beam.colorState.targetSaturation - beam.colorState.saturation) * 0.2;
      beam.colorState.lightness += (beam.colorState.targetLightness - beam.colorState.lightness) * 0.1;
      
      // Update time
      beam.time++;
      
      const centerY = canvas.height / 2;
      
      // Draw waves
      beam.waves.forEach((wave: any, waveIndex: number) => {
        wave.offset += wave.speed * (1 + beam.bassIntensity * 0.8);
        
        const freqInfluence = waveIndex < 2 ? beam.bassIntensity : beam.midIntensity;
        const dynamicAmplitude = wave.amplitude * (1 + freqInfluence * 5);
        
        const waveHue = beam.colorState.hue + waveIndex * 15;
        const waveSaturation = beam.colorState.saturation - waveIndex * 5;
        const waveLightness = beam.colorState.lightness + waveIndex * 5;
        
        const gradient = ctx.createLinearGradient(0, centerY - dynamicAmplitude, 0, centerY + dynamicAmplitude);
        const alpha = wave.opacity * (0.5 + beam.bassIntensity * 0.5);
        
        gradient.addColorStop(0, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness}%, 0)`);
        gradient.addColorStop(0.5, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness + 10}%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness}%, 0)`);
        
        ctx.beginPath();
        for (let x = -50; x <= canvas.width + 50; x += 2) {
          const y1 = Math.sin(x * wave.frequency + wave.offset) * dynamicAmplitude;
          const y2 = Math.sin(x * wave.frequency * 2 + wave.offset * 1.5) * (dynamicAmplitude * 0.3 * beam.midIntensity);
          const y3 = Math.sin(x * wave.frequency * 0.5 + wave.offset * 0.7) * (dynamicAmplitude * 0.5);
          const y = centerY + y1 + y2 + y3;
          
          if (x === -50) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width + 50, canvas.height);
        ctx.lineTo(-50, canvas.height);
        ctx.closePath();
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      // Apply post-processing effects
      
      // 1. Film grain
      beam.filmGrain.update();
      beam.filmGrain.apply(ctx, beam.postProcessing.filmGrainIntensity, true, beam.colorState.hue);
      
      // 2. Scanlines
      ctx.strokeStyle = `rgba(0, 0, 0, ${beam.postProcessing.scanlineIntensity})`;
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      
      // 3. Chromatic aberration
      if (beam.postProcessing.chromaticAberration > 0.1) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = beam.postProcessing.chromaticAberration * 0.7;
        
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
          
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = 'rgb(255, 0, 0)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'screen';
          ctx.drawImage(tempCanvas, -2 * beam.postProcessing.chromaticAberration, 0);
          
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = 'rgb(0, 0, 255)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = 'screen';
          ctx.drawImage(tempCanvas, 2 * beam.postProcessing.chromaticAberration, 0);
        }
        
        ctx.restore();
      }
      
      // 4. Vignette with film burn effect
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.9
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(0.5, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity * 0.3})`);
      vignette.addColorStop(0.8, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity * 0.6})`);
      vignette.addColorStop(1, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 7. Subtle color grading
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      ctx.globalAlpha = 0.1;
      
      const colorGradeGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      colorGradeGradient.addColorStop(0, 'rgb(255, 240, 220)');
      colorGradeGradient.addColorStop(0.5, 'rgb(255, 255, 255)');
      colorGradeGradient.addColorStop(1, 'rgb(220, 230, 255)');
      ctx.fillStyle = colorGradeGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    };
    
    animate();
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = initCanvas();
    return cleanup;
  }, [initCanvas]);

  return (
    <div className="music-reactive-hero">
      <canvas ref={canvasRef} className="visualization-canvas" />
      
      <div className="hero-content">
        <p className="hero-tagline">Revolutionizing Speech Training with AI</p>
        <h1 className="hero-title">
          <span className="title-line">VOCOLAB</span>
          <span className="title-line">AI</span>
        </h1>
        <p className="hero-subtitle">Transform your pronunciation with personalized, AI-powered speech therapy</p>
      </div>
    </div>
  );
};
