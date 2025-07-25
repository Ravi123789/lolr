import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create icon.png (1024x1024)
function createIcon() {
  const canvas = createCanvas(1024, 1024);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGradient = ctx.createRadialGradient(512, 512, 0, 512, 512, 512);
  bgGradient.addColorStop(0, '#16213e');
  bgGradient.addColorStop(1, '#0f1419');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // Radar circles
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 4;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(512, 512, 300, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.arc(512, 512, 200, 0, 2 * Math.PI);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(512, 512, 100, 0, 2 * Math.PI);
  ctx.stroke();

  // Center eye
  ctx.globalAlpha = 0.9;
  const eyeGradient = ctx.createLinearGradient(432, 462, 592, 562);
  eyeGradient.addColorStop(0, '#60a5fa');
  eyeGradient.addColorStop(0.5, '#3b82f6');
  eyeGradient.addColorStop(1, '#1e40af');
  
  ctx.fillStyle = eyeGradient;
  ctx.beginPath();
  ctx.ellipse(512, 512, 80, 50, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Inner pupil
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.arc(512, 512, 25, 0, 2 * Math.PI);
  ctx.fill();

  // Pupil center
  ctx.fillStyle = '#1e40af';
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(512, 512, 12, 0, 2 * Math.PI);
  ctx.fill();

  // Scanning lines
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  
  ctx.beginPath();
  ctx.moveTo(392, 512);
  ctx.lineTo(632, 512);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(512, 432);
  ctx.lineTo(512, 592);
  ctx.stroke();

  // Radar sweep line
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.8;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(512, 512);
  ctx.lineTo(512, 212);
  ctx.stroke();
  
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.arc(512, 212, 8, 0, 2 * Math.PI);
  ctx.fill();

  // Corner accent dots
  ctx.fillStyle = '#60a5fa';
  ctx.globalAlpha = 0.5;
  
  ctx.beginPath();
  ctx.arc(150, 150, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(874, 150, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(150, 874, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(874, 874, 6, 0, 2 * Math.PI);
  ctx.fill();

  // Trust network nodes
  ctx.fillStyle = '#3b82f6';
  ctx.globalAlpha = 0.4;
  
  const nodes = [[300, 300], [724, 300], [300, 724], [724, 724]];
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
  });

  // Connection lines
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.3;
  
  nodes.forEach(([x, y]) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(512, 512);
    ctx.stroke();
  });

  // Save the canvas as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/icon.png'), buffer);
  console.log('Created icon.png (1024x1024)');
}

// Create splash.png (200x200)
function createSplash() {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0f1419';
  ctx.fillRect(0, 0, 200, 200);

  // Center radar circle
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.8;
  ctx.beginPath();
  ctx.arc(100, 100, 60, 0, 2 * Math.PI);
  ctx.stroke();

  // Inner circle
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(100, 100, 35, 0, 2 * Math.PI);
  ctx.stroke();

  // Center eye
  const eyeGradient = ctx.createLinearGradient(70, 80, 130, 120);
  eyeGradient.addColorStop(0, '#60a5fa');
  eyeGradient.addColorStop(1, '#3b82f6');
  
  ctx.fillStyle = eyeGradient;
  ctx.globalAlpha = 0.9;
  ctx.beginPath();
  ctx.ellipse(100, 100, 25, 15, 0, 0, 2 * Math.PI);
  ctx.fill();

  // Pupil
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.arc(100, 100, 8, 0, 2 * Math.PI);
  ctx.fill();

  // Pupil center
  ctx.fillStyle = '#1e40af';
  ctx.globalAlpha = 1;
  ctx.beginPath();
  ctx.arc(100, 100, 4, 0, 2 * Math.PI);
  ctx.fill();

  // Scanning lines
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.7;
  
  ctx.beginPath();
  ctx.moveTo(65, 100);
  ctx.lineTo(135, 100);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(100, 65);
  ctx.lineTo(100, 135);
  ctx.stroke();

  // Save the canvas as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/splash.png'), buffer);
  console.log('Created splash.png (200x200)');
}

// Create both images
try {
  createIcon();
  createSplash();
  console.log('All images created successfully!');
} catch (error) {
  console.error('Error creating images:', error);
  process.exit(1);
}