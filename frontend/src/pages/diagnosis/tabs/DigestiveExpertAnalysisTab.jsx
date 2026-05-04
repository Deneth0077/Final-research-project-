
import React, { useMemo, useState } from 'react';
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
    const sections = useMemo(() => reportText.split(/\n\s*\n/), [reportText]);

    const findSection = (keywordsList) => {
        return sections.find((s) =>
            keywordsList.some(k => s.toLowerCase().includes(k.toLowerCase()))
        ) || '';
    };

    const keywords = [
        'Identified Symptoms & Signs',
        'Detected Visual Patterns',
        'Clinical Interpretation',
        'Recommended Next Steps',
        'Risk Level',
        'Suggested Specialist',
    ];

    const parseBulletPoints = (text) => {
        if (!text) return [];
        return text.split('\n')
            .map(line => line.replace(/^[*•\-\d.\s]+/, '').trim())
            .filter(line => line.length > 5) 
            .filter(line => !keywords.some(k => line.toLowerCase().includes(k.toLowerCase()))) 
            .filter(line => !line.match(/^[A-Z\s&]{5,}$/));
    };

    const cleanHeadingText = (text, heading) =>
        text
            .replace(new RegExp(heading, 'i'), '')
            .replace(':', '')
            .replace(/[*#]/g, '')
            .trim();

    const interpretation = findSection(['Clinical Interpretation']);
    const patterns = findSection(['Detected Visual Patterns', 'Patterns']);
    const symptoms = findSection(['Identified Symptoms & Signs', 'Symptoms']);
    const tests = findSection(['Recommended Next Steps', 'Next Steps']);

    const interpretationPoints = parseBulletPoints(interpretation);
    const symptomsPoints = parseBulletPoints(symptoms);
    const patternsPoints = parseBulletPoints(patterns);
    const testsPoints = parseBulletPoints(tests);

    const [showGradCam, setShowGradCam] = useState(true);

    return (
        <div className="h-full overflow-y-auto pr-2 space-y-6 pb-8">
            {/* Section 1: Digestive Expert Review */}
            <Card variant="outlined" className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                <Box className="bg-gray-50/80 px-4 py-2 border-b border-gray-200">
                    <Typography variant="subtitle2" className="font-bold text-gray-800">
                        Digestive Expert Analysis
                    </Typography>
                </Box>
                <CardContent className="p-5">
                    <Typography variant="h6" className="font-bold text-gray-900">
                        Digestive Expert Review
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                        General explanation view for the same uploaded image used in digestive prediction.
                    </Typography>
                </CardContent>
            </Card>

            {/* Section 2: Show Grad-CAM View */}
            <Card variant="outlined" className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                <Box className="bg-gray-50/80 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                    <Box>
                        <Typography variant="subtitle2" className="font-bold text-gray-800">
                            Grad-CAM Visualization
                        </Typography>
                    </Box>
                    <Button 
                        size="small"
                        variant="outlined"
                        className="normal-case text-indigo-600 border-indigo-200 hover:bg-indigo-50 text-xs"
                        onClick={() => setShowGradCam(!showGradCam)}
                    >
                        {showGradCam ? 'Hide Grad-CAM View' : 'Display Grad-CAM View'}
                    </Button>
                </Box>
                <CardContent className="p-5 bg-white min-h-[260px]">
                    <Box className="flex justify-center items-center min-h-[220px]">
                        {isGradCamLoading ? (
                            <CircularProgress size={40} className="text-indigo-600" />
                        ) : (
                            showGradCam && gradCamUrl ? (
                                <img 
                                    src={gradCamUrl} 
                                    alt="Grad-CAM Visualization" 
                                    className="max-w-full h-auto rounded-lg border border-gray-200" 
                                    style={{ maxHeight: '360px' }} 
                                />
                            ) : (
                                <Box className="text-gray-400 italic py-10">Grad-CAM view is currently hidden</Box>
                            )
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Section 3: Clinical Interpretation + Recommendation */}
            <Card variant="outlined" className="rounded-xl border-gray-200 shadow-sm overflow-hidden">
                <Box className="bg-gray-50/80 px-4 py-2 border-b border-gray-200">
                    <Typography variant="subtitle2" className="font-bold text-gray-800">
                        Clinical Interpretation
                    </Typography>
                </Box>
                <CardContent className="p-5 space-y-5">
                    <Typography variant="body2" className="text-gray-700 leading-relaxed">
                        {cleanHeadingText(interpretation, 'Clinical Interpretation') ||
                            'The AI model has classified this iris image as showing patterns associated with a digestive-related condition. The Explainable AI (Grad-CAM) visualization highlights the regions that most influenced this prediction.'}
                    </Typography>

                    <div>
                        <Typography variant="subtitle2" className="font-semibold text-gray-800 mb-2">
                            Signs indicated by the model
                        </Typography>
                        <List className="p-0">
                            {[...symptomsPoints, ...patternsPoints].slice(0, 4).map((point, index) => (
                                <ListItem key={index} className="px-0 py-0.5 items-start">
                                    <ListItemIcon className="min-w-[24px] mt-1">
                                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={point}
                                        primaryTypographyProps={{ className: "text-sm text-gray-700 leading-relaxed" }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </div>

                    <div>
                        <Typography variant="subtitle2" className="font-semibold text-gray-800 mb-2">
                            Recommendation
                        </Typography>
                        <List className="p-0">
                            {testsPoints.length > 0 ? testsPoints.map((test, i) => (
                                <ListItem key={i} className="px-0 py-0.5 items-start">
                                    <ListItemIcon className="min-w-[24px] mt-1">
                                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={test}
                                        primaryTypographyProps={{ className: "text-sm text-gray-700 leading-relaxed" }}
                                    />
                                </ListItem>
                            )) : (
                                <Typography variant="body2" className="text-gray-600 italic">
                                    The detected patterns may be associated with digestive system irregularities. Further clinical evaluation is recommended.
                                </Typography>
                            )}
                        </List>
                    </div>

                    <Box className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                        <Typography variant="caption" className="text-amber-900">
                            Disclaimer: This AI analysis is intended to assist healthcare professionals and should not replace clinical judgment.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
}

export default DigestiveExpertAnalysisTab;
