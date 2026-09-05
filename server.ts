import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Support large image payloads (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Batsman Comfort Level Analysis Endpoint
app.post('/api/analyze-batsman', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, batsmanNameHint, contextNotes } = req.body;

    if (!imageBase64 && !batsmanNameHint) {
      return res.status(400).json({
        error: 'Please provide an image or batsman name to analyze comfort levels.',
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are an elite Cricket Performance Analyst and Biomechanics Expert specializing in Batsman Comfort Level profiling against different bowling variations.
Your mission:
1. Examine the provided cricket data image, scorecard, chart, batsman photo, or player information.
2. If the image contains a chart or table like the reference ("SHAHBAZ Comfort Level" with RAFM, RALS, RAOS, LAFM, LAOD, and a dismissal count table with RAM, LAM, LAS, RLB, ROB), transcribe all values with maximum precision.
3. If the image is a batsman photo, stance, shot, or match situation, analyze their batting technique, setup, grip, footwork against pace vs spin, and calculate a realistic, grounded Comfort Level (average / index 0-60+) across all standard bowling variations:
   - RAFM: Right Arm Fast Medium
   - RALS: Right Arm Leg Spin
   - RAOS: Right Arm Off Spin
   - LAFM: Left Arm Fast Medium
   - LAOD: Left Arm Orthodox Delivery
   And dismissal distribution:
   - RAM: Right Arm Medium / Fast
   - LAM: Left Arm Medium / Fast
   - LAS: Left Arm Spin
   - RLB: Right Leg Break
   - ROB: Right Off Break
4. Provide structured, insightful analysis including technical insights, opposition bowling plan, and batsman counter-strategy.
Return the output strictly matching the requested JSON schema.`;

    const contents: any[] = [];

    const promptText = `Analyze this cricket batsman comfort level. 
${batsmanNameHint ? `Batsman identifier / hint: "${batsmanNameHint}".` : ''}
${contextNotes ? `User context: "${contextNotes}".` : ''}

Extract or compute the comfort level graph data and dismissals breakdown.
Standard bowling acronyms:
- RAFM: Right Arm Fast Medium
- RALS: Right Arm Leg Spin
- RAOS: Right Arm Off Spin
- LAFM: Left Arm Fast Medium
- LAOD: Left Arm Orthodox Delivery
Table headers:
- RAM: Right Arm Medium / Fast
- LAM: Left Arm Medium / Fast
- LAS: Left Arm Spin
- RLB: Right Leg Break
- ROB: Right Off Break

Make sure the averages and numbers are realistic numbers (e.g. averages typically between 5.0 and 65.0).`;

    if (imageBase64 && mimeType) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }
    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            batsmanName: { type: Type.STRING, description: 'Name of batsman, e.g. SHAHBAZ' },
            comfortTitle: { type: Type.STRING, description: 'Title, e.g. Comfort Level' },
            overallComfortScore: { type: Type.NUMBER, description: 'Overall comfort score 0-100' },
            dominantBowlingType: { type: Type.STRING, description: 'Bowling style batsman is most comfortable against' },
            mostVulnerableBowlingType: { type: Type.STRING, description: 'Bowling style batsman struggles most against' },
            comfortSummary: { type: Type.STRING, description: 'Detailed summary of comfort level and weaknesses' },
            bowlingCategories: {
              type: Type.ARRAY,
              description: 'Categories for the horizontal bar chart (e.g. RAFM, RALS, RAOS, LAFM, LAOD)',
              items: {
                type: Type.OBJECT,
                properties: {
                  code: { type: Type.STRING, description: 'Bowling code e.g. RAFM, RALS, RAOS, LAFM, LAOD' },
                  fullName: { type: Type.STRING, description: 'Full name of bowling style' },
                  average: { type: Type.NUMBER, description: 'Comfort level score or batting average' },
                  comfortAssessment: { type: Type.STRING, description: 'Dominant, Comfortable, Moderate, or Vulnerable' },
                  dismissals: { type: Type.NUMBER, description: 'Number of dismissals if available' },
                  ballsFaced: { type: Type.NUMBER, description: 'Estimated balls faced' },
                  strikeRate: { type: Type.NUMBER, description: 'Estimated strike rate' },
                  description: { type: Type.STRING, description: 'Specific observation for this bowling type' },
                },
                required: ['code', 'fullName', 'average'],
              },
            },
            dismissalsTable: {
              type: Type.ARRAY,
              description: 'Dismissals breakdown table entries e.g. RAM, LAM, LAS, RLB, ROB',
              items: {
                type: Type.OBJECT,
                properties: {
                  bowlerType: { type: Type.STRING, description: 'Code: RAM, LAM, LAS, RLB, ROB' },
                  fullName: { type: Type.STRING, description: 'Full name' },
                  count: { type: Type.NUMBER, description: 'Number of dismissals / instances' },
                },
                required: ['bowlerType', 'fullName', 'count'],
              },
            },
            technicalInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Technical biomechanics and batting insights',
            },
            tacticalPlanAgainstBatsman: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Tactical plan for opposition bowlers to exploit weaknesses',
            },
            batsmanCounterStrategy: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Actionable tips for the batsman to overcome vulnerabilities',
            },
          },
          required: [
            'batsmanName',
            'comfortTitle',
            'overallComfortScore',
            'dominantBowlingType',
            'mostVulnerableBowlingType',
            'comfortSummary',
            'bowlingCategories',
            'dismissalsTable',
            'technicalInsights',
            'tacticalPlanAgainstBatsman',
            'batsmanCounterStrategy',
          ],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from AI model');
    }

    const parsedData = JSON.parse(responseText);
    parsedData.detectedFromImage = Boolean(imageBase64);

    return res.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error analyzing batsman comfort level:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze batsman comfort level from image.',
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cricket Comfort Level App running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
