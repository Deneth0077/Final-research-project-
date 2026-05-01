'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import Eye3D from './Eye3D';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Full Hero 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Eye3D />
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 bg-grid z-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] z-0 animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] z-0 animate-pulse-slow pointer-events-none" />

      {/* Content Container (Overlay) */}
      <div className="max-w-7xl mx-auto px-6 w-full z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6 pointer-events-auto backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">AI Medical Research</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tighter leading-tight drop-shadow-2xl">
            Irisa <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">AI</span>
          </h1>
          
          <p className="text-sm font-medium tracking-[0.3em] text-slate-400 uppercase mb-8 ml-1">
            Early Detection · Lifelong Vision
          </p>
          
          <p className="text-lg text-slate-300 max-w-lg mb-10 leading-relaxed drop-shadow-lg">
            An Integrated Deep Learning Framework for Early Detection of Vision Disorders using fundus image analysis and advanced computer vision.
          </p>
          
          <div className="flex flex-wrap gap-4 pointer-events-auto">
            <button className="px-8 py-4 rounded-xl bg-white text-brand-dark font-bold flex items-center gap-2 hover:bg-brand-blue hover:text-white transition-all duration-300 group shadow-lg shadow-white/5">
              Explore Research
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl glass text-white font-bold flex items-center gap-3 hover:bg-slate-800/50 transition-all">
              <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <Play className="w-4 h-4 fill-brand-blue text-brand-blue" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8 max-w-sm pointer-events-auto">
            <div className="glass p-4 rounded-xl">
              <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">4</div>
              <div className="text-xs text-brand-cyan uppercase tracking-wider font-semibold">Diseases Detected</div>
            </div>
            <div className="glass p-4 rounded-xl">
              <div className="text-3xl font-bold text-white mb-1 drop-shadow-lg">96%</div>
              <div className="text-xs text-brand-cyan uppercase tracking-wider font-semibold">Project Complete</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
