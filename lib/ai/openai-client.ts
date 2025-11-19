import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

// Brand voice guidelines for Bunny At Home
export const BRAND_VOICE = `
You are writing product descriptions for Bunny At Home, a South African online food delivery service specializing in authentic Durban curry bunny chows.

Brand Personality:
- Warm, welcoming, and proudly South African
- Casual yet knowledgeable about Durban curry culture
- Emphasizes authenticity and quality
- Friendly and conversational tone
- References South African culture naturally (braai, rugby, heritage)

Writing Style:
- Use South African English (e.g., "braai" not "barbecue")
- Keep it punchy and appetizing
- Mention Grey Street heritage when relevant
- Focus on sensory details (taste, aroma, texture)
- Be honest about spice levels
- Highlight convenience and quality

Avoid:
- Overly formal language
- Generic food descriptions
- Clichés
- Exaggeration
- American or British slang
`;

// Image generation guidelines
export const IMAGE_STYLE_GUIDE = `
Generate product photography in a modern, appetizing style that showcases South African Durban curry cuisine.

Style Requirements:
- Professional food photography aesthetic
- Warm, inviting lighting
- Authentic South African presentation
- Clean, uncluttered composition
- Focus on the food as hero
- Natural colors that show the rich curry tones
- Include cultural context when appropriate (e.g., bunny loaf, traditional serving)

For Themed Boxes (Seasonal/Occasion):
- Blend South African aesthetic with occasion theme
- Example: "Valentine's Love Birds" = Durban curry styling + romantic elements (roses, hearts, warm lighting)
- Example: "Halloween Spice Night" = Durban curry styling + spooky vibes (dark background, mysterious lighting, orange accents)
- Keep the food authentic while incorporating thematic elements in background/styling
- Never compromise the cultural authenticity of the food itself
`;

// Configuration for different AI models
export const AI_MODELS = {
  GPT4: "gpt-4-turbo-preview",
  GPT4_VISION: "gpt-4-vision-preview",
  DALLE3: "dall-e-3",
} as const;

// Token cost tracking (in cents per 1K tokens)
export const TOKEN_COSTS = {
  "gpt-4-turbo-preview": {
    input: 0.01,  // $0.01 per 1K input tokens
    output: 0.03, // $0.03 per 1K output tokens
  },
  "dall-e-3": {
    standard_1024: 4.0,  // $0.04 per image
    hd_1024: 8.0,        // $0.08 per HD image
  },
} as const;

// Helper to calculate cost
export function calculateCost(model: string, tokensUsed: number, imageQuality?: "standard" | "hd"): number {
  if (model === "dall-e-3") {
    return imageQuality === "hd" 
      ? TOKEN_COSTS["dall-e-3"].hd_1024 
      : TOKEN_COSTS["dall-e-3"].standard_1024;
  }
  
  const costs = TOKEN_COSTS["gpt-4-turbo-preview"];
  return Math.ceil((tokensUsed / 1000) * (costs.input + costs.output));
}

