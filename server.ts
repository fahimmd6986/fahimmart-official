import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './src/lib/firebase';

dotenv.config();

// Fetch active AI settings from Firestore with a solid, smart fallback
async function getActiveAiSettings() {
  try {
    const docRef = doc(db, 'ai_settings', 'active_config');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  } catch (error) {
    console.error('Error fetching active AI settings from Firestore, falling back to defaults:', error);
  }
  return {
    productWritingStyle: 'Luxury & Persuasive (Captivating, high-end vocabulary)',
    seoRules: 'Optimize for clean, non-spammy keywords; include a powerful CTR-focused title; include meta description.',
    descriptionLength: 'Medium (Showcase craft, detail, and utility across 2 paragraphs)',
    businessInstructions: 'Highlight Amazon Affiliate curation aspect, premium quality, and exclusive Indian Rupees pricing.',
    productRules: 'Infer realistic pricing in INR (₹) and features based on tiers. Never use placeholder images or placeholder text.',
    aiBehaviour: 'Elite Concierge / Personal Stylist (Helpful, sophisticated, extremely knowledgeable)',
    customPrompt: `You are an elite product curator and catalog manager for FahimMart. Generate an immersive, highly persuasive and detailed AI styling advice, tech curation advice, or setup guide written in the voice of an elite concierge.`
  };
}

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

  // API endpoint for AI content generation (Upgraded existing AI)
  app.post('/api/ai/generate', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in the server environment.'
        });
      }

      const { title, brand, category, description, mode, chatQuery } = req.body;
      if (!title && mode !== 'chat') {
        return res.status(400).json({ error: 'Product Title is required' });
      }

      const aiSettings = await getActiveAiSettings();

      const systemContext = `You are an elite e-commerce AI assistant for FahimMart.
Apply these dynamic AI Settings for your behavior, response scope, and tone:
- Product Writing Style: ${aiSettings.productWritingStyle}
- SEO Rules: ${aiSettings.seoRules}
- Description Length: ${aiSettings.descriptionLength}
- Business Instructions: ${aiSettings.businessInstructions}
- Product Rules: ${aiSettings.productRules}
- AI Behavior: ${aiSettings.aiBehaviour}
- General Guidelines: ${aiSettings.customPrompt}`;

      let prompt = '';
      if (mode === 'descriptions') {
        prompt = `${systemContext}
Task: Generate premium short and full descriptions for this product based on current settings:
Title: ${title}
Brand: ${brand || 'Premium Brand'}
Category: ${category || 'Premium Curation'}
Original Hint: ${description || 'No existing description'}

Return a valid JSON object matching exactly this schema:
{
  "shortDesc": "captivating 1-2 sentence description",
  "fullDesc": "detailed multi-paragraph description showing craftsmanship, utility, and design"
}
Return ONLY the raw JSON object. Do not wrap it in markdown.`;
      } else if (mode === 'seo') {
        prompt = `${systemContext}
Task: Generate high-performance SEO Title, SEO Description, and search keywords for this product based on current settings:
Title: ${title}
Brand: ${brand || 'Premium Brand'}
Category: ${category || 'Premium Curation'}
Description Hint: ${description || ''}

Return a valid JSON object matching exactly this schema:
{
  "seoTitle": "SEO title focused on conversion and search",
  "seoDesc": "persuasive SEO meta description",
  "seoKeywords": "comma-separated list of keywords"
}
Return ONLY the raw JSON object. Do not wrap it in markdown.`;
      } else if (mode === 'tags_and_categories') {
        prompt = `${systemContext}
Task: Suggest product tags, search keywords, and recommend a proper category (e.g. fashion, beauty, electronics, mobiles, laptops, home-kitchen, sports, books, accessories) for this product based on current settings:
Title: ${title}
Brand: ${brand || 'Premium Brand'}
Category: ${category || 'Premium Curation'}

Return a valid JSON object matching exactly this schema:
{
  "tags": "comma-separated list of product tags",
  "keywords": "comma-separated list of search keywords",
  "recommendedCategory": "one of the category slugs"
}
Return ONLY the raw JSON object. Do not wrap it in markdown.`;
      } else if (mode === 'chat') {
        prompt = `${systemContext}
Task: Answer the administrator's request, suggest product ideas, or provide assistance.
User Admin Ask: ${chatQuery}
Current Product Context (if any):
Title: ${title || 'N/A'}
Brand: ${brand || 'N/A'}
Category: ${category || 'N/A'}
Description: ${description || 'N/A'}

Provide a helpful, highly polished, professional, and sophisticated response as an expert e-commerce catalog consultant. Maintain clean spacing.`;
      } else {
        // Default recommendation mode (the original behaviour, but upgraded and respecting AI Settings)
        prompt = `${systemContext}
Generate an engaging, highly persuasive AI Recommendation & Styling / Tech advice for this product:
Title: ${title}
Brand: ${brand || 'Premium Brand'}
Category: ${category || 'Premium Curation'}
Description: ${description || 'No description provided'}

Write a paragraph (around 80-120 words) detailing why this product is a smart, high-value choice, what makes it special, and any professional styling advice (if fashion/accessory) or premium setup guidance (if tech/electronics/home). Use high-quality language. Do not include markdown headers, just the text.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const responseText = response.text || '';
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```(?:json)?\n?/i, '');
        cleanText = cleanText.replace(/\n?```$/, '');
      }
      cleanText = cleanText.trim();

      if (mode === 'descriptions' || mode === 'seo' || mode === 'tags_and_categories') {
        try {
          const parsed = JSON.parse(cleanText);
          return res.json(parsed);
        } catch (e) {
          console.error("JSON parse failed, returning raw text:", cleanText);
          return res.json({ raw: cleanText });
        }
      }

      res.json({ text: cleanText });
    } catch (err: any) {
      console.error('Error in /api/ai/generate:', err);
      res.status(500).json({ error: err.message || 'Failed to generate AI recommendation' });
    }
  });

  // API endpoint for bulk generation from a single affiliate URL (using active AI settings)
  app.post('/api/ai/bulk-generate-product', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in the server environment.'
        });
      }

      const { affiliateUrl } = req.body;
      if (!affiliateUrl) {
        return res.status(400).json({ error: 'Affiliate URL is required.' });
      }

      const aiSettings = await getActiveAiSettings();

      const prompt = `You are a product catalog manager for FahimMart, a premium shopping platform.
Analyze the following Amazon URL and extract or infer full, highly polished product details.
Amazon URL: ${affiliateUrl}

Apply these AI Settings for content generation:
- Product Writing Style: ${aiSettings.productWritingStyle}
- SEO Rules: ${aiSettings.seoRules}
- Description Length: ${aiSettings.descriptionLength}
- Business Instructions: ${aiSettings.businessInstructions}
- Product Rules: ${aiSettings.productRules}
- AI Behavior: ${aiSettings.aiBehaviour}

Additional Curation Prompt Guidelines:
${aiSettings.customPrompt}

You must return a valid JSON object matching this schema:
{
  "title": "A highly premium product title suited for a curated shopping store. Clean, free of excessive keyword stuffing",
  "brand": "Brand name, e.g., Apple, Sony, Zara, Adidas, etc.",
  "category": "One of: 'electronics', 'mobiles', 'laptops', 'fashion', 'home-kitchen', 'beauty', 'sports', 'books', 'accessories'",
  "price": 14999, // Guess a realistic value in Indian Rupees (₹) based on standard pricing of this product tier
  "originalPrice": 19999, // Guess realistic original price in INR (₹)
  "discount": 25, // percentage discount as a number (e.g., 25 for 25% off)
  "rating": 4.5, // Realistic rating, e.g., 4.2 - 4.8
  "reviewCount": 350, // Realistic reviews count
  "shortDescription": "A captivating, concise 1-2 sentence overview of why this product is curated and curated as premium.",
  "fullDescription": "A detailed multi-paragraph story-like description showcasing craftsmanship, daily utility, and elegant design.",
  "features": [
    "Feature 1 with premium vocabulary",
    "Feature 2",
    "Feature 3"
  ],
  "specifications": {
    "Model": "e.g., WH-1000XM5",
    "Color": "e.g., Midnight Black",
    "Warranty": "1 Year Brand Warranty",
    "Material / Tech Specs": "..."
  },
  "pros": [
    "Compelling pro 1",
    "Compelling pro 2"
  ],
  "cons": [
    "Acceptable con 1",
    "Acceptable con 2"
  ],
  "faq": [
    { "question": "Is it compatible with fast charging?", "answer": "Yes, it supports power delivery fast charging protocols." }
  ],
  "slug": "url-friendly-slug-for-the-product",
  "seo": {
    "title": "SEO title e.g. Buy Apple iPhone 15 Online - FahimMart Premium Curation",
    "description": "Premium SEO description summarizing key specifications, pricing, and curation.",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "isPrime": true,
  "aiField": "An incredibly persuasive and detailed AI styling advice, tech curation advice, or setup guide written in the voice of an elite concierge."
}

Ensure the "category" is exactly one of the permitted slugs mentioned above. Return only the JSON object. Do not wrap it in any markdown code block other than returning raw JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini model returned an empty response.');
      }

      let cleanText = responseText.trim();
      if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/^```(?:json)?\n?/i, '');
        cleanText = cleanText.replace(/\n?```$/, '');
      }
      cleanText = cleanText.trim();

      const parsedProduct = JSON.parse(cleanText);
      // Set some reliable base values
      parsedProduct.id = 'p_bulk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      parsedProduct.affiliateUrl = affiliateUrl;
      
      // Select a beautiful default mock/curated premium Unsplash image placeholder based on category
      let defaultImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'; // generic product
      const cat = (parsedProduct.category || '').toLowerCase();
      if (cat.includes('mobile') || cat.includes('phone')) {
        defaultImage = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('laptop') || cat.includes('computer')) {
        defaultImage = 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('electronic')) {
        defaultImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('fashion') || cat.includes('wear') || cat.includes('shirt')) {
        defaultImage = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('home') || cat.includes('kitchen')) {
        defaultImage = 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('beauty') || cat.includes('cosmetic')) {
        defaultImage = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('sports') || cat.includes('fitness')) {
        defaultImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('book')) {
        defaultImage = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
      } else if (cat.includes('accessor')) {
        defaultImage = 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80';
      }
      
      parsedProduct.mainImage = defaultImage;
      parsedProduct.gallery = [defaultImage];

      res.json(parsedProduct);
    } catch (err: any) {
      console.error('Error in /api/ai/bulk-generate-product:', err);
      res.status(500).json({ error: err.message || 'Failed to parse or generate bulk product content.' });
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
