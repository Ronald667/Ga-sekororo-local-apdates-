import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import { GoogleGenAI } from '@google/genai';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json());

// Initialize Gemini API client
const ai = new GoogleGenAI({
  apiKey: process.env['GEMINI_API_KEY'] || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint to generate custom Ga-Sekororo local news story with AI
app.post('/api/ai/generate-story', async (req, res) => {
  try {
    const { prompt, category } = req.body;
    const systemPrompt = `You are a professional senior journalist and cultural editor for "Ga Sekororo Local Stories", a media outlet covering Ga-Sekororo in Limpopo, South Africa. Write a captivating, authentic news article, cultural feature, or entertainment piece based on the user's prompt and category (${category}). Include a compelling headline, author byline, read time, and well-structured markdown body with rich local context (mentioning local landmarks like Blyde River Canyon foothills, Drakensberg escarpment, local traditional leadership, community initiatives, or vibrant culture). Return a JSON object with keys: title, excerpt, content, author, readTime, category.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt || 'Write a report on recent community developments in Ga-Sekororo',
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const storyData = JSON.parse(text);
    res.json({ success: true, story: storyData });
  } catch (error: any) {
    console.error('Error generating story with Gemini:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to generate story' });
  }
});

// API endpoint to fetch latest news using Google Search grounding
app.post('/api/ai/fetch-google-news', async (req, res) => {
  try {
    const systemPrompt = `You are the automated Google News Intelligence gathering agent for "Ga Sekororo Local Stories". Search Google for recent news, agricultural updates, traditional council announcements, or regional developments in Ga-Sekororo, Tzaneen, and Limpopo Province. Synthesize the findings into a fresh, compelling news article. Return a JSON object with keys: title, excerpt, content, author, readTime, category.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Search Google for the latest news, events, farming updates, or community developments in Ga-Sekororo and Limpopo Province.',
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '{}';
    const storyData = JSON.parse(text);
    
    // Extract grounding sources if available
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;
    const searchChunks = groundingMetadata?.groundingChunks || [];

    res.json({ success: true, story: storyData, sources: searchChunks });
  } catch (error: any) {
    console.error('Error fetching Google news with grounding:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to fetch Google news' });
  }
});

// API endpoint for Sekororo AI Reporter / Cultural Guide Q&A
app.post('/api/ai/ask-reporter', async (req, res) => {
  try {
    const { question, history } = req.body;
    const systemPrompt = `You are "Mmanapo", the Sekororo AI Reporter and Cultural Guide. You have deep knowledge of Ga-Sekororo history, traditional customs of the Lobedu and Northern Sotho communities, local leadership under the Sekororo Traditional Council, tourism attractions around the Blyde River Canyon, local farming (avocado, mango, citrus), and community news. Answer questions politely, warmly, and knowledgeably with a local touch.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    res.json({ success: true, answer: response.text || 'No response generated.' });
  } catch (error: any) {
    console.error('Error in AI reporter:', error);
    res.status(500).json({ success: false, error: error.message || 'Failed to get answer' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
