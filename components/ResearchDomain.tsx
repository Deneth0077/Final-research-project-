'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Search, Target, Layout, Layers, Cpu, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const domains = [
  { id: 'survey', label: 'Literature Survey', icon: Search, content: {
      highlight: "The literature survey examines existing research on iris image analysis and its application in identifying potential health risks using artificial intelligence, highlighting the effectiveness of deep learning models in extracting complex patterns from medical images.",
      description: "The literature survey examines existing research on iris image analysis and its application in identifying potential health risks using artificial intelligence. Recent studies highlight the effectiveness of deep learning models, particularly Convolutional Neural Networks (CNNs) and Vision Transformers, in extracting complex patterns from medical images. In iris-based diagnostics, research has explored the correlation between iris features such as pupil irregularities, fiber structures, and lacunae patterns with internal organ conditions including digestive disorders, liver diseases, and neurological issues. Pre-trained architectures such as ResNet, DenseNet, and EfficientNet have been widely used to improve classification performance through transfer learning. However, many existing approaches depend heavily on high-quality datasets and often lack mechanisms for validating input images, which directly affects prediction accuracy. This survey provides a comprehensive understanding of current advancements while identifying limitations in scalability, reliability, and real-world applicability.",
      findings: [
        { title: "Iris-based Diagnostics", icon: Eye, text: "Research explores the correlation between iris features (pupil irregularities, fiber structures) and conditions like digestive disorders, liver diseases, and neurological issues." },
        { title: "Pre-trained Architectures", icon: Cpu, text: "Models like ResNet, DenseNet, and EfficientNet improve classification performance through transfer learning." },
        { title: "Current Limitations", icon: Search, text: "Existing approaches depend on high-quality datasets and lack image validation, affecting accuracy, scalability, and real-world applicability." }
      ]
  }},
  { id: 'gap', label: 'Research Gap', icon: Layers, content: {
      highlight: "Despite advancements in AI-driven medical image analysis, several limitations exist in current iris-based diagnostic systems, particularly their focus on single-disease detection and high computational requirements.",
      description: "Despite advancements in AI-driven medical image analysis, several limitations exist in current iris-based diagnostic systems. Many studies focus on single-disease detection rather than multi-organ analysis, limiting their practical use in comprehensive health screening. Additionally, there is a lack of integrated systems that combine image validation, disease prediction, and system reliability monitoring. Most existing models require high computational resources, making them less suitable for real-world deployment, especially in resource-limited environments like Sri Lanka. Another major gap is the limited availability of diverse, clinically validated iris datasets, which affects model generalization. Furthermore, traditional iridology methods are often subjective and lack consistency, while modern AI approaches still struggle with interpretability. Addressing these gaps is essential to develop a robust, scalable, and clinically useful diagnostic system.",
      findings: [
        { title: "Multi-organ Analysis", icon: Layers, text: "Current studies focus on single-disease detection, limiting comprehensive health screening. Integrated systems combining validation and prediction are lacking." },
        { title: "Resource Constraints", icon: Cpu, text: "Existing models require high computational resources, making them unsuitable for real-world deployment in resource-limited environments like Sri Lanka." },
        { title: "Data & Interpretability", icon: Eye, text: "Limited diverse, clinically validated datasets affect generalization. Traditional iridology is subjective, and AI approaches struggle with interpretability." }
      ]
  }},
  { id: 'problem', label: 'Research Problem', icon: Target, content: {
      highlight: "Early identification of health risks related to internal organs remains a significant challenge due to the lack of accessible, affordable, and non-invasive diagnostic tools in conventional medicine.",
      description: "Early identification of health risks related to internal organs such as the digestive system, liver, and spinal cord remains a significant challenge due to the lack of accessible and non-invasive diagnostic tools. Conventional diagnostic methods, including imaging techniques and laboratory tests, are often expensive, time-consuming, and not easily accessible in all regions. Although iris-based analysis offers a promising alternative, existing systems are either inaccurate, limited in scope, or not suitable for real-world application. Therefore, the key problem addressed in this research is the development of an accurate, efficient, and non-invasive system capable of analyzing iris images to detect multiple health conditions at an early stage. The system must also ensure reliability, scalability, and usability in practical healthcare environments.",
      findings: [
        { title: "Diagnostic Limitations", icon: Info, text: "Conventional methods are expensive and not easily accessible, while existing iris-based systems are inaccurate or limited in scope." },
        { title: "Proposed Solution", icon: Target, text: "Developing an accurate, efficient, and non-invasive system capable of analyzing iris images to detect multiple health conditions early." },
        { title: "System Requirements", icon: Layout, text: "The developed system must ensure high reliability, scalability, and practical usability within real-world healthcare environments." }
      ]
  }},
  { id: 'objectives', label: 'Research Objectives', icon: Cpu, content: {
      highlight: "The main objective is to develop an AI-based iris image analysis system for the early identification of potential health risks related to multiple organs using advanced deep learning.",
      description: "The main objective of this research is to develop an AI-based iris image analysis system for early identification of potential health risks related to multiple organs. Specifically, the study aims to design and implement a robust deep learning model capable of detecting digestive disorders, liver diseases, and spinal cord issues using iris features. Another objective is to integrate an iris image validation mechanism to ensure that only high-quality images are processed, thereby improving prediction accuracy. Additionally, the research seeks to optimize model performance while reducing computational complexity for real-world deployment. Finally, the study aims to evaluate the system using clinically validated datasets and ensure its effectiveness as a supportive diagnostic tool in healthcare applications.",
      findings: [
        { title: "Disease Detection", icon: Search, text: "Design and implement robust models capable of detecting digestive disorders, liver diseases, and spinal cord issues from iris features." },
        { title: "Image Validation", icon: Eye, text: "Integrate a validation mechanism to ensure only high-quality images are processed, thereby improving overall prediction accuracy." },
        { title: "Optimization & Evaluation", icon: Cpu, text: "Optimize performance by reducing computational complexity and evaluate the system using clinically validated datasets for practical healthcare use." }
      ]
  }},
  { id: 'methodology', label: 'Methodology', icon: Layers, content: {
      highlight: "The proposed methodology follows a structured approach encompassing data collection from clinical sources, advanced preprocessing, hybrid model development, and rigorous evaluation.",
      description: "The proposed methodology follows a structured approach that includes data collection, preprocessing, model development, and evaluation. Initially, iris image datasets are collected from annotated sources and clinical environments. The images undergo preprocessing steps such as resizing, normalization, and data augmentation to improve model robustness and reduce overfitting. The system utilizes hybrid deep learning architectures combining models such as EfficientNet, DenseNet, ResNet, and MobileNet to capture both global and fine-grained features of the iris. Attention mechanisms such as CBAM are incorporated to enhance feature selection by focusing on relevant regions. The dataset is split into training, validation, and testing sets to ensure reliable performance evaluation. Finally, the system is evaluated using metrics such as accuracy, precision, recall, and F1-score to assess its effectiveness in detecting multiple health conditions.",
      findings: [
        { title: "Data Processing", icon: Layers, text: "Images undergo resizing, normalization, and data augmentation to improve model robustness and reduce the risk of overfitting." },
        { title: "Hybrid Architectures", icon: Cpu, text: "Utilizing combined deep learning models (EfficientNet, DenseNet, ResNet, MobileNet) with CBAM attention mechanisms for precise feature extraction." },
        { title: "Performance Evaluation", icon: Target, text: "Splitting datasets for reliable testing and evaluating using comprehensive metrics like accuracy, precision, recall, and F1-score." }
      ]
  }},
  { id: 'technologies', label: 'Technologies Used', icon: Cpu, content: {
      highlight: "The system's development leverages a modern technology stack combining advanced artificial intelligence frameworks with robust software engineering tools for scalable deployment.",
      description: "The development of this system involves a combination of modern technologies and tools in artificial intelligence and software engineering. Python is used as the primary programming language due to its strong support for machine learning and data processing. Deep learning frameworks such as TensorFlow and PyTorch are utilized for building and training the models. Image processing libraries like OpenCV and NumPy are used for preprocessing and feature extraction. Pre-trained architectures including EfficientNet, DenseNet, ResNet, and MobileNet are employed for transfer learning. Additionally, attention modules and hybrid model architectures are implemented to enhance performance. For deployment, web technologies such as React or Angular can be used to develop an interactive user interface, while cloud platforms may be utilized for scalable data processing and storage.",
      findings: [
        { title: "Core AI Frameworks", icon: Cpu, text: "Python serves as the primary language, utilizing TensorFlow and PyTorch for building and training sophisticated deep learning models." },
        { title: "Image Processing", icon: Eye, text: "OpenCV and NumPy are employed for essential preprocessing, feature extraction, and implementing pre-trained architectures for transfer learning." },
        { title: "Deployment Stack", icon: Layout, text: "Interactive user interfaces built with modern web technologies, backed by cloud platforms for scalable data processing and secure storage." }
      ]
  }},
];

export default function ResearchDomain() {
  const [activeTab, setActiveTab] = useState('survey');

  return (
    <section id="domain" className="py-24 bg-brand-dark/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Research Domain</h2>
          <p className="text-slate-400">Comprehensive research methodology and technological framework</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setActiveTab(domain.id)}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border flex items-center gap-2',
                activeTab === domain.id 
                  ? 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
                  : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              )}
            >
              <domain.icon className="w-4 h-4" />
              {domain.label}
            </button>
          ))}
        </div>

        <div className="glass p-1 rounded-3xl border-slate-800/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              {domains.find(d => d.id === activeTab)?.content ? (
                <div className="space-y-12">
                  <div className="flex flex-col gap-8">
                    <div className="flex gap-6 p-6 rounded-2xl bg-brand-blue/5 border-l-4 border-brand-blue">
                      <div className="text-brand-blue text-lg leading-relaxed font-medium">
                        {domains.find(d => d.id === activeTab)?.content?.highlight}
                      </div>
                    </div>
                    {domains.find(d => d.id === activeTab)?.content?.description && (
                      <div className="text-slate-300 text-base leading-relaxed text-justify px-2">
                        {domains.find(d => d.id === activeTab)?.content?.description}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                      Key Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {domains.find(d => d.id === activeTab)?.content?.findings?.map((finding, idx) => (
                        <div key={idx} className="glass-card p-8 rounded-2xl group">
                          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-colors">
                            <finding.icon className="w-6 h-6 text-brand-blue" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-3">{finding.title}</h4>
                          <p className="text-slate-400 leading-relaxed">{finding.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <Info className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg">Detailed content for {domains.find(d => d.id === activeTab)?.label} coming soon...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-12">
          <button className="w-10 h-10 rounded-full glass border-slate-700 flex items-center justify-center hover:border-brand-blue transition-colors animate-bounce">
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
