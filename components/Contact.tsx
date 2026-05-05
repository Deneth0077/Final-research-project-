'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, Shield, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Constructing the mailto link
    const mailtoLink = `mailto:denethc545@gmail.com?subject=${encodeURIComponent(formData.subject || 'Contact from Irisa AI')}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
    
    // Open the default mail client
    window.location.href = mailtoLink;
    
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-brand-dark/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contact Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-400"
          >
            Have questions about our research? We'd love to hear from you
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-8 rounded-3xl"
            >
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue transition-colors duration-300">
                    <Mail className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email</p>
                    <p className="text-lg font-bold text-white">denethc545@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-lg font-bold text-white">+94 77 134 7788</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-10 rounded-3xl relative overflow-hidden"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
            
            {isSent ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Message Prepared!</h4>
                <p className="text-slate-400">Your email client should open shortly with your message ready to send.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors"
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors"
                  />
                </div>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors"
                />
                <textarea
                  rows={4}
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors resize-none"
                />
                <button 
                  type="submit"
                  className="w-full py-5 rounded-xl bg-transparent border border-slate-700 hover:bg-brand-blue hover:border-brand-blue text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-20 border-t border-slate-900 bg-brand-dark/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Irisa AI</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Advancing healthcare through innovative AI solutions for early vision disorder detection. Our research focuses on developing cutting-edge deep learning frameworks for medical imaging.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#domain" className="text-slate-500 hover:text-brand-blue transition-colors">Domain</a></li>
              <li><a href="#milestones" className="text-slate-500 hover:text-brand-blue transition-colors">Milestones</a></li>
              <li><a href="#downloads" className="text-slate-500 hover:text-brand-blue transition-colors">Downloads</a></li>
              <li><a href="#about" className="text-slate-500 hover:text-brand-blue transition-colors">About Us</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-xs">
            © 2026 Irisa AI. All rights reserved. — Early Detection, Lifelong Vision
          </p>
        </div>
      </div>
    </footer>
  );
}
