"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";


const TRIESTO_CSS = `
:root {
  --cream: #F5EFE0;
  --deep: #1A1208;
  --espresso: #2C1810;
  --gold: #C8963E;
  --gold-light: #E8B85A;
  --sage: #5B6B4F;
  --warm-white: #FAF6EE;
  --charcoal: #2A2318;
  --muted: #7A6B54;
  --border: rgba(200,150,62,0.25);
}
* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; font-size:16px; }
body {
  background: var(--deep);
  color: var(--cream);
  font-family: 'Jost', sans-serif;
  font-weight: 300;
  overflow-x: hidden;
  cursor: none;
}

/* ─── CUSTOM CURSOR ─── */
.cursor {
  position: fixed; width: 12px; height: 12px;
  background: var(--gold); border-radius: 50%;
  pointer-events: none; z-index: 9999;
  transform: translate(-50%,-50%);
  transition: transform 0.1s, width 0.3s, height 0.3s, background 0.3s;
  mix-blend-mode: difference;
}
.cursor-ring {
  position: fixed; width: 36px; height: 36px;
  border: 1px solid var(--gold); border-radius: 50%;
  pointer-events: none; z-index: 9998;
  transform: translate(-50%,-50%);
  transition: transform 0.15s ease-out, width 0.3s, height 0.3s, opacity 0.3s;
  opacity: 0.6;
}

/* ─── LOADER ─── */
#loader {
  position: fixed; inset: 0;
  background: var(--espresso);
  z-index: 9000;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  transition: opacity 0.8s, visibility 0.8s;
}
#loader.done { opacity: 0; visibility: hidden; }
.loader-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(60px, 10vw, 100px);
  font-weight: 300;
  letter-spacing: 0.3em;
  color: var(--gold);
  animation: fadePulse 1.5s ease-in-out infinite;
}
.loader-bar {
  width: 180px; height: 1px;
  background: rgba(200,150,62,0.2);
  margin-top: 32px; position: relative; overflow: hidden;
}
.loader-fill {
  position: absolute; left: 0; top: 0; height: 100%;
  background: var(--gold);
  animation: barLoad 2.2s ease forwards;
}
@keyframes barLoad { from { width: 0; } to { width: 100%; } }
@keyframes fadePulse { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }

/* ─── NAV ─── */
nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 800;
  padding: 24px 60px;
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.4s, padding 0.4s, backdrop-filter 0.4s;
}
nav.scrolled {
  background: rgba(26,18,8,0.92);
  backdrop-filter: blur(20px);
  padding: 16px 60px;
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 300;
  letter-spacing: 0.25em; color: var(--gold);
  text-decoration: none;
}
.nav-logo span { font-style: italic; font-weight: 400; }
.nav-links {
  display: flex; gap: 40px; list-style: none;
  align-items: center;
}
.nav-links a {
  color: var(--cream); opacity: 0.75;
  text-decoration: none;
  font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase;
  font-weight: 400;
  transition: opacity 0.3s, color 0.3s;
  position: relative;
}
.nav-links a::after {
  content: ''; position: absolute; left: 0; bottom: -4px;
  width: 0; height: 1px; background: var(--gold);
  transition: width 0.3s;
}
.nav-links a:hover { opacity: 1; color: var(--gold-light); }
.nav-links a:hover::after { width: 100%; }
.nav-reserve {
  background: transparent;
  border: 1px solid var(--gold);
  color: var(--gold);
  padding: 10px 28px;
  font-family: 'Jost', sans-serif;
  font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  cursor: pointer; transition: all 0.35s;
  text-decoration: none; display: inline-block;
}
.nav-reserve:hover { background: var(--gold); color: var(--deep); }
.hamburger { display: none; flex-direction: column; gap: 6px; cursor: pointer; padding: 4px; }
.hamburger span { width: 28px; height: 1px; background: var(--cream); transition: all 0.3s; }

/* ─── HERO ─── */
#hero {
  position: relative; height: 100vh; min-height: 700px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #0D0802 0%, #1A1208 30%, #2C1810 60%, #1A120D 100%);
}
.hero-beans {
  position: absolute; inset: 0; overflow: hidden;
}
.bean {
  position: absolute;
  background: var(--gold);
  border-radius: 50%; opacity: 0;
  animation: floatBean linear infinite;
}
.hero-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);
}
.hero-content {
  position: relative; z-index: 2;
  text-align: center;
  padding: 0 24px;
}
.hero-tag {
  font-size: 11px; letter-spacing: 0.35em; text-transform: uppercase;
  color: var(--gold); opacity: 0;
  animation: riseUp 1s ease forwards 0.3s;
  display: block; margin-bottom: 28px;
}
.hero-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(72px, 12vw, 140px);
  font-weight: 300; line-height: 0.9;
  letter-spacing: -0.01em;
  opacity: 0;
  animation: riseUp 1.2s ease forwards 0.5s;
}
.hero-title em {
  font-style: italic; font-weight: 400;
  color: var(--gold-light); display: block;
}
.hero-subtitle {
  font-size: clamp(13px, 2vw, 16px);
  letter-spacing: 0.25em; text-transform: uppercase;
  color: rgba(245,239,224,0.6);
  margin-top: 32px;
  opacity: 0;
  animation: riseUp 1s ease forwards 0.9s;
}
.hero-cta-group {
  display: flex; gap: 20px; justify-content: center;
  margin-top: 52px; flex-wrap: wrap;
  opacity: 0; animation: riseUp 1s ease forwards 1.1s;
}
.btn-primary {
  background: var(--gold); color: var(--deep);
  padding: 16px 48px;
  font-family: 'Jost', sans-serif; font-size: 12px;
  letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500;
  border: none; cursor: pointer;
  text-decoration: none; display: inline-block;
  transition: all 0.3s; position: relative; overflow: hidden;
}
.btn-primary::before {
  content: ''; position: absolute; inset: 0;
  background: rgba(255,255,255,0.15);
  transform: translateX(-100%); transition: transform 0.4s;
}
.btn-primary:hover::before { transform: translateX(0); }
.btn-outline {
  background: transparent; color: var(--cream);
  padding: 16px 48px; border: 1px solid rgba(245,239,224,0.35);
  font-family: 'Jost', sans-serif; font-size: 12px;
  letter-spacing: 0.2em; text-transform: uppercase; font-weight: 400;
  cursor: pointer; text-decoration: none; display: inline-block;
  transition: all 0.3s;
}
.btn-outline:hover { border-color: var(--gold); color: var(--gold); }
.hero-scroll {
  position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  opacity: 0; animation: fadeIn 1s ease forwards 1.6s;
  cursor: pointer;
}
.scroll-line {
  width: 1px; height: 60px;
  background: linear-gradient(to bottom, var(--gold), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
.scroll-text {
  font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase;
  color: rgba(245,239,224,0.5);
}
.hero-stats {
  position: absolute; bottom: 40px; right: 60px;
  display: flex; flex-direction: column; gap: 28px;
  opacity: 0; animation: slideLeft 1s ease forwards 1.3s;
}
.stat-item { text-align: right; }
.stat-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px; font-weight: 300; color: var(--gold);
  display: block; line-height: 1;
}
.stat-label {
  font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
  color: rgba(245,239,224,0.45); margin-top: 4px;
}

/* ─── MARQUEE ─── */
.marquee-section {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  overflow: hidden; padding: 18px 0;
  background: rgba(200,150,62,0.04);
}
.marquee-track {
  display: flex; white-space: nowrap;
  animation: marquee 22s linear infinite;
}
.marquee-item {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-style: italic; font-weight: 300;
  color: var(--muted); letter-spacing: 0.1em;
  padding: 0 40px;
  display: flex; align-items: center; gap: 40px;
}
.marquee-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--gold); opacity: 0.5; flex-shrink: 0;
}

/* ─── SECTIONS ─── */
section { padding: 120px 0; }
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 60px; }
.section-label {
  font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 20px; display: block;
}
.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 300; line-height: 1.05;
  color: var(--cream);
}
.section-title em { font-style: italic; color: var(--gold-light); }
.section-body {
  font-size: 16px; line-height: 1.8;
  color: rgba(245,239,224,0.65);
  max-width: 580px;
  font-weight: 300;
}
.divider {
  width: 60px; height: 1px; background: var(--gold);
  margin: 32px 0; opacity: 0.5;
}

/* ─── ABOUT ─── */
#about { background: var(--espresso); }
.about-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 100px; align-items: center;
}
.about-visual {
  position: relative;
  aspect-ratio: 4/5;
}
.about-img {
  width: 100%; height: 100%; object-fit: cover;
  display: block;
  background: var(--charcoal);
}
.about-frame {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, var(--espresso) 0%, #1E1206 40%, #3D2515 100%);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.about-frame-art {
  width: 100%; height: 100%;
  position: relative;
}
.coffee-cup-svg {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%,-50%);
  animation: floatGently 4s ease-in-out infinite;
}
.about-badge {
  position: absolute; bottom: -20px; right: -20px;
  width: 120px; height: 120px;
  background: var(--gold);
  border-radius: 50%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  color: var(--deep); z-index: 2;
}
.badge-num {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px; font-weight: 400; line-height: 1;
}
.badge-text {
  font-size: 8px; letter-spacing: 0.15em; text-transform: uppercase;
  font-weight: 500; text-align: center; line-height: 1.4;
}
.about-features {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px; margin-top: 48px;
}
.feat-item {
  padding: 20px;
  border: 1px solid var(--border);
  transition: border-color 0.3s, background 0.3s;
}
.feat-item:hover {
  border-color: var(--gold);
  background: rgba(200,150,62,0.05);
}
.feat-icon {
  font-size: 24px; margin-bottom: 12px;
  display: block; color: var(--gold);
}
.feat-title {
  font-size: 13px; letter-spacing: 0.1em;
  text-transform: uppercase; font-weight: 500;
  color: var(--cream); margin-bottom: 6px;
}
.feat-desc {
  font-size: 13px; color: var(--muted); line-height: 1.6;
}

/* ─── MENU ─── */
#menu { background: var(--deep); }
.menu-tabs {
  display: flex; gap: 0; margin-bottom: 60px;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
}
.menu-tab {
  padding: 14px 32px;
  font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  font-weight: 400; color: var(--muted);
  background: none; border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s; white-space: nowrap;
  margin-bottom: -1px;
}
.menu-tab:hover { color: var(--cream); }
.menu-tab.active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}
.menu-panel { display: none; }
.menu-panel.active { display: block; }
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}
.menu-item {
  background: var(--espresso);
  padding: 28px 32px;
  transition: background 0.3s;
  position: relative; overflow: hidden;
}
.menu-item::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; background: var(--gold);
  transform: scaleY(0); transition: transform 0.3s;
  transform-origin: bottom;
}
.menu-item:hover { background: rgba(44,24,16,0.9); }
.menu-item:hover::before { transform: scaleY(1); }
.item-top {
  display: flex; justify-content: space-between;
  align-items: flex-start; gap: 16px; margin-bottom: 8px;
}
.item-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 400;
  color: var(--cream); line-height: 1.2;
}
.item-price {
  font-size: 15px; font-weight: 500;
  color: var(--gold); white-space: nowrap;
  font-family: 'Jost', sans-serif;
}
.item-desc {
  font-size: 13px; color: var(--muted);
  line-height: 1.7;
}
.item-tag {
  display: inline-block; margin-top: 10px;
  padding: 3px 10px;
  font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
  border: 1px solid rgba(200,150,62,0.3);
  color: var(--gold);
}

/* ─── EXPERIENCE (Gallery) ─── */
#experience { background: var(--charcoal); }
.gallery-strip {
  display: flex; gap: 4px;
  height: 520px;
  overflow: hidden;
  margin-top: 60px;
}
.gallery-cell {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: flex 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.gallery-cell:hover { flex: 3; }
.cell-bg {
  width: 100%; height: 100%;
  transition: transform 0.6s;
}
.gallery-cell:hover .cell-bg { transform: scale(1.03); }
.cell-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%);
}
.cell-info {
  position: absolute; bottom: 28px; left: 28px; right: 28px;
  transform: translateY(20px);
  opacity: 0; transition: all 0.4s 0.1s;
}
.gallery-cell:hover .cell-info {
  opacity: 1; transform: translateY(0);
}
.cell-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-weight: 400;
  color: var(--cream); margin-bottom: 6px;
}
.cell-sub {
  font-size: 11px; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--gold);
}

/* Colors for gallery cells */
.cell-1 { background: linear-gradient(135deg, #2C1810, #0D0802); }
.cell-2 { background: linear-gradient(135deg, #1A2410, #0D0D02); }
.cell-3 { background: linear-gradient(135deg, #100D1A, #0D0802); }
.cell-4 { background: linear-gradient(135deg, #1A1008, #0D0802); }
.cell-5 { background: linear-gradient(135deg, #1A1810, #0D0802); }

/* ─── TIMINGS ─── */
#timings {
  background: var(--espresso);
  position: relative; overflow: hidden;
}
#timings::before {
  content: ''; position: absolute;
  top: -200px; right: -200px;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(200,150,62,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.timings-grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr 1px 1fr;
  gap: 0;
  margin-top: 60px;
}
.timing-col {
  padding: 40px;
  text-align: center;
}
.timing-divider {
  background: var(--border);
  align-self: stretch;
}
.timing-icon {
  font-size: 32px; margin-bottom: 20px;
  color: var(--gold); display: block;
}
.timing-day {
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 12px; font-weight: 400;
}
.timing-hours {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-weight: 300; color: var(--cream);
  line-height: 1.2;
}
.timing-note {
  font-size: 12px; color: var(--muted);
  margin-top: 10px; line-height: 1.6;
}
.open-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 20px;
  background: rgba(91,107,79,0.2);
  border: 1px solid rgba(91,107,79,0.4);
  color: #8FAE7A;
  font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;
  font-weight: 400; margin-top: 12px;
}
.open-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #8FAE7A;
  animation: pulse 1.8s ease-in-out infinite;
}
.pricing-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 20px; margin-top: 60px;
}
.price-card {
  padding: 32px;
  border: 1px solid var(--border);
  text-align: center;
  transition: all 0.35s; position: relative; overflow: hidden;
}
.price-card::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(200,150,62,0.06), transparent);
  opacity: 0; transition: opacity 0.35s;
}
.price-card:hover::after { opacity: 1; }
.price-card:hover { border-color: var(--gold); transform: translateY(-4px); }
.price-range {
  font-family: 'Cormorant Garamond', serif;
  font-size: 40px; font-weight: 300; color: var(--gold);
  line-height: 1;
}
.price-label {
  font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--muted); margin-top: 8px;
}
.price-desc {
  font-size: 13px; color: rgba(245,239,224,0.55);
  margin-top: 12px; line-height: 1.6;
}

/* ─── LOCATION ─── */
#location { background: var(--deep); }
.location-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 80px; align-items: start;
}
.map-container {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  border: 1px solid var(--border);
}
.map-frame {
  width: 100%; height: 100%;
  background: var(--charcoal);
  position: relative; overflow: hidden;
}
.map-frame iframe {
  width: 100%; height: 100%;
  border: none; filter: grayscale(1) invert(0.9) sepia(0.2) brightness(0.9);
}
.map-pin {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -100%);
  z-index: 2;
  animation: pinBounce 2s ease-in-out infinite;
}
.address-card {
  padding: 40px;
  border: 1px solid var(--border);
  position: relative; overflow: hidden;
  background: var(--espresso);
}
.address-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0;
  height: 3px; background: linear-gradient(to right, var(--gold), transparent);
}
.address-item {
  display: flex; gap: 20px; align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
}
.address-item:last-child { border-bottom: none; }
.address-icon {
  width: 42px; height: 42px;
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; font-size: 18px; color: var(--gold);
}
.address-text-label {
  font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
  color: var(--muted); margin-bottom: 6px;
}
.address-text-val {
  font-size: 15px; color: var(--cream); line-height: 1.5;
}
.address-text-val a {
  color: var(--gold-light); text-decoration: none;
  transition: opacity 0.3s;
}
.address-text-val a:hover { opacity: 0.75; }
.directions-btn {
  display: flex; align-items: center; gap: 12px;
  margin-top: 32px; padding: 16px 28px;
  border: 1px solid var(--gold); color: var(--gold);
  background: transparent; cursor: pointer;
  font-family: 'Jost', sans-serif; font-size: 11px;
  letter-spacing: 0.2em; text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s; width: 100%; justify-content: center;
}
.directions-btn:hover { background: var(--gold); color: var(--deep); }

/* ─── TESTIMONIALS ─── */
#testimonials { background: var(--charcoal); }
.testimonials-slider {
  position: relative; overflow: hidden;
  margin-top: 60px;
}
.testimonials-track {
  display: flex;
  transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.testimonial-slide {
  flex: 0 0 100%;
  padding: 0 60px;
  text-align: center;
}
.quote-mark {
  font-family: 'Cormorant Garamond', serif;
  font-size: 80px; font-weight: 300;
  color: var(--gold); opacity: 0.3;
  line-height: 0.7; margin-bottom: 32px;
  display: block;
}
.testimonial-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 300; font-style: italic;
  line-height: 1.55; color: var(--cream);
  max-width: 780px; margin: 0 auto 40px;
}
.testimonial-author {
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--gold);
}
.testimonial-source {
  font-size: 11px; color: var(--muted); margin-top: 4px;
}
.stars {
  color: var(--gold); font-size: 16px;
  margin-bottom: 28px; letter-spacing: 4px;
}
.slider-dots {
  display: flex; justify-content: center; gap: 12px;
  margin-top: 48px;
}
.slider-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--muted); cursor: pointer;
  transition: all 0.3s; border: none;
}
.slider-dot.active {
  background: var(--gold);
  transform: scale(1.4);
}

/* ─── INSTAGRAM FEED ─── */
#social { background: var(--espresso); }
.insta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px; margin-top: 48px;
}
.insta-cell {
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer; position: relative;
}
.insta-bg {
  width: 100%; height: 100%;
  transition: transform 0.5s;
}
.insta-cell:hover .insta-bg { transform: scale(1.08); }
.insta-hover {
  position: absolute; inset: 0;
  background: rgba(26,18,8,0.7);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s;
}
.insta-cell:hover .insta-hover { opacity: 1; }
.insta-icon { font-size: 28px; color: var(--gold); }
.insta-follow {
  text-align: center; margin-top: 36px;
}
.insta-handle {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px; font-style: italic; font-weight: 300;
  color: var(--gold-light);
}

/* ─── FOOTER ─── */
footer {
  background: var(--espresso);
  border-top: 1px solid var(--border);
  padding: 60px 0 40px;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 60px;
}
.footer-top {
  display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 60px; margin-bottom: 60px;
}
.footer-brand-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 36px; font-weight: 300; letter-spacing: 0.2em;
  color: var(--gold); margin-bottom: 16px;
}
.footer-brand-tagline {
  font-size: 12px; letter-spacing: 0.15em;
  color: var(--muted); line-height: 1.7;
  margin-bottom: 24px;
}
.social-links { display: flex; gap: 14px; }
.social-link {
  width: 38px; height: 38px;
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--muted); font-size: 14px;
  text-decoration: none;
  transition: all 0.3s;
}
.social-link:hover { border-color: var(--gold); color: var(--gold); }
.footer-col-title {
  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 24px;
}
.footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.footer-links a {
  color: var(--muted); text-decoration: none; font-size: 13px;
  transition: color 0.3s;
}
.footer-links a:hover { color: var(--cream); }
.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 28px;
  display: flex; justify-content: space-between; align-items: center;
  flex-wrap: wrap; gap: 16px;
}
.footer-copy {
  font-size: 12px; color: var(--muted);
}
.footer-legal {
  display: flex; gap: 28px;
}
.footer-legal a {
  font-size: 12px; color: var(--muted); text-decoration: none;
  transition: color 0.3s;
}
.footer-legal a:hover { color: var(--cream); }

/* ─── MOBILE MENU ─── */
.mobile-menu {
  position: fixed; inset: 0; z-index: 900;
  background: var(--espresso);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 32px;
  transform: translateX(100%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.mobile-menu.open { transform: translateX(0); }
.mobile-menu a {
  font-family: 'Cormorant Garamond', serif;
  font-size: 40px; font-weight: 300;
  color: var(--cream); text-decoration: none;
  letter-spacing: 0.1em;
  transition: color 0.3s;
}
.mobile-menu a:hover { color: var(--gold); }
.mobile-close {
  position: absolute; top: 28px; right: 32px;
  background: none; border: none; color: var(--cream);
  font-size: 28px; cursor: pointer;
}

/* ─── ANIMATIONS ─── */
@keyframes riseUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes floatBean {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.3; }
  100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
}
@keyframes floatGently {
  0%, 100% { transform: translate(-50%,-50%) translateY(0); }
  50% { transform: translate(-50%,-50%) translateY(-12px); }
}
@keyframes scrollPulse {
  0%, 100% { opacity: 1; height: 60px; }
  50% { opacity: 0.4; height: 40px; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.3); }
}
@keyframes pinBounce {
  0%, 100% { transform: translate(-50%,-100%) translateY(0); }
  50% { transform: translate(-50%,-100%) translateY(-8px); }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* ─── SCROLL REVEAL ─── */
.reveal {
  opacity: 0; transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal.visible {
  opacity: 1; transform: translateY(0);
}
.reveal-left {
  opacity: 0; transform: translateX(-30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal-left.visible { opacity: 1; transform: translateX(0); }
.reveal-right {
  opacity: 0; transform: translateX(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal-right.visible { opacity: 1; transform: translateX(0); }

/* ─── NOISE TEXTURE ─── */
body::after {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 1; opacity: 0.3;
}

/* ─── RESPONSIVE ─── */
@media(max-width:900px){
  nav { padding: 20px 24px; }
  nav.scrolled { padding: 14px 24px; }
  .nav-links, .nav-reserve { display: none; }
  .hamburger { display: flex; }
  .section-inner { padding: 0 24px; }
  .about-grid, .location-grid { grid-template-columns: 1fr; }
  .timings-grid { grid-template-columns: 1fr; gap: 0; }
  .timing-divider { display: none; }
  .pricing-grid { grid-template-columns: 1fr; }
  .footer-top { grid-template-columns: 1fr 1fr; gap: 40px; }
  .insta-grid { grid-template-columns: repeat(2, 1fr); }
  .gallery-strip { flex-direction: column; height: auto; }
  .gallery-cell { height: 200px; flex: none; }
  .hero-stats { display: none; }
  .testimonial-slide { padding: 0 24px; }
  section { padding: 80px 0; }
}
@media(max-width:600px){
  .footer-top { grid-template-columns: 1fr; }
  .menu-grid { grid-template-columns: 1fr; }
  .about-features { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
}

/* Gold shimmer text effect */
.shimmer-text {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 40%, var(--gold) 60%, var(--gold-light) 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

/* Section alternating bg line detail */
.line-accent {
  width: 1px; height: 80px;
  background: linear-gradient(to bottom, transparent, var(--gold), transparent);
  margin: 0 auto; display: block;
}
`;

export default function App() {
  const [isLoaderDone, setIsLoaderDone] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('coffee');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroTransform, setHeroTransform] = useState({ y: 0, opacity: 1 });
  
  // Custom Cursor Refs
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const ringX = useRef(0);
  const ringY = useRef(0);
  const requestRef = useRef();

  // Floating Beans State
  const [beans, setBeans] = useState([]);

  useEffect(() => {
    // Generate Beans
    const newBeans = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      animationDuration: (8 + Math.random() * 12) + 's',
      animationDelay: (Math.random() * 8) + 's',
      width: (4 + Math.random() * 6) + 'px',
      height: (6 + Math.random() * 9) + 'px'
    }));
    setBeans(newBeans);

    // Loader Timeout
    const loaderTimer = setTimeout(() => {
      setIsLoaderDone(true);
    }, 2400);

    // Custom Cursor Logic
    const handleMouseMove = (e) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    
    const animateRing = () => {
      ringX.current += (mouseX.current - ringX.current) * 0.12;
      ringY.current += (mouseY.current - ringY.current) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX.current}px`;
        ringRef.current.style.top = `${ringY.current}px`;
      }
      requestRef.current = requestAnimationFrame(animateRing);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    requestRef.current = requestAnimationFrame(animateRing);

    // Scroll Logic (Nav + Parallax)
    const handleScroll = () => {
      const scrolled = window.scrollY;
      setIsScrolled(scrolled > 80);
      
      if (scrolled < window.innerHeight) {
        setHeroTransform({
          y: scrolled * 0.35,
          opacity: 1 - (scrolled / (window.innerHeight * 0.7))
        });
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Scroll Reveal Logic using Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          e.target.querySelectorAll('.menu-item, .feat-item, .price-card, .timing-col, .address-item, .insta-cell').forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.06}s`;
            child.style.opacity = '1';
            child.style.transform = 'none';
          });
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });

    // Cursor Hover Interactive Scale Effect
    const interactives = document.querySelectorAll('a, button, .menu-item, .gallery-cell');
    const handleMouseEnter = () => {
      if(cursorRef.current) { cursorRef.current.style.width = '20px'; cursorRef.current.style.height = '20px'; }
      if(ringRef.current) { ringRef.current.style.width = '60px'; ringRef.current.style.height = '60px'; }
    };
    const handleMouseLeave = () => {
      if(cursorRef.current) { cursorRef.current.style.width = '12px'; cursorRef.current.style.height = '12px'; }
      if(ringRef.current) { ringRef.current.style.width = '36px'; ringRef.current.style.height = '36px'; }
    };
    interactives.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      clearTimeout(loaderTimer);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
      observer.disconnect();
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isLoaderDone]); // Dependency to re-bind interactive elements if DOM tree updates

  // Testimonials Slider Loop
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 4);
    }, 5500);
    return () => clearInterval(slideInterval);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      
      <style dangerouslySetInnerHTML={{ __html: TRIESTO_CSS }} />

      {/* Cursor */}
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>

      {/* Loader */}
      <div id="loader" className={isLoaderDone ? 'done' : ''}>
        <div className="loader-logo shimmer-text">TRIESTO</div>
        <div style={{ fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '12px' }}>
          Coffee Roasters &amp; Italian Kitchen
        </div>
        <div className="loader-bar"><div className="loader-fill"></div></div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`} id="mobileMenu">
        <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>&times;</button>
        <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
        <a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menu</a>
        <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Experience</a>
        <a href="#timings" onClick={(e) => { e.preventDefault(); scrollToSection('timings'); }}>Visit</a>
        <a href="#location" onClick={(e) => { e.preventDefault(); scrollToSection('location'); }}>Location</a>
        <a href="#social" onClick={(e) => { e.preventDefault(); scrollToSection('social'); }}>Instagram</a>
      </div>

      {/* NAV */}
      <nav id="mainNav" className={isScrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">T<span>riesto</span></a>
        <ul className="nav-links">
          <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a></li>
          <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }}>Menu</a></li>
          <li><a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Experience</a></li>
          <li><a href="#timings" onClick={(e) => { e.preventDefault(); scrollToSection('timings'); }}>Visit</a></li>
          <li><a href="#location" onClick={(e) => { e.preventDefault(); scrollToSection('location'); }}>Location</a></li>
          <li><a href="tel:09781213139" className="nav-reserve">Reserve</a></li>
        </ul>
        <div className="hamburger" onClick={() => setMobileMenuOpen(true)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero">
        <div className="hero-bg"></div>
        <div className="hero-beans" id="heroBeans">
          {beans.map(bean => (
            <div key={bean.id} className="bean" style={{
              left: bean.left,
              animationDuration: bean.animationDuration,
              animationDelay: bean.animationDelay,
              width: bean.width,
              height: bean.height
            }}></div>
          ))}
        </div>
        <div className="hero-overlay"></div>

        {/* Decorative SVG Background Art */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }} viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
          <circle cx="700" cy="400" r="350" fill="none" stroke="#C8963E" strokeWidth="0.5" />
          <circle cx="700" cy="400" r="280" fill="none" stroke="#C8963E" strokeWidth="0.5" />
          <circle cx="700" cy="400" r="210" fill="none" stroke="#C8963E" strokeWidth="0.5" />
          <line x1="0" y1="400" x2="1400" y2="400" stroke="#C8963E" strokeWidth="0.3" />
          <line x1="700" y1="0" x2="700" y2="800" stroke="#C8963E" strokeWidth="0.3" />
          <line x1="0" y1="0" x2="1400" y2="800" stroke="#C8963E" strokeWidth="0.2" />
          <line x1="1400" y1="0" x2="0" y2="800" stroke="#C8963E" strokeWidth="0.2" />
          <circle cx="350" cy="200" r="4" fill="#C8963E" />
          <circle cx="1050" cy="200" r="4" fill="#C8963E" />
          <circle cx="350" cy="600" r="4" fill="#C8963E" />
          <circle cx="1050" cy="600" r="4" fill="#C8963E" />
        </svg>

        <div className="hero-content" style={{ transform: `translateY(${heroTransform.y}px)`, opacity: heroTransform.opacity }}>
          <span className="hero-tag">☕ Mohali's Premier Coffee Destination</span>
          <h1 className="hero-title">
            Triesto
            <em>Café</em>
          </h1>
          <p className="hero-subtitle">Coffee Roasters &amp; Italian Kitchen · Sector 78, Mohali</p>
          <div className="hero-cta-group">
            <a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); }} className="btn-primary">Explore Menu</a>
            <a href="#location" onClick={(e) => { e.preventDefault(); scrollToSection('location'); }} className="btn-outline">Find Us</a>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-num">4.7</span>
            <div className="stat-label">Rating</div>
          </div>
          <div className="stat-item">
            <span className="stat-num">35+</span>
            <div className="stat-label">Reviews</div>
          </div>
          <div className="stat-item">
            <span className="stat-num">11:30</span>
            <div className="stat-label">Open Till</div>
          </div>
        </div>

        <div className="hero-scroll" onClick={() => scrollToSection('about')}>
          <div className="scroll-line"></div>
          <span className="scroll-text">Scroll</span>
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div className="marquee-section">
        <div className="marquee-track">
          <div className="marquee-item">
            <span className="marquee-dot"></span>Single Origin Espresso
            <span className="marquee-dot"></span>Italian Kitchen
            <span className="marquee-dot"></span>Cold Brew &amp; Pour Over
            <span className="marquee-dot"></span>Handcrafted Pasta
            <span className="marquee-dot"></span>Specialty Lattes
            <span className="marquee-dot"></span>Wood-Fired Pizza
            <span className="marquee-dot"></span>Artisanal Desserts
            <span className="marquee-dot"></span>Coffee Roasters
            <span className="marquee-dot"></span>Mohali's Finest
          </div>
          <div className="marquee-item" aria-hidden="true">
            <span className="marquee-dot"></span>Single Origin Espresso
            <span className="marquee-dot"></span>Italian Kitchen
            <span className="marquee-dot"></span>Cold Brew &amp; Pour Over
            <span className="marquee-dot"></span>Handcrafted Pasta
            <span className="marquee-dot"></span>Specialty Lattes
            <span className="marquee-dot"></span>Wood-Fired Pizza
            <span className="marquee-dot"></span>Artisanal Desserts
            <span className="marquee-dot"></span>Coffee Roasters
            <span className="marquee-dot"></span>Mohali's Finest
          </div>
        </div>
      </div>

      {/* ═══ ABOUT ═══ */}
      <section id="about">
        <div className="section-inner">
          <div className="about-grid">
            <div className="about-visual reveal-left">
              <div className="about-frame">
                <div className="about-frame-art">
                   <Image
  src="/images/cafe-about.png"
  alt="Triesto Cafe"
  fill
  className="about-img"
  style={{ objectFit: "cover" }}
/>
                  {/* <svg viewBox="0 0 400 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="500" fill="#1E1006" />
                    <circle cx="200" cy="250" r="200" fill="#2C1810" opacity="0.5" />
                    <circle cx="200" cy="250" r="160" fill="none" stroke="#C8963E" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="200" cy="250" r="130" fill="none" stroke="#C8963E" strokeWidth="0.5" opacity="0.2" />
                    <path d="M120 200 L130 340 Q200 360 270 340 L280 200 Z" fill="#3D2210" stroke="#C8963E" strokeWidth="1.5" />
                    <ellipse cx="200" cy="200" rx="80" ry="20" fill="#4A2A14" stroke="#C8963E" strokeWidth="1.5" />
                    <ellipse cx="200" cy="200" rx="72" ry="16" fill="#6B3A1F" />
                    <ellipse cx="200" cy="200" rx="50" ry="11" fill="#8B5A2B" opacity="0.7" />
                    <path d="M180 196 Q200 188 220 196 Q210 206 200 204 Q190 206 180 196Z" fill="#C8963E" opacity="0.8" />
                    <path d="M280 220 Q320 220 320 260 Q320 300 280 300" fill="none" stroke="#C8963E" strokeWidth="8" strokeLinecap="round" />
                    <ellipse cx="200" cy="350" rx="100" ry="18" fill="#3D2210" stroke="#C8963E" strokeWidth="1" />
                    <ellipse cx="200" cy="350" rx="88" ry="14" fill="#4A2A14" opacity="0.5" />
                    <path d="M170 180 Q165 165 172 150 Q178 135 173 120" fill="none" stroke="#C8963E" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" className="steam1" style={{ animation: `scrollPulse 1.5s ease-in-out infinite 0s` }} />
                    <path d="M200 178 Q196 162 203 148 Q209 132 204 118" fill="none" stroke="#C8963E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" className="steam2" style={{ animation: `scrollPulse 1.8s ease-in-out infinite 0.2s` }} />
                    <path d="M230 180 Q235 163 228 150 Q222 135 228 120" fill="none" stroke="#C8963E" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" className="steam3" style={{ animation: `scrollPulse 2.1s ease-in-out infinite 0.4s` }} />
                    <ellipse cx="140" cy="420" rx="14" ry="9" fill="#5A3018" transform="rotate(-20 140 420)" />
                    <line x1="140" y1="413" x2="140" y2="427" stroke="#3A1E0C" strokeWidth="1" />
                    <ellipse cx="260" cy="430" rx="14" ry="9" fill="#5A3018" transform="rotate(15 260 430)" />
                    <line x1="260" y1="423" x2="260" y2="437" stroke="#3A1E0C" strokeWidth="1" />
                    <ellipse cx="310" cy="160" rx="12" ry="7" fill="#5A3018" transform="rotate(30 310 160)" />
                    <ellipse cx="90" cy="160" rx="12" ry="7" fill="#5A3018" transform="rotate(-25 90 160)" />
                    <circle cx="200" cy="80" r="3" fill="#C8963E" opacity="0.7" />
                    <circle cx="200" cy="440" r="3" fill="#C8963E" opacity="0.7" />
                    <circle cx="60" cy="250" r="3" fill="#C8963E" opacity="0.5" />
                    <circle cx="340" cy="250" r="3" fill="#C8963E" opacity="0.5" />
                  </svg> */}
                </div>
              </div>
              <div className="about-badge">
                <span className="badge-num">4.7</span>
                <span className="badge-text">★ Rated<br />Mohali</span>
              </div>
            </div>

            <div className="reveal-right">
              <span className="section-label">Our Story</span>
              <h2 className="section-title">Where Coffee<br />Becomes <em>Art</em></h2>
              <div className="divider"></div>
              <p className="section-body">
                Nestled in the heart of Sector 78, Mohali — Triesto is more than a café. It's a sanctuary for those who seek the extraordinary in every sip. Born from a passion for specialty coffee and the timeless craft of Italian cuisine, we bring together world-class roasting, artisanal brewing, and the warmth of Italian kitchen traditions.
              </p>
              <p className="section-body" style={{ marginTop: '20px' }}>
                Every bean we roast is a story. Every dish we plate is an expression. From single-origin pour-overs to handcrafted pasta, Triesto is Mohali's destination for those who live beautifully.
              </p>

              <div className="about-features">
                <div className="feat-item">
                  <span className="feat-icon">☕</span>
                  <div className="feat-title">Single Origin</div>
                  <div className="feat-desc">Sourced from the world's finest coffee estates</div>
                </div>
                <div className="feat-item">
                  <span className="feat-icon">🍝</span>
                  <div className="feat-title">Italian Kitchen</div>
                  <div className="feat-desc">Authentic recipes, freshest ingredients</div>
                </div>
                <div className="feat-item">
                  <span className="feat-icon">🔥</span>
                  <div className="feat-title">In-House Roasting</div>
                  <div className="feat-desc">Roasted fresh for peak aroma &amp; flavour</div>
                </div>
                <div className="feat-item">
                  <span className="feat-icon">🌙</span>
                  <div className="feat-title">Open Late</div>
                  <div className="feat-desc">Till 11:30 PM every day of the week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MENU ═══ */}
      <section id="menu">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="section-label">What We Serve</span>
            <h2 className="section-title">The <em>Menu</em></h2>
            <p className="section-body" style={{ margin: '20px auto 0', textAlign: 'center' }}>
              Crafted with intention. Served with care. Every item a reason to stay a little longer.
            </p>
          </div>

          <div className="menu-tabs reveal">
            <button className={`menu-tab ${activeTab === 'coffee' ? 'active' : ''}`} onClick={() => setActiveTab('coffee')}>☕ Coffee</button>
            <button className={`menu-tab ${activeTab === 'coldbrews' ? 'active' : ''}`} onClick={() => setActiveTab('coldbrews')}>🧊 Cold Brews</button>
            <button className={`menu-tab ${activeTab === 'pasta' ? 'active' : ''}`} onClick={() => setActiveTab('pasta')}>🍝 Pasta</button>
            <button className={`menu-tab ${activeTab === 'pizza' ? 'active' : ''}`} onClick={() => setActiveTab('pizza')}>🍕 Pizza</button>
            <button className={`menu-tab ${activeTab === 'mains' ? 'active' : ''}`} onClick={() => setActiveTab('mains')}>🍽 Mains</button>
            <button className={`menu-tab ${activeTab === 'desserts' ? 'active' : ''}`} onClick={() => setActiveTab('desserts')}>🍮 Desserts</button>
            <button className={`menu-tab ${activeTab === 'shakes' ? 'active' : ''}`} onClick={() => setActiveTab('shakes')}>🥤 Shakes</button>
          </div>

          {/* COFFEE */}
          <div className={`menu-panel ${activeTab === 'coffee' ? 'active' : ''}`} id="tab-coffee">
            <div className="menu-grid">
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Triesto Signature Espresso</span><span className="item-price">₹220</span></div>
                <div className="item-desc">Our house blend — a deep, velvety single shot roasted to perfection in-house</div>
                <span className="item-tag">Signature</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Flat White</span><span className="item-price">₹280</span></div>
                <div className="item-desc">Double ristretto with silky micro-foam steamed whole milk. Melbourne-style.</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Cappuccino</span><span className="item-price">₹260</span></div>
                <div className="item-desc">Equal parts espresso, steamed milk, and thick velvety foam. Classic Italian.</div>
                <span className="item-tag">Bestseller</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Caramel Latte</span><span className="item-price">₹320</span></div>
                <div className="item-desc">Espresso, steamed milk, house-made salted caramel drizzle</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Pour Over – Single Origin</span><span className="item-price">₹380</span></div>
                <div className="item-desc">Slow-brewed, rotating origin — ask your barista for today's selection</div>
                <span className="item-tag">Specialty</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Affogato</span><span className="item-price">₹350</span></div>
                <div className="item-desc">Vanilla gelato drowned in a hot double espresso shot</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Spanish Latte</span><span className="item-price">₹340</span></div>
                <div className="item-desc">Condensed milk base with espresso and steamed whole milk. Sweet, bold, smooth.</div>
                <span className="item-tag">Popular</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Americano</span><span className="item-price">₹220</span></div>
                <div className="item-desc">Double espresso diluted with hot water — clean, bold, no compromise</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Filter Coffee</span><span className="item-price">₹200</span></div>
                <div className="item-desc">South Indian filter decoction with steamed milk — nostalgic comfort</div>
              </div>
            </div>
          </div>

          {/* COLD BREWS */}
          <div className={`menu-panel ${activeTab === 'coldbrews' ? 'active' : ''}`} id="tab-coldbrews">
            <div className="menu-grid">
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Cold Brew Classic</span><span className="item-price">₹320</span></div>
                <div className="item-desc">18-hour cold-steeped concentrate. Smooth, naturally sweet, zero bitterness.</div>
                <span className="item-tag">Signature</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Dalgona Cold Brew</span><span className="item-price">₹380</span></div>
                <div className="item-desc">Whipped cold brew foam atop chilled milk — the showstopper</div>
                <span className="item-tag">Bestseller</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Vietnamese Cold Coffee</span><span className="item-price">₹340</span></div>
                <div className="item-desc">Robusta drip over sweetened condensed milk and ice</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Cold Brew Tonic</span><span className="item-price">₹360</span></div>
                <div className="item-desc">Cold brew poured over tonic water with a slice of citrus. Unexpectedly brilliant.</div>
                <span className="item-tag">Unique</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Iced Caramel Macchiato</span><span className="item-price">₹360</span></div>
                <div className="item-desc">Vanilla milk, espresso poured over ice, finished with caramel drizzle</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Nitro Cold Brew</span><span className="item-price">₹420</span></div>
                <div className="item-desc">Cold brew infused with nitrogen — cascading, creamy, no dairy needed</div>
                <span className="item-tag">Premium</span>
              </div>
            </div>
          </div>

          {/* PASTA */}
          <div className={`menu-panel ${activeTab === 'pasta' ? 'active' : ''}`} id="tab-pasta">
            <div className="menu-grid">
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Cacio e Pepe</span><span className="item-price">₹480</span></div>
                <div className="item-desc">Tonnarelli pasta, pecorino romano, freshly cracked black pepper. Roman tradition.</div>
                <span className="item-tag">Chef's Favourite</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Penne Arrabbiata</span><span className="item-price">₹440</span></div>
                <div className="item-desc">Spicy San Marzano tomato, garlic, chilli, fresh basil, parmigiano</div>
                <span className="item-tag">Spicy</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Chicken Alfredo</span><span className="item-price">₹560</span></div>
                <div className="item-desc">Fettuccine in a cream reduction with roasted chicken, parmesan, nutmeg</div>
                <span className="item-tag">Bestseller</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Mushroom Truffle Pasta</span><span className="item-price">₹580</span></div>
                <div className="item-desc">Wild mushrooms, truffle oil, cream, shaved parmigiano, micro herbs</div>
                <span className="item-tag">Premium ✦</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Pasta Pomodoro</span><span className="item-price">₹400</span></div>
                <div className="item-desc">Spaghetti, slow-cooked tomato, extra virgin olive oil, garlic, fresh basil</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Spinach Ricotta Ravioli</span><span className="item-price">₹540</span></div>
                <div className="item-desc">Handmade pasta parcels with sage butter, walnuts, parmigiano</div>
                <span className="item-tag">Handmade</span>
              </div>
            </div>
          </div>

          {/* PIZZA */}
          <div className={`menu-panel ${activeTab === 'pizza' ? 'active' : ''}`} id="tab-pizza">
            <div className="menu-grid">
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Margherita Classica</span><span className="item-price">₹520</span></div>
                <div className="item-desc">San Marzano tomato, fior di latte mozzarella, fresh basil, EVOO. The purist's choice.</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Quattro Formaggi</span><span className="item-price">₹620</span></div>
                <div className="item-desc">Four cheese blend — mozzarella, gorgonzola, gruyère, parmigiano</div>
                <span className="item-tag">Bestseller</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Pollo e Funghi</span><span className="item-price">₹660</span></div>
                <div className="item-desc">Grilled chicken, mushrooms, cream base, caramelised onions, mozzarella</div>
                <span className="item-tag">Popular</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Diavola</span><span className="item-price">₹640</span></div>
                <div className="item-desc">Spicy salami, nduja, chilli honey, mozzarella on a tomato base</div>
                <span className="item-tag">Fiery 🔥</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Truffle Bianca</span><span className="item-price">₹720</span></div>
                <div className="item-desc">White base, truffle cream, mushrooms, egg, parmigiano, rocket</div>
                <span className="item-tag">Premium ✦</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Calzone</span><span className="item-price">₹580</span></div>
                <div className="item-desc">Folded pizza with ricotta, mozzarella, spinach — baked to golden perfection</div>
              </div>
            </div>
          </div>

          {/* MAINS */}
          <div className={`menu-panel ${activeTab === 'mains' ? 'active' : ''}`} id="tab-mains">
            <div className="menu-grid">
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Risotto ai Funghi</span><span className="item-price">₹560</span></div>
                <div className="item-desc">Arborio rice, wild mushroom consommé, white wine reduction, truffle oil</div>
                <span className="item-tag">Chef's Choice</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Chicken Parmigiana</span><span className="item-price">₹620</span></div>
                <div className="item-desc">Breaded chicken breast, pomodoro, melted mozzarella, served with ciabatta</div>
                <span className="item-tag">Bestseller</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Caesar Salad</span><span className="item-price">₹380</span></div>
                <div className="item-desc">Romaine, house Caesar dressing, croutons, shaved parmesan, anchovies optional</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Bruschetta Platter</span><span className="item-price">₹360</span></div>
                <div className="item-desc">Toasted sourdough, heirloom tomatoes, fresh basil, aged balsamic reduction</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Garlic Bread (Focaccia)</span><span className="item-price">₹240</span></div>
                <div className="item-desc">House-baked focaccia with garlic butter, rosemary, fleur de sel</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Tomato Basil Soup</span><span className="item-price">₹280</span></div>
                <div className="item-desc">Roasted tomato bisque with crème fraiche, basil oil, toasted seeds</div>
              </div>
            </div>
          </div>

          {/* DESSERTS */}
          <div className={`menu-panel ${activeTab === 'desserts' ? 'active' : ''}`} id="tab-desserts">
            <div className="menu-grid">
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Tiramisu</span><span className="item-price">₹380</span></div>
                <div className="item-desc">Savoiardi soaked in our own espresso, mascarpone cream, dark cocoa dusting</div>
                <span className="item-tag">Signature ✦</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Panna Cotta</span><span className="item-price">₹320</span></div>
                <div className="item-desc">Vanilla bean cream, seasonal berry compote, almond tuile</div>
                <span className="item-tag">Bestseller</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Chocolate Fondant</span><span className="item-price">₹420</span></div>
                <div className="item-desc">Valrhona dark chocolate with a molten centre, vanilla bean gelato</div>
                <span className="item-tag">Must Try</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Cannoli</span><span className="item-price">₹280</span></div>
                <div className="item-desc">Crispy shell filled with sweet ricotta, candied orange peel, pistachios</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Lemon Tart</span><span className="item-price">₹340</span></div>
                <div className="item-desc">Citrus curd in a sablée shell with Italian meringue, lemon zest</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Gelato (3 Scoops)</span><span className="item-price">₹300</span></div>
                <div className="item-desc">Choose three from our rotating seasonal flavours — ask your server today</div>
              </div>
            </div>
          </div>

          {/* SHAKES */}
          <div className={`menu-panel ${activeTab === 'shakes' ? 'active' : ''}`} id="tab-shakes">
            <div className="menu-grid">
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Classic Cold Coffee</span><span className="item-price">₹280</span></div>
                <div className="item-desc">Blended espresso, milk, ice cream — the old school standard done perfectly</div>
                <span className="item-tag">Bestseller</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Hazelnut Mocha Shake</span><span className="item-price">₹360</span></div>
                <div className="item-desc">Espresso, Nutella, chocolate, milk, whipped cream — pure indulgence</div>
                <span className="item-tag">Crowd Favourite</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Mango Lassi</span><span className="item-price">₹260</span></div>
                <div className="item-desc">Alphonso mango, hung curd, cardamom, rose water — an Indian classic</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Triesto Frappe</span><span className="item-price">₹380</span></div>
                <div className="item-desc">Frozen espresso, caramel, milk foam, house syrup — our signature blend</div>
                <span className="item-tag">Signature</span>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Berry Compote Milkshake</span><span className="item-price">₹340</span></div>
                <div className="item-desc">Mixed berry reduction, vanilla ice cream, whole milk, fresh mint</div>
              </div>
              <div className="menu-item">
                <div className="item-top"><span className="item-name">Hot Chocolate Espressivo</span><span className="item-price">₹300</span></div>
                <div className="item-desc">Rich Valrhona cocoa, espresso shot, steamed milk, cinnamon dust</div>
                <span className="item-tag">Seasonal</span>
              </div>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '36px', fontSize: '13px', color: 'var(--muted)', letterSpacing: '0.05em' }}>
            Prices are indicative. Final menu &amp; pricing at the café. All items subject to 5% GST. ·
            <span style={{ color: 'var(--gold)' }}> ₹400–1,600 per person</span>
          </p>
        </div>
      </section>

      {/* ═══ EXPERIENCE ═══ */}
      <section id="experience" style={{ padding: '120px 0 0' }}>
        <div className="section-inner reveal" style={{ marginBottom: 0, paddingBottom: 0 }}>
          <span className="section-label">The Atmosphere</span>
          <h2 className="section-title">An <em>Experience</em><br />Unlike Any Other</h2>
          <p className="section-body" style={{ marginTop: '20px' }}>
            From the warm amber light to the scent of freshly roasted beans — every corner of Triesto is designed to make you feel at home in the most exquisite way.
          </p>
        </div>

        <div className="gallery-strip" style={{ marginTop: '60px' }}>
          <div className="gallery-cell">
            <div className="cell-bg">
              <svg viewBox="0 0 280 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <rect width="280" height="520" fill="#2C1810" />
                <circle cx="140" cy="260" r="180" fill="#3D2010" opacity="0.6" />
                <circle cx="140" cy="260" r="100" fill="#4A2510" opacity="0.5" />
                <rect x="60" y="180" width="160" height="200" rx="8" fill="#1A0E06" stroke="#C8963E" strokeWidth="1" />
                <rect x="80" y="160" width="120" height="40" rx="4" fill="#241408" stroke="#C8963E" strokeWidth="0.5" />
                <circle cx="140" cy="250" r="30" fill="none" stroke="#C8963E" strokeWidth="2" />
                <circle cx="140" cy="250" r="20" fill="#C8963E" opacity="0.3" />
                <rect x="100" y="340" width="80" height="30" rx="3" fill="#241408" stroke="#C8963E" strokeWidth="0.5" />
                <rect x="90" y="370" width="100" height="10" rx="2" fill="#3D2010" />
                <rect x="85" y="355" width="20" height="15" rx="2" fill="#C8963E" opacity="0.7" />
                <rect x="175" y="355" width="20" height="15" rx="2" fill="#C8963E" opacity="0.7" />
                <path d="M125 178 Q120 165 127 152" fill="none" stroke="#C8963E" strokeWidth="1" opacity="0.4" />
                <path d="M140 175 Q136 160 143 147" fill="none" stroke="#C8963E" strokeWidth="1" opacity="0.3" />
                <path d="M155 178 Q160 163 153 150" fill="none" stroke="#C8963E" strokeWidth="1" opacity="0.4" />
                <text x="140" y="490" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="14" fill="#C8963E" opacity="0.7">The Bar</text>
              </svg>
            </div>
            <div className="cell-overlay"></div>
            <div className="cell-info">
              <div className="cell-label">The Brew Bar</div>
              <div className="cell-sub">Specialty Coffee Station</div>
            </div>
          </div>

          <div className="gallery-cell">
            <div className="cell-bg">
              <svg viewBox="0 0 280 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <rect width="280" height="520" fill="#1A2410" />
                <circle cx="140" cy="260" r="180" fill="#1E2E10" opacity="0.6" />
                <ellipse cx="140" cy="300" rx="80" ry="15" fill="#2C1810" stroke="#C8963E" strokeWidth="0.5" />
                <rect x="100" y="220" width="80" height="80" rx="4" fill="#3D2A10" stroke="#C8963E" strokeWidth="0.5" />
                <circle cx="130" cy="270" r="25" fill="#2C2010" stroke="#C8963E" strokeWidth="0.5" />
                <circle cx="130" cy="270" r="18" fill="#3D2A14" opacity="0.7" />
                <path d="M155 240 Q155 260 150 270 Q155 275 162 275 Q169 275 174 270 Q169 260 169 240 Z" fill="none" stroke="#C8963E" strokeWidth="1" />
                <line x1="162" y1="275" x2="162" y2="285" stroke="#C8963E" strokeWidth="1" />
                <line x1="155" y1="285" x2="169" y2="285" stroke="#C8963E" strokeWidth="1" />
                <rect x="120" y="215" width="5" height="20" fill="#F5EFE0" opacity="0.8" />
                <circle cx="122" cy="213" r="4" fill="#E8A020" opacity="0.9" />
                <ellipse cx="80" cy="150" rx="6" ry="3" fill="#C8963E" opacity="0.3" transform="rotate(30 80 150)" />
                <ellipse cx="200" cy="400" rx="6" ry="3" fill="#C8963E" opacity="0.3" transform="rotate(-20 200 400)" />
                <text x="140" y="490" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="14" fill="#C8963E" opacity="0.7">Dine In</text>
              </svg>
            </div>
            <div className="cell-overlay"></div>
            <div className="cell-info">
              <div className="cell-label">Fine Dining</div>
              <div className="cell-sub">Italian Kitchen</div>
            </div>
          </div>

          <div className="gallery-cell" style={{ flex: 2 }}>
            <div className="cell-bg">
              <svg viewBox="0 0 560 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <rect width="560" height="520" fill="#100D1A" />
                <circle cx="100" cy="100" r="60" fill="#C8963E" opacity="0.04" />
                <circle cx="460" cy="420" r="80" fill="#C8963E" opacity="0.05" />
                <circle cx="280" cy="260" r="120" fill="#3D2010" opacity="0.3" />
                <path d="M150 520 L150 200 Q280 80 410 200 L410 520" fill="none" stroke="#C8963E" strokeWidth="0.5" opacity="0.4" />
                <line x1="160" y1="0" x2="160" y2="120" stroke="#C8963E" strokeWidth="0.5" opacity="0.5" />
                <circle cx="160" cy="130" r="16" fill="#C8963E" opacity="0.2" stroke="#C8963E" strokeWidth="1" />
                <circle cx="160" cy="130" r="8" fill="#C8963E" opacity="0.4" />
                <line x1="280" y1="0" x2="280" y2="100" stroke="#C8963E" strokeWidth="0.5" opacity="0.5" />
                <circle cx="280" cy="110" r="16" fill="#C8963E" opacity="0.2" stroke="#C8963E" strokeWidth="1" />
                <circle cx="280" cy="110" r="8" fill="#C8963E" opacity="0.4" />
                <line x1="400" y1="0" x2="400" y2="120" stroke="#C8963E" strokeWidth="0.5" opacity="0.5" />
                <circle cx="400" cy="130" r="16" fill="#C8963E" opacity="0.2" stroke="#C8963E" strokeWidth="1" />
                <circle cx="400" cy="130" r="8" fill="#C8963E" opacity="0.4" />
                <text x="280" y="290" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="72" fontWeight="300" fill="#C8963E" opacity="0.12" letterSpacing="20">TRIESTO</text>
                <text x="280" y="340" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="18" fontStyle="italic" fill="#C8963E" opacity="0.4">Coffee Roasters &amp; Italian Kitchen</text>
                <g opacity="0.08">
                  <line x1="0" y1="420" x2="560" y2="420" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="0" y1="450" x2="560" y2="450" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="0" y1="480" x2="560" y2="480" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="70" y1="420" x2="70" y2="520" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="140" y1="420" x2="140" y2="520" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="210" y1="420" x2="210" y2="520" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="280" y1="420" x2="280" y2="520" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="350" y1="420" x2="350" y2="520" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="420" y1="420" x2="420" y2="520" stroke="#C8963E" strokeWidth="0.5" />
                  <line x1="490" y1="420" x2="490" y2="520" stroke="#C8963E" strokeWidth="0.5" />
                </g>
                <text x="280" y="490" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="14" fill="#C8963E" opacity="0.7">Sector 78, Mohali</text>
              </svg>
            </div>
            <div className="cell-overlay"></div>
            <div className="cell-info">
              <div className="cell-label">The Triesto Ambience</div>
              <div className="cell-sub">Where every visit is memorable</div>
            </div>
          </div>

          <div className="gallery-cell">
            <div className="cell-bg">
              <svg viewBox="0 0 280 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <rect width="280" height="520" fill="#1A1008" />
                <circle cx="140" cy="260" r="140" fill="#2C1A08" opacity="0.5" />
                <g opacity="0.9">
                  <ellipse cx="100" cy="180" rx="22" ry="14" fill="#5A3018" transform="rotate(-20 100 180)" />
                  <line x1="100" y1="168" x2="100" y2="192" stroke="#3A1E0C" strokeWidth="1.5" />
                  <ellipse cx="180" cy="160" rx="22" ry="14" fill="#6B3A20" transform="rotate(15 180 160)" />
                  <line x1="180" y1="148" x2="180" y2="172" stroke="#3A1E0C" strokeWidth="1.5" />
                  <ellipse cx="140" cy="240" rx="28" ry="18" fill="#7A4225" transform="rotate(-5 140 240)" />
                  <line x1="140" y1="225" x2="140" y2="255" stroke="#3A1E0C" strokeWidth="2" />
                  <ellipse cx="90" cy="310" rx="22" ry="14" fill="#5A3018" transform="rotate(25 90 310)" />
                  <line x1="90" y1="298" x2="90" y2="322" stroke="#3A1E0C" strokeWidth="1.5" />
                  <ellipse cx="190" cy="300" rx="22" ry="14" fill="#6B3A20" transform="rotate(-10 190 300)" />
                  <line x1="190" y1="288" x2="190" y2="312" stroke="#3A1E0C" strokeWidth="1.5" />
                  <ellipse cx="140" cy="380" rx="22" ry="14" fill="#5A3018" transform="rotate(35 140 380)" />
                  <line x1="140" y1="368" x2="140" y2="392" stroke="#3A1E0C" strokeWidth="1.5" />
                </g>
                <text x="140" y="460" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="13" fill="#C8963E" opacity="0.7">Specialty Beans</text>
                <text x="140" y="490" textAnchor="middle" fontFamily="Jost" fontSize="9" fill="#C8963E" opacity="0.4" letterSpacing="3">SINGLE ORIGIN</text>
              </svg>
            </div>
            <div className="cell-overlay"></div>
            <div className="cell-info">
              <div className="cell-label">The Roastery</div>
              <div className="cell-sub">Single Origin Beans</div>
            </div>
          </div>

          <div className="gallery-cell">
            <div className="cell-bg">
              <svg viewBox="0 0 280 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
                <rect width="280" height="520" fill="#1A1810" />
                <circle cx="140" cy="260" r="150" fill="#2C2410" opacity="0.5" />
                <rect x="60" y="230" width="160" height="100" rx="8" fill="#3D2A14" stroke="#C8963E" strokeWidth="0.5" />
                <rect x="60" y="230" width="160" height="28" rx="6" fill="#F5EFE0" opacity="0.15" />
                <rect x="60" y="258" width="160" height="28" fill="#5A3018" opacity="0.8" />
                <rect x="60" y="286" width="160" height="28" fill="#F5EFE0" opacity="0.12" />
                <rect x="60" y="314" width="160" height="16" rx="0" fill="#3D2010" opacity="0.7" />
                <circle cx="90" cy="242" r="2" fill="#2C1810" opacity="0.5" />
                <circle cx="110" cy="246" r="1.5" fill="#2C1810" opacity="0.4" />
                <circle cx="150" cy="240" r="2" fill="#2C1810" opacity="0.5" />
                <circle cx="180" cy="244" r="1.5" fill="#2C1810" opacity="0.4" />
                <line x1="220" y1="200" x2="220" y2="350" stroke="#C8963E" strokeWidth="1" opacity="0.6" />
                <line x1="215" y1="200" x2="215" y2="220" stroke="#C8963E" strokeWidth="1" opacity="0.6" />
                <line x1="225" y1="200" x2="225" y2="220" stroke="#C8963E" strokeWidth="1" opacity="0.6" />
                <text x="140" y="390" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="18" fontStyle="italic" fill="#C8963E" opacity="0.8">Tiramisu</text>
                <text x="140" y="490" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="14" fill="#C8963E" opacity="0.7">Desserts</text>
              </svg>
            </div>
            <div className="cell-overlay"></div>
            <div className="cell-info">
              <div className="cell-label">Dolci Italiani</div>
              <div className="cell-sub">Authentic Desserts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TIMINGS ═══ */}
      <section id="timings">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <span className="section-label">Plan Your Visit</span>
            <h2 className="section-title">We're <em>Open</em> For You</h2>
          </div>

          <div className="timings-grid reveal">
            <div className="timing-col">
              <span className="timing-icon">☀️</span>
              <div className="timing-day">Monday – Thursday</div>
              <div className="timing-hours">12:00 PM<br />— 11:30 PM</div>
              <div className="timing-note">Lunch service from noon<br />Kitchen closes at 11:00 PM</div>
              <div className="open-badge">
                <span className="open-dot"></span>
                Open Today
              </div>
            </div>
            <div className="timing-divider"></div>
            <div className="timing-col">
              <span className="timing-icon">🌆</span>
              <div className="timing-day">Friday – Saturday</div>
              <div className="timing-hours">11:00 AM<br />— 11:30 PM</div>
              <div className="timing-note">Extended weekend hours<br />Brunch available from 11 AM</div>
              <div className="open-badge">
                <span className="open-dot"></span>
                Open Today
              </div>
            </div>
            <div className="timing-divider"></div>
            <div className="timing-col">
              <span className="timing-icon">🌿</span>
              <div className="timing-day">Sunday</div>
              <div className="timing-hours">11:00 AM<br />— 11:30 PM</div>
              <div className="timing-note">Lazy Sunday brunch &amp; coffee<br />All-day Italian kitchen</div>
              <div className="open-badge">
                <span className="open-dot"></span>
                Open Today
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '60px', paddingTop: '60px' }}>
            <div className="reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="section-label">Price Guide</span>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, color: 'var(--cream)' }}>
                For Every <em style={{ color: 'var(--gold-light)', fontStyle: 'italic' }}>Occasion</em>
              </h3>
            </div>
            <div className="pricing-grid reveal">
              <div className="price-card">
                <div className="price-range shimmer-text">₹400</div>
                <div className="price-label">Coffee &amp; Light Bites</div>
                <div className="price-desc">Perfect for a quick espresso date, casual chai break, or a pastry &amp; pour-over afternoon</div>
              </div>
              <div className="price-card" style={{ borderColor: 'var(--gold)' }}>
                <div style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '8px' }}>Most Popular</div>
                <div className="price-range shimmer-text">₹800</div>
                <div className="price-label">Full Meal Experience</div>
                <div className="price-desc">Starter, a main course pasta or pizza, and a specialty coffee or dessert — the complete Triesto experience</div>
              </div>
              <div className="price-card">
                <div className="price-range shimmer-text">₹1,600</div>
                <div className="price-label">Premium Dining</div>
                <div className="price-desc">Multi-course Italian spread — antipasti, signature pasta, premium pizza, desserts &amp; wine</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ LOCATION ═══ */}
      <section id="location">
        <div className="section-inner">
          <div className="reveal" style={{ marginBottom: '60px' }}>
            <span className="section-label">Find Us</span>
            <h2 className="section-title">Come <em>Visit</em> Us</h2>
            <p className="section-body" style={{ marginTop: '16px' }}>
              Tucked beside the iconic Gurudwara Singh Shaheedan in Sector 78 — Triesto is a landmark of its own. 19 minutes from Chandigarh city centre.
            </p>
          </div>

          <div className="location-grid">
            <div className="reveal-left">
              <div className="map-container">
                <div className="map-frame">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.7!2d76.7!3d30.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fed5a1234:0x0!2sTriesto+Cafe+Sector+78+Mohali!5e0!3m2!1sen!2sin!4v1"
                    allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                    title="Triesto Cafe Location"
                  ></iframe>
                </div>
              </div>
              <a href="https://maps.google.com/?q=Triesto+Cafe+Sector+78+Mohali" target="_blank" rel="noreferrer" className="directions-btn" style={{ marginTop: '16px', display: 'flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                Get Directions on Google Maps
              </a>
            </div>

            <div className="reveal-right">
              <div className="address-card">
                <div className="address-item">
                  <div className="address-icon">📍</div>
                  <div>
                    <div className="address-text-label">Address</div>
                    <div className="address-text-val">
                      SCO 6, Adjoining Gurudwara Singh Shaheedan<br />
                      Sector 78, Sahibzada Ajit Singh Nagar<br />
                      Punjab 140308
                    </div>
                  </div>
                </div>
                <div className="address-item">
                  <div className="address-icon">📞</div>
                  <div>
                    <div className="address-text-label">Phone Reservation</div>
                    <div className="address-text-val">
                      <a href="tel:09781213139">+91 97812 13139</a>
                    </div>
                  </div>
                </div>
                <div className="address-item">
                  <div className="address-icon">🕐</div>
                  <div>
                    <div className="address-text-label">Opening Hours</div>
                    <div className="address-text-val">
                      Open Daily<br />
                      <span style={{ color: 'var(--gold)' }}>Closes 11:30 PM</span>
                    </div>
                  </div>
                </div>
                <div className="address-item">
                  <div className="address-icon">🚗</div>
                  <div>
                    <div className="address-text-label">Distance from Chandigarh</div>
                    <div className="address-text-val">
                      ~19 minutes · 12 km from Sector 17<br />
                      <span style={{ color: 'rgba(245,239,224,0.45)', fontSize: '13px' }}>Ample parking available nearby</span>
                    </div>
                  </div>
                </div>
                <div className="address-item">
                  <div className="address-icon">💰</div>
                  <div>
                    <div className="address-text-label">Average Spend</div>
                    <div className="address-text-val">
                      <span style={{ color: 'var(--gold)' }}>₹400 – ₹1,600</span> per person
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonials">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center' }}>
            <span className="section-label">What Guests Say</span>
            <h2 className="section-title">Loved by <em>Many</em></h2>
          </div>

          <div className="testimonials-slider reveal">
            <div className="testimonials-track" id="testimonialTrack" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              <div className="testimonial-slide">
                <div className="stars">★★★★★</div>
                <span className="quote-mark">"</span>
                <p className="testimonial-text">The espresso here is hands down the best I've had in the entire Tricity. The ambiance is gorgeous — warm, intimate, and truly Italian. Triesto has become my go-to for weekend mornings.</p>
                <div className="testimonial-author">Armaan Singh Batth</div>
                <div className="testimonial-source">Chandigarh · Google Review · ★ 5.0</div>
              </div>
              <div className="testimonial-slide">
                <div className="stars">★★★★★</div>
                <span className="quote-mark">"</span>
                <p className="testimonial-text">Came for the pasta, stayed for the cold brew. The mushroom truffle pasta is absolutely divine. Staff is warm and knowledgeable about their beans. A genuinely special place in Mohali.</p>
                <div className="testimonial-author">Arjun Mehta</div>
                <div className="testimonial-source">Mohali · Zomato Review · ★ 4.8</div>
              </div>
              <div className="testimonial-slide">
                <div className="stars">★★★★★</div>
                <span className="quote-mark">"</span>
                <p className="testimonial-text">The tiramisu is absolutely phenomenal — I've been to Italy and this rivals anything I had there. The cold brew tonic is their secret weapon. Do not miss it. Rated 4.7 for a reason.</p>
                <div className="testimonial-author">Armaan Singh</div>
                <div className="testimonial-source">Panchkula · Instagram · ★ 5.0</div>
              </div>
              <div className="testimonial-slide">
                <div className="stars">★★★★☆</div>
                <span className="quote-mark">"</span>
                <p className="testimonial-text">The Margherita pizza has an incredibly crispy crust — light, airy, and perfectly charred. Paired with the affogato for dessert, it made for one of the most memorable meals I've had in the city.</p>
                <div className="testimonial-author">Vikram Singh</div>
                <div className="testimonial-source">Mohali · JustDial Review · ★ 4.5</div>
              </div>
            </div>

            <div className="slider-dots" id="sliderDots">
              <button className={`slider-dot ${currentSlide === 0 ? 'active' : ''}`} onClick={() => setCurrentSlide(0)}></button>
              <button className={`slider-dot ${currentSlide === 1 ? 'active' : ''}`} onClick={() => setCurrentSlide(1)}></button>
              <button className={`slider-dot ${currentSlide === 2 ? 'active' : ''}`} onClick={() => setCurrentSlide(2)}></button>
              <button className={`slider-dot ${currentSlide === 3 ? 'active' : ''}`} onClick={() => setCurrentSlide(3)}></button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INSTAGRAM ═══ */}
      <section id="social">
        <div className="section-inner">
          <div className="reveal" style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span className="section-label">Follow Along</span>
            <h2 className="section-title"><em>@triestomohali</em></h2>
            <p className="section-body" style={{ margin: '16px auto 0', textAlign: 'center' }}>
              Every cup, every plate, every moment — shared with love on Instagram.
            </p>
          </div>

          <div className="insta-grid reveal">
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#1E1208" />
                  <circle cx="150" cy="150" r="100" fill="#2C1810" opacity="0.5" />
                  <circle cx="150" cy="150" r="50" fill="#3D2010" stroke="#C8963E" strokeWidth="2" />
                  <circle cx="150" cy="150" r="30" fill="#C8963E" opacity="0.3" />
                  <text x="150" y="155" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="16" fontStyle="italic" fill="#C8963E" opacity="0.9">Espresso</text>
                  <circle cx="60" cy="60" r="4" fill="#C8963E" opacity="0.4" />
                  <circle cx="240" cy="240" r="4" fill="#C8963E" opacity="0.4" />
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#101A08" />
                  <rect x="60" y="80" width="180" height="160" rx="4" fill="#1A2810" stroke="#C8963E" strokeWidth="0.5" />
                  <ellipse cx="150" cy="160" rx="60" ry="50" fill="#243A14" stroke="#C8963E" strokeWidth="1" />
                  <text x="150" y="165" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="16" fontStyle="italic" fill="#C8963E" opacity="0.9">Pasta</text>
                  <path d="M100 130 Q150 110 200 130" fill="none" stroke="#C8963E" strokeWidth="0.5" opacity="0.4" />
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#0D1018" />
                  <circle cx="150" cy="150" r="120" fill="#141828" opacity="0.8" />
                  <circle cx="150" cy="150" r="80" fill="none" stroke="#C8963E" strokeWidth="0.5" opacity="0.4" />
                  <path d="M90 150 Q120 90 150 80 Q180 90 210 150 Q180 210 150 220 Q120 210 90 150Z" fill="#1E2838" stroke="#C8963E" strokeWidth="1" />
                  <text x="150" y="155" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="16" fontStyle="italic" fill="#C8963E" opacity="0.9">Cold Brew</text>
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#1A1408" />
                  <circle cx="150" cy="150" r="100" fill="#2C2010" opacity="0.7" />
                  <rect x="90" y="110" width="120" height="100" rx="8" fill="#3D2A14" stroke="#C8963E" strokeWidth="1" />
                  <ellipse cx="150" cy="110" rx="60" ry="12" fill="#4A3218" stroke="#C8963E" strokeWidth="1" />
                  <text x="150" y="168" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="16" fontStyle="italic" fill="#C8963E" opacity="0.9">Tiramisu</text>
                  <text x="150" y="190" textAnchor="middle" fontFamily="Jost" fontSize="8" fill="#C8963E" opacity="0.5" letterSpacing="3">DESSERTS</text>
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#18080A" />
                  <circle cx="150" cy="150" r="100" fill="#281018" opacity="0.6" />
                  <path d="M80 200 Q150 80 220 200 Z" fill="#3A1420" stroke="#C8963E" strokeWidth="1" />
                  <text x="150" y="170" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="16" fontStyle="italic" fill="#C8963E" opacity="0.9">Pizza Forno</text>
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#0E1412" />
                  <circle cx="150" cy="150" r="110" fill="#142018" opacity="0.6" />
                  <ellipse cx="150" cy="170" rx="70" ry="50" fill="#1E3020" stroke="#C8963E" strokeWidth="0.5" />
                  <path d="M120 140 Q150 110 180 140 Q165 160 150 162 Q135 160 120 140Z" fill="#C8963E" opacity="0.25" />
                  <text x="150" y="230" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="16" fontStyle="italic" fill="#C8963E" opacity="0.9">Latte Art</text>
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#100D18" />
                  <text x="150" y="140" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="56" fontWeight="300" fill="#C8963E" opacity="0.15">T</text>
                  <circle cx="150" cy="150" r="70" fill="none" stroke="#C8963E" strokeWidth="0.5" opacity="0.3" />
                  <text x="150" y="155" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="18" fill="#C8963E" opacity="0.8">Triesto</text>
                  <text x="150" y="178" textAnchor="middle" fontFamily="Jost" fontSize="8" fill="#C8963E" opacity="0.4" letterSpacing="3">MOHALI</text>
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
            <div className="insta-cell" onClick={() => window.open('https://www.instagram.com/triestomohali/', '_blank')}>
              <div className="insta-bg">
                <svg viewBox="0 0 300 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <rect width="300" height="300" fill="#14100A" />
                  <circle cx="150" cy="150" r="100" fill="#241808" opacity="0.5" />
                  <g>
                    <ellipse cx="120" cy="150" rx="18" ry="11" fill="#5A3018" transform="rotate(-15 120 150)" />
                    <line x1="120" y1="141" x2="120" y2="159" stroke="#3A1E0C" strokeWidth="1.5" />
                    <ellipse cx="160" cy="130" rx="18" ry="11" fill="#6B3A20" transform="rotate(20 160 130)" />
                    <line x1="160" y1="121" x2="160" y2="139" stroke="#3A1E0C" strokeWidth="1.5" />
                    <ellipse cx="185" cy="165" rx="18" ry="11" fill="#5A3018" transform="rotate(-5 185 165)" />
                    <line x1="185" y1="156" x2="185" y2="174" stroke="#3A1E0C" strokeWidth="1.5" />
                  </g>
                  <text x="150" y="220" textAnchor="middle" fontFamily="Cormorant Garamond" fontSize="14" fontStyle="italic" fill="#C8963E" opacity="0.8">Coffee Roasters</text>
                </svg>
              </div>
              <div className="insta-hover"><span className="insta-icon">♥</span></div>
            </div>
          </div>

          <div className="insta-follow reveal">
            <p style={{ fontSize: '13px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '16px' }}>Follow for daily updates, new menu drops &amp; behind-the-scenes</p>
            <a href="https://www.instagram.com/triestomohali/" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <div className="insta-handle">@triestomohali</div>
            </a>
            <a href="https://www.instagram.com/triestomohali/" target="_blank" rel="noreferrer" className="btn-primary" style={{ marginTop: '28px', display: 'inline-block' }}>
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer>
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">Triesto</div>
              <div className="footer-brand-tagline">
                Coffee Roasters &amp; Italian Kitchen<br />
                Sector 78, Mohali · Punjab
              </div>
              <div className="social-links">
                <a href="https://www.instagram.com/triestomohali/" target="_blank" rel="noreferrer" className="social-link" title="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
                <a href="tel:09781213139" className="social-link" title="Call Us">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.28h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.46a16 16 0 0 0 5.63 5.63l1.44-1.44a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                </a>
                <a href="https://maps.google.com/?q=Triesto+Cafe+Sector+78+Mohali" target="_blank" rel="noreferrer" className="social-link" title="Maps">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                </a>
              </div>
            </div>

            <div>
              <div className="footer-col-title">Menu</div>
              <ul className="footer-links">
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); setActiveTab('coffee'); }}>Coffee</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); setActiveTab('coldbrews'); }}>Cold Brews</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); setActiveTab('pasta'); }}>Pasta</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); setActiveTab('pizza'); }}>Pizza</a></li>
                <li><a href="#menu" onClick={(e) => { e.preventDefault(); scrollToSection('menu'); setActiveTab('desserts'); }}>Desserts</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Visit</div>
              <ul className="footer-links">
                <li><a href="#timings" onClick={(e) => { e.preventDefault(); scrollToSection('timings'); }}>Hours</a></li>
                <li><a href="#location" onClick={(e) => { e.preventDefault(); scrollToSection('location'); }}>Location</a></li>
                <li><a href="tel:09781213139">Reservations</a></li>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>Our Story</a></li>
                <li><a href="#social" onClick={(e) => { e.preventDefault(); scrollToSection('social'); }}>Instagram</a></li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Contact</div>
              <ul className="footer-links">
                <li><a href="tel:09781213139">+91 97812 13139</a></li>
                <li><a href="https://www.instagram.com/triestomohali/" target="_blank" rel="noreferrer">@triestomohali</a></li>
                <li><a href="#location" onClick={(e) => { e.preventDefault(); scrollToSection('location'); }}>SCO 6, Sector 78</a></li>
                <li style={{ color: 'var(--muted)', fontSize: '13px' }}>Open till 11:30 PM daily</li>
              </ul>
              <div style={{ marginTop: '24px', padding: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Rating</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', fontWeight: 300, color: 'var(--gold)', lineHeight: 1 }}>4.7</div>
                <div style={{ fontSize: '12px', color: 'var(--gold)', marginTop: '2px' }}>★★★★★</div>
                <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: '4px' }}>35+ Reviews</div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © 2026 Triesto Café. All rights reserved. · Sector 78, Mohali, Punjab
            </div>
            <div className="footer-legal">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms</a>
              <a href="https://www.instagram.com/triestomohali/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
