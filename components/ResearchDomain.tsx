'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Search, Target, Layout, Layers, Cpu, Info, 
  ChevronDown, Activity, Droplets, Bone, ShieldCheck,
  Microscope, Brain, LineChart, Globe, Zap, Database,
  FileText, AlertCircle, CheckCircle2, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

const areas = [
  { id: 'general', label: 'General / Iris Validation', icon: Eye, color: 'blue' },
  { id: 'digestive', label: 'Digestive Tract', icon: Activity, color: 'emerald' },
  { id: 'liver', label: 'Liver Disorders', icon: Droplets, color: 'rose' },
  { id: 'spinal', label: 'Spinal Cord', icon: Bone, color: 'amber' },
];

const domains = [
  { 
    id: 'survey', 
    label: 'Literature Survey', 
    icon: Search, 
    content: {
      type: 'survey',
      highlight: "Iris analysis is increasingly recognized as a non-invasive window into systemic health, with AI transforming early detection of organ diseases.",
      description: "Current diagnostic methods for systemic conditions like liver, digestive, and spinal disorders are often invasive and costly. Deep Learning (DL) and AI are revolutionizing this field through non-invasive iris analysis.",
      areaContent: {
        general: {
          title: "Iris Validation & General Health",
          text: "Modern AI has revived iridology through data-driven analysis using lightweight CNNs to filter noise and ensure high-quality inputs.",
          metrics: "87% Testing Accuracy",
          details: [
            "Methodology: Lightweight CNNs (EfficientNetV2B0 and DenseNet121) for quality validation.",
            "Research Gap: Existing systems lack Explainable AI (XAI) to highlight diagnostic regions."
          ]
        },
        digestive: {
          title: "Digestive Tract Disorders",
          text: "Recent research utilizes CNNs and Vision Transformers (ViTs) to identify textural and pigmentation variations associated with gastrointestinal health.",
          metrics: "94% Accuracy (Hybrid Models)",
          details: [
            "AI Advancements: Using ConvNeXtTiny and EfficientNetV2B0 architectures.",
            "Challenges: Scarcity of clinically annotated datasets and lack of longitudinal monitoring."
          ]
        },
        liver: {
          title: "Liver Disorders (NAFLD)",
          text: "AI models now attempt to correlate iris features with biochemical markers like ALT and AST enzyme levels, especially relevant for NAFLD prevalence.",
          metrics: "93% Testing Accuracy",
          details: [
            "Architecture: Optimized pipelines using Dynamic Attention Mechanisms for subtle biomarkers.",
            "Research Gap: Most existing models act as 'black boxes,' hindering clinical trust."
          ]
        },
        spinal: {
          title: "Spinal Cord Issues",
          text: "High-resolution iris imaging coupled with specialized architectures allows for the detection of subtle patterns linked to spinal health.",
          metrics: "95% Testing Accuracy",
          details: [
            "Approach: MobileNetV2 and DenseNet121 architectures for high-resolution feature extraction.",
            "Challenges: Computer-based systems provide the consistency lacking in subjective manual inspection."
          ]
        }
      }
    }
  },
  { 
    id: 'gap', 
    label: 'Research Gap', 
    icon: Layers, 
    content: {
      type: 'list',
      title: 'Research Gap',
      highlight: "The literature review identifies several critical gaps in existing research regarding the use of iris patterns for systemic health monitoring:",
      items: [
        { title: "Lack of Integrated Multi-Organ Screening", icon: Layers, text: "While traditional iridology suggests a holistic view, most modern AI studies focus on a single organ. There is a lack of unified deep learning frameworks capable of simultaneously screening for digestive, liver, and spinal conditions." },
        { title: "Scarcity of Clinically Annotated Data", icon: Database, text: "Absence of large-scale, standardized datasets that link iris textural variations specifically to clinical biochemical markers, such as ALT or AST levels for liver health." },
        { title: "Absence of Quality Validation Layers", icon: ShieldCheck, text: "Existing systems often assume high-quality input. There is a gap in preprocessing pipelines that utilize lightweight CNNs to first validate image quality before diagnosis." },
        { title: "Limited Localized Deployment and Scalability", icon: Globe, text: "Current research rarely addresses the need for mobile-friendly or offline-capable architectures optimized for rural imaging conditions and local disease prevalence." },
        { title: "The 'Black Box' and Interpretability Problem", icon: Brain, text: "A significant barrier to clinical adoption is the lack of Explainable AI (XAI). Most models provide a diagnosis without highlighting the specific iris fibers or pigments that led to the result." },
        { title: "Inconsistency in Manual vs. Automated Validation", icon: Info, text: "Traditional manual inspection remains highly subjective. There is a gap in standardized, objective computer-based systems that can provide consistent results across environments." }
      ]
    }
  },
  { 
    id: 'problem', 
    label: 'Research Problem', 
    icon: Target, 
    content: {
      type: 'problem',
      title: 'Research Problem',
      highlight: "The research problem focuses on the limitations of traditional diagnostic methods in Sri Lanka for detecting systemic conditions like liver, digestive, and spinal disorders, which often remain undiagnosed until advanced stages.",
      subProblems: [
        { title: "Invasiveness and Cost", icon: AlertCircle, text: "Current gold-standard procedures like endoscopies or intensive biochemical testing are often invasive, expensive, and inaccessible in rural areas." },
        { title: "Subjectivity of Manual Analysis", icon: Info, text: "Manual inspection of iris patterns is highly subjective and lacks the standardized precision required for reliable clinical diagnostics." },
        { title: "Fragmentation of AI Models", icon: Layout, text: "Most existing research focuses on a single organ, failing to provide an integrated framework for multiple systemic issues." },
        { title: "Regional Health Challenges", icon: Globe, text: "High local prevalence of conditions like NAFLD requires localized AI solutions validated against regional imaging conditions." }
      ],
      impact: "This leads to delayed interventions, increased healthcare costs, and a reliance on reactive rather than proactive medicine for managing systemic health.",
      solution: {
        title: "Our Solution: Irisa",
        text: "Irisa is an innovative, non-invasive health screening platform that utilizes specialized deep learning architectures to address existing research gaps through:",
        features: [
          { title: "Integrated Validation Layer", icon: ShieldCheck, text: "Ensuring input quality using EfficientNetV2B0 and DenseNet121 before processing." },
          { title: "Multi-Organ Diagnostic Framework", icon: Layout, text: "Unified system screening for Digestive, Liver, and Spinal issues within a single platform." },
          { title: "Hybrid Deep Learning Architecture", icon: Cpu, text: "Implementation of ConvNeXtTiny and MobileNetV2 optimized for high accuracy (up to 95%)." },
          { title: "Explainable AI (XAI) Integration", icon: Brain, text: "Visual transparency by highlighting diagnostic iris regions to build clinical trust." },
          { title: "Scalable Clinical Deployment", icon: Globe, text: "Cloud-ready solution designed for accessibility in low-resource and rural health centers." }
        ]
      }
    }
  },
  { 
    id: 'objectives', 
    label: 'Research Objectives', 
    icon: Target, 
    content: {
      type: 'objectives',
      title: 'Research Objectives',
      primary: "The primary objective of this research is to develop a non-invasive, deep learning-powered multi-organ screening system that utilizes iris image analysis for the early detection of Digestive Tract Disorders, Liver Conditions, and Spinal Cord Issues.",
      specific: [
        { id: "01", title: "Developing Specialized Diagnostic Modules", text: "Create and optimize tailored deep learning architectures—such as ConvNeXtTiny and MobileNetV2—to detect specific physiological markers." },
        { id: "02", title: "Implementing an Automated Validation Layer", text: "Develop a robust preprocessing module using lightweight CNNs to verify the quality and validity of iris images." },
        { id: "03", title: "Integrating into a Unified Framework", text: "Combine individual diagnostic modules into a single, cohesive platform (Irisa) for simultaneous screening." },
        { id: "04", title: "Enhancing Transparency with XAI", text: "Integrate visualization techniques to highlight specific iris regions, providing clinicians with interpretable evidence." },
        { id: "05", title: "Validating Local Clinical Relevance", text: "Evaluate performance using datasets reflecting regional health challenges, such as the high prevalence of NAFLD in Sri Lanka." },
        { id: "06", title: "Optimizing for Scalability and Accessibility", text: "Focus on computational efficiency to enable deployment in resource-limited or rural environments." }
      ],
      impact: "By transforming iris analysis into a standardized, objective diagnostic tool, this research aims to facilitate early-stage intervention for systemic diseases and reduce reliance on costly, invasive procedures."
    }
  },
  { 
    id: 'methodology', 
    label: 'Methodology', 
    icon: Layers, 
    content: {
      type: 'methodology',
      title: 'Methodology',
      highlight: "The methodology follows a structured, modular approach designed to transform raw iris captures into actionable health insights through specialized deep learning pipelines.",
      diagram: "/images/methodology.jpg",
      steps: [
        { 
          id: 1, 
          title: "Data Collection & Preprocessing", 
          text: "Curated datasets from clinical settings and public repositories. Implemented an automated Iris Validation Module using EfficientNetV2B0 and DenseNet121.",
          bullets: ["Contrast enhancement using CLAHE", "Normalization and resizing for consistency", "Data augmentation (rotation, flipping, brightness)"]
        },
        { 
          id: 2, 
          title: "Architecture Design", 
          text: "Developed organ-specific hybrid models tailored to unique iris textures using transfer learning from ImageNet-pretrained weights.",
          bullets: ["Digestive: ConvNeXtTiny + EfficientNetV2B0", "Liver: EfficientNetV2B0 with Attention", "Spinal: MobileNetV2 + DenseNet121 Fusion"]
        },
        { 
          id: 3, 
          title: "Model Training & Optimization", 
          text: "Employed advanced loss functions and the Adam optimizer. Utilized Dynamic Attention Mechanisms to focus on specific iris fibers.",
          bullets: ["Rigorous Cross-Validation strategies", "Regularization (Dropout, Early Stopping)", "Optimization for subtle pigment variations"]
        },
        { 
          id: 4, 
          title: "Integration & Deployment (Irisa)", 
          text: "Built a modular Microservices Architecture using Flask for model serving and a Node.js backend with a React/Tailwind frontend.",
          bullets: ["Cloud-ready deployment (AWS/Azure)", "Explainable AI (XAI) heatmap generation", "Scalable infrastructure for rural health centers"]
        },
        { 
          id: 5, 
          title: "Clinical Validation & Iteration", 
          text: "Benchmarking against traditional diagnostic markers like ALT/AST enzyme levels. Collaborative validation with medical professionals.",
          bullets: ["Iterative fine-tuning based on real-world feedback", "Performance validation in Sri Lankan clinical settings", "Longitudinal monitoring of health markers"]
        }
      ]
    }
  },
  { 
    id: 'technologies', 
    label: 'Technologies Used', 
    icon: Cpu, 
    content: {
      type: 'list',
      title: 'Technologies Used',
      highlight: "The system's development leverages a modern technology stack combining advanced AI frameworks with robust software engineering tools.",
      items: [
        { title: "Deep Learning Frameworks", icon: Cpu, text: "Python serves as the primary language, utilizing TensorFlow and PyTorch for building and training sophisticated hybrid models." },
        { title: "Computer Vision & Preprocessing", icon: Eye, text: "OpenCV and NumPy are employed for CLAHE enhancement, feature extraction, and implementing pre-trained architectures." },
        { title: "Backend Architecture", icon: Database, text: "Flask for model serving and Node.js for robust backend management and microservices coordination." },
        { title: "Frontend & Visualization", icon: Layout, text: "React with Tailwind CSS for the clinician dashboard, integrated with XAI heatmap visualization components." }
      ]
    }
  },
];

export default function ResearchDomain() {
  const [activeTab, setActiveTab] = useState('survey');
  const [activeArea, setActiveArea] = useState('general');

  const currentDomain = domains.find(d => d.id === activeTab);
  const content = currentDomain?.content;

  const renderContent = () => {
    if (!content) return null;

    switch (content.type) {
      case 'survey':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-wider"
                >
                  Literature Survey
                </motion.div>
                <h3 className="text-3xl font-bold text-white leading-tight">{content.highlight}</h3>
                <p className="text-slate-400 text-lg leading-relaxed">{content.description}</p>
              </div>

              <div className="space-y-8 mt-4">
                <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeArea}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-2xl font-bold text-white">
                          {(content as any).areaContent[activeArea].title}
                        </h4>
                        <div className="px-4 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
                          {(content as any).areaContent[activeArea].metrics}
                        </div>
                      </div>
                      <p className="text-slate-300 leading-relaxed">
                        {(content as any).areaContent[activeArea].text}
                      </p>
                      <div className="space-y-3 pt-4">
                        {(content as any).areaContent[activeArea].details.map((detail: string, i: number) => (
                          <div key={i} className="flex gap-3 items-start text-slate-400 text-sm">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 px-2">Focus Areas</h4>
              <div className="grid grid-cols-1 gap-3">
                {areas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setActiveArea(area.id)}
                    className={cn(
                      "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 group",
                      activeArea === area.id
                        ? "bg-brand-blue/10 border-brand-blue/50 text-white shadow-lg"
                        : "bg-slate-800/20 border-slate-700/50 text-slate-400 hover:bg-slate-800/40 hover:border-slate-600"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                      activeArea === area.id ? "bg-brand-blue text-white" : "bg-slate-700/50 text-slate-400 group-hover:text-slate-200"
                    )}>
                      <area.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{area.label}</div>
                      <div className="text-xs opacity-60">Deep Learning Analysis</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-10">
            <div className="max-w-4xl">
              <h3 className="text-3xl font-bold text-white mb-6">{(content as any).title}</h3>
              <div className="p-6 rounded-2xl bg-brand-blue/5 border-l-4 border-brand-blue mb-8">
                <p className="text-brand-blue font-medium leading-relaxed">{content.highlight}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(content as any).items.map((item: any, idx: number) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-slate-800/20 border border-slate-700/50 hover:border-brand-blue/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-brand-blue" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-slate-400 leading-relaxed text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 'problem':
        return (
          <div className="space-y-12">
             <div className="max-w-4xl">
              <h3 className="text-3xl font-bold text-white mb-6">{(content as any).title}</h3>
              <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/20 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">{content.highlight}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(content as any).subProblems.map((prob: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                      <prob.icon className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{prob.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{prob.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center italic text-slate-400">
              "{(content as any).impact}"
            </div>

            <div className="space-y-8 pt-8 border-t border-slate-800">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  {(content as any).solution.title}
                </h3>
                <p className="text-slate-400">{(content as any).solution.text}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(content as any).solution.features.map((feat: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 transition-all text-center">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                      <feat.icon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h5 className="text-xs font-bold text-white mb-2">{feat.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-tight">{feat.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-12">
            <div className="max-w-4xl">
              <h3 className="text-3xl font-bold text-white mb-6">{(content as any).title}</h3>
              <div className="p-8 rounded-3xl bg-brand-blue/5 border border-brand-blue/20 mb-8">
                <h4 className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-4">Primary Objective</h4>
                <p className="text-xl text-white font-medium leading-relaxed italic">"{(content as any).primary}"</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 mb-6">Specific Objectives</h4>
              <div className="grid grid-cols-1 gap-4">
                {(content as any).specific.map((obj: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-6 p-6 rounded-2xl bg-slate-800/20 border border-slate-700/50 group hover:border-brand-blue/30 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-xl flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all">
                      {obj.id}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{obj.title}</h4>
                      <p className="text-slate-400 text-sm">{obj.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-brand-blue/5 border border-brand-blue/10">
              <h4 className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-4">Expected Impact</h4>
              <p className="text-slate-300 leading-relaxed">{(content as any).impact}</p>
            </div>
          </div>
        );

      case 'methodology':
        return (
          <div className="space-y-12">
            <div className="max-w-4xl">
              <h3 className="text-3xl font-bold text-white mb-6">{(content as any).title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">{(content as any).highlight}</p>
            </div>

            <div className="p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden group">
               <motion.img 
                src={(content as any).diagram} 
                alt="Methodology Diagram" 
                className="w-full h-auto rounded-2xl shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
              />
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-2 mb-6">Methodology Steps</h4>
              <div className="grid grid-cols-1 gap-6">
                {(content as any).steps.map((step: any, idx: number) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-3xl bg-slate-800/20 border border-slate-700/50 group hover:border-brand-blue/30 transition-all"
                  >
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg shadow-brand-blue/20">
                        {step.id}
                      </div>
                      <div className="space-y-4">
                        <h4 className="text-xl font-bold text-white">{step.title}</h4>
                        <p className="text-slate-400 leading-relaxed">{step.text}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                          {step.bullets.map((bullet: string, i: number) => (
                            <div key={i} className="flex gap-2 items-center text-xs text-slate-500 bg-slate-900/50 px-3 py-2 rounded-lg border border-slate-800">
                              <div className="w-1 h-1 rounded-full bg-brand-blue" />
                              {bullet}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="domain" className="py-24 bg-brand-dark/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
              Research Domain
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A comprehensive exploration into AI-powered iris analysis for multi-organ systemic health monitoring.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => {
                setActiveTab(domain.id);
                if (domain.id !== 'survey') setActiveArea('general');
              }}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-500 border flex items-center gap-2 group',
                activeTab === domain.id 
                  ? 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_0_20px_rgba(14,165,233,0.15)]' 
                  : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200 bg-slate-900/40'
              )}
            >
              <domain.icon className={cn(
                "w-4 h-4 transition-transform duration-500",
                activeTab === domain.id ? "scale-110" : "group-hover:scale-110"
              )} />
              {domain.label}
            </button>
          ))}
        </div>

        <div className="glass-card rounded-[2rem] border-slate-800/50 overflow-hidden bg-slate-900/20 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="p-8 md:p-12"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Iris Validation', value: '87%', color: 'blue' },
            { label: 'Digestive Tract', value: '94%', color: 'emerald' },
            { label: 'Liver Health', value: '93%', color: 'rose' },
            { label: 'Spinal Cord', value: '95%', color: 'amber' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-2xl border-slate-800/50 text-center group hover:border-brand-blue/50 transition-all"
            >
              <div className="text-3xl font-bold text-white mb-1 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <motion.button 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 rounded-full glass border-slate-700 flex items-center justify-center hover:border-brand-blue transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </motion.button>
        </div>
      </div>
    </section>
  );
}
