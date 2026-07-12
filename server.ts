import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parsing
  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini client if API key is provided
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API endpoint for AI content generation
  app.post('/api/ai/generate', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in the server environment.'
        });
      }

      const { title, brand, category, description } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Product Title is required' });
      }

      const prompt = `You are a professional luxury fashion and premium technology copywriter for FahimMart.
Generate an engaging, highly persuasive AI Recommendation & Styling / Tech advice for this product:
Title: ${title}
Brand: ${brand || 'Premium Brand'}
Category: ${category || 'Premium Curation'}
Description: ${description || 'No description provided'}

Write a paragraph (around 80-120 words) detailing:
1. Why this product is a smart, high-value choice.
2. What makes it special, and any professional styling advice (if fashion/accessory) or premium setup guidance (if tech/electronics/home).
Keep the tone sophisticated, exclusive, premium, and trustworthy. Use high-quality language. Do not include markdown headers, just the text.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const aiText = response.text || 'AI description generation yielded an empty response.';
      res.json({ text: aiText });
    } catch (err: any) {
      console.error('Error in /api/ai/generate:', err);
      res.status(500).json({ error: err.message || 'Failed to generate AI recommendation' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for non-API routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FahimMart server booting up at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start full-stack Express server:', error);
});
