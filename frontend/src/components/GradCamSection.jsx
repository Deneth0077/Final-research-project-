import React from 'react';
import { Typography } from '@mui/material';

function GradCamSection({ gradCamUrl, isLoading, title = "Grad-CAM Visual Evidence", description = "This visualization highlights the specific regions of the iris scan that the AI model prioritized during its assessment." }) {
    return (
        <div className="bg-white rounded-2xl border-2 border-indigo-100 shadow-md overflow-hidden mt-6">
            <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📸</span>
                    <h3 className="text-lg font-bold text-indigo-900">{title}</h3>
                </div>
                <div className="px-3 py-1 bg-indigo-100 rounded-full text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                    AI Focus Map
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <Typography variant="body2" className="text-slate-600 leading-relaxed">
                            {description}
                        </Typography>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-xs font-semibold text-slate-700">Primary Diagnostic focus area</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="text-xs font-semibold text-slate-700">Secondary contributing patterns</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-xs font-semibold text-slate-700">Background/Normal tissue</span>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mt-4">
                            <p className="text-[11px] text-slate-500 italic">
                                Note: Red heat zones indicate where the neural network "looked" most intensely to identify pathological markers.
                            </p>
                        </div>
                    </div>
                    <div className="relative group">
                        {isLoading ? (
                            <div className="aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-sm font-bold text-slate-400">Generating Heatmap...</p>
                            </div>
                        ) : gradCamUrl ? (
                            <div className="relative">
                                <img 
                                    src={gradCamUrl} 
                                    alt="Grad-CAM Visualization" 
                                    className="w-full aspect-square object-cover rounded-2xl shadow-xl border-4 border-white transition-transform duration-500 group-hover:scale-[1.02]"
                                />
                                <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none"></div>
                                <div className="absolute bottom-4 right-4">
                                    <button 
                                        onClick={() => window.open(gradCamUrl, '_blank')}
                                        className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-indigo-600 hover:text-indigo-800 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 text-center p-6">
                                <span className="text-4xl mb-3">⚠️</span>
                                <p className="text-sm font-bold text-slate-500">Visualization Unavailable</p>
                                <p className="text-xs text-slate-400 mt-1">Unable to generate neural focus map for this specific scan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GradCamSection;
