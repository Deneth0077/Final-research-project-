
import React, { useState } from 'react';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Button,
    CircularProgress
} from '@mui/material';

function DigestiveExpertAnalysisTab({ aiAssessment, gradCamUrl, isGradCamLoading }) {
    
    if (!aiAssessment || !aiAssessment.validation_report) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <svg className="w-12 h-12 text-indigo-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Expert Insights Pending</h3>
                <p className="text-gray-500 text-center max-w-sm mt-2">
                    The specialized medical visual analysis for the digestive system is still being processed or unavailable.
                </p>
            </div>
        )
    }

    const reportText = aiAssessment.validation_report || '';
    const sections = reportText.split(/\n\s*\n/);

    const findSection = (keywordsList) => {
        return sections.find(s => 
            keywordsList.some(k => s.toLowerCase().includes(k.toLowerCase()))
        ) || '';
    }

    const keywords = ['Identified Symptoms & Signs', 'Detected Visual Patterns', 'Clinical Interpretation', 'Recommended Next Steps', 'Risk Level', 'Suggested Specialist'];

    const parseBulletPoints = (text) => {
        if (!text) return [];
        return text.split('\n')
            .map(line => line.replace(/^[*•\-\d.\s]+/, '').trim())
            .filter(line => line.length > 5) 
            .filter(line => !keywords.some(k => line.toLowerCase().includes(k.toLowerCase()))) 
            .filter(line => !line.match(/^[A-Z\s&]{5,}$/));
    }

    const interpretation = findSection(['Clinical Interpretation'])
    const patterns = findSection(['Detected Visual Patterns', 'Patterns'])
    const symptoms = findSection(['Identified Symptoms & Signs', 'Symptoms'])
    const tests = findSection(['Recommended Next Steps', 'Next Steps'])

    const interpretationPoints = parseBulletPoints(interpretation);
    const symptomsPoints = parseBulletPoints(symptoms);
    const patternsPoints = parseBulletPoints(patterns);
    const testsPoints = parseBulletPoints(tests);

    const [showGradCam, setShowGradCam] = useState(true);

    return (
        <div className="h-full overflow-y-auto pr-2 space-y-6 pb-8">
            {/* Overview Card */}
            <Card className="border-none shadow-md bg-gradient-to-br from-indigo-900 to-indigo-800 text-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <Typography variant="overline" className="text-indigo-200 font-bold tracking-widest">
                                Specialized Visual Analysis
                            </Typography>
                            <Typography variant="h4" className="font-bold mt-1">
                                Expert Pathology Review
                            </Typography>
                        </div>
                        <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 text-center min-w-[100px]">
                            <Typography className="text-[10px] uppercase font-bold text-indigo-100">Confidence Score</Typography>
                            <Typography variant="h5" className="font-black text-white">
                                {Number.isFinite(aiAssessment.confidence) ? Math.round(aiAssessment.confidence * 100) : '85'}%
                            </Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Clinical Interpretation Section */}
            <Card variant="outlined" className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                <Box className="bg-gray-50/50 px-4 py-2 border-b border-gray-200">
                    <Typography variant="subtitle2" className="font-bold text-gray-700">
                        Clinical Interpretation
                    </Typography>
                </Box>
                <CardContent className="p-6">
                    <Box className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                        <Typography variant="subtitle2" className="font-bold text-indigo-900 mb-4 uppercase tracking-wider text-[10px]">
                            Expert Clinical Interpretation
                        </Typography>
                        <List className="p-0">
                            {interpretationPoints.length > 0 ? (
                                interpretationPoints.map((point, index) => (
                                    <ListItem key={index} className="px-0 py-1 items-start">
                                        <ListItemIcon className="min-w-[30px] mt-1.5">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={point} 
                                            primaryTypographyProps={{ className: "text-sm text-gray-800 leading-relaxed font-medium" }}
                                        />
                                    </ListItem>
                                ))
                            ) : (
                                <Typography variant="body2" className="text-gray-700 leading-relaxed italic">
                                    {interpretation.replace(/Clinical Interpretation/i, '').replace(':', '').replace(/[*#]/g, '').trim() || 
                                     "No specific clinical interpretation points available. Please correlate with other diagnostic findings."}
                                </Typography>
                            )}
                        </List>
                    </Box>
                </CardContent>
            </Card>

            {/* Grad-CAM Section */}
            <Card variant="outlined" className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                <Box className="bg-gray-50/50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                    <Box>
                        <Typography variant="subtitle2" className="font-bold text-gray-700 uppercase text-[11px] tracking-widest">
                            Visual Explanation (Grad-CAM)
                        </Typography>
                    </Box>
                    <Button 
                        size="small"
                        variant="outlined"
                        className="normal-case text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        onClick={() => setShowGradCam(!showGradCam)}
                    >
                        {showGradCam ? 'Hide Heatmap' : 'Show Heatmap'}
                    </Button>
                </Box>
                <CardContent className="p-6 bg-white min-h-[300px]">
                    <Typography variant="body2" className="text-gray-500 mb-6 italic">
                        This visualization highlights the specific regions of the iris scan that the AI model prioritized during its digestive diagnostic assessment.
                    </Typography>
                    <Box className="flex justify-center items-center">
                        {isGradCamLoading ? (
                            <CircularProgress size={40} className="text-indigo-600" />
                        ) : (
                            showGradCam && gradCamUrl ? (
                                <img 
                                    src={gradCamUrl} 
                                    alt="Grad-CAM Visualization" 
                                    className="max-w-full h-auto rounded-2xl shadow-xl border-4 border-white" 
                                    style={{ maxHeight: '450px' }} 
                                />
                            ) : (
                                <Box className="text-gray-400 italic py-10">Heatmap visualization is currently hidden</Box>
                            )
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Recommendation Card */}
            <div className="bg-blue-50 rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-blue-200/50 p-4 border-b border-blue-200 flex items-center gap-3">
                    <span className="text-2xl">🧪</span>
                    <h3 className="text-lg font-bold text-blue-900">Recommended Next Steps</h3>
                </div>
                <div className="p-5 flex-1">
                    <div className="flex flex-wrap gap-2">
                        {testsPoints.length > 0 ? testsPoints.map((test, i) => (
                            <div key={i} className="px-4 py-2 bg-white rounded-full border border-blue-200 shadow-sm text-sm font-bold text-blue-700 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                {test}
                            </div>
                        )) : <p className="text-xs text-blue-700 italic">No specific next steps provided.</p>}
                    </div>
                </div>
            </div>

            {/* Note Section */}
            <div className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200 italic text-center">
                <Typography variant="body2" className="text-gray-500 text-xs">
                    This observation is generated by a specialized validation model trained on digestive pathology data. It is intended for referral support and is NOT a definitive medical diagnosis. Professional medical review is mandatory.
                </Typography>
            </div>
        </div>
    );
}

export default DigestiveExpertAnalysisTab;
