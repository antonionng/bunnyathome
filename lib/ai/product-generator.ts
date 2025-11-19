import openai, { BRAND_VOICE, AI_MODELS, calculateCost } from "./openai-client";
import type { AIDescriptionRequest, AIDescriptionResponse } from "@/types/product";

/**
 * Generate product description using GPT-4
 */
export async function generateProductDescription(
  request: AIDescriptionRequest
): Promise<AIDescriptionResponse> {
  const prompt = buildDescriptionPrompt(request);

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: BRAND_VOICE,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(response);
  
  return {
    description: parsed.description,
    heatNotes: parsed.heatNotes,
    highlights: parsed.highlights,
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
    marketingCopy: parsed.marketingCopy,
  };
}

/**
 * Build prompt for product description generation
 */
function buildDescriptionPrompt(request: AIDescriptionRequest): string {
  let prompt = `Generate compelling product copy for this Durban curry product:

Product Name: ${request.productName}
Category: ${request.category}`;

  if (request.ingredients && request.ingredients.length > 0) {
    prompt += `\nIngredients: ${request.ingredients.join(", ")}`;
  }

  if (request.spiceLevel) {
    prompt += `\nSpice Level: ${request.spiceLevel}`;
  }

  if (request.servingSize) {
    prompt += `\nServes: ${request.servingSize}`;
  }

  if (request.specialFeatures && request.specialFeatures.length > 0) {
    prompt += `\nSpecial Features: ${request.specialFeatures.join(", ")}`;
  }

  prompt += `

Generate a JSON response with:
{
  "description": "2-3 sentence product description (50-80 words) that's appetizing and authentic",
  "heatNotes": "One sentence about the spice profile and how to adjust it",
  "highlights": ["3-4 key selling points as short phrases"],
  "seoTitle": "SEO-optimized title (under 60 characters)",
  "seoDescription": "SEO meta description (120-160 characters)",
  "marketingCopy": "Punchy one-liner for marketing (under 100 characters)"
}

Remember:
- Use South African English and cultural references
- Be authentic about Durban curry heritage
- Mention Grey Street influence where appropriate
- Keep it warm and conversational
- Focus on taste, quality, and convenience`;

  return prompt;
}

/**
 * Detect allergens from ingredients using GPT-4
 */
export async function detectAllergens(ingredients: string[]): Promise<string[]> {
  const prompt = `Analyze these ingredients and identify common allergens according to international food labeling standards:

Ingredients: ${ingredients.join(", ")}

Return ONLY a JSON array of allergen names. If no allergens are present, return an empty array.
Common allergens include: Gluten, Dairy, Eggs, Nuts, Peanuts, Soy, Fish, Shellfish, Mustard, Sesame, Celery, Sulphites, Lupin.

Example format: ["Gluten", "Dairy", "Mustard"]`;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: "You are a food safety expert specializing in allergen identification.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    return [];
  }

  const parsed = JSON.parse(response);
  return parsed.allergens || [];
}

/**
 * Generate SEO-optimized content for a product
 */
export async function generateSEOContent(
  productName: string,
  category: string,
  description: string
): Promise<{ seoTitle: string; seoDescription: string; keywords: string[] }> {
  const prompt = `Generate SEO content for this product:

Product Name: ${productName}
Category: ${category}
Description: ${description}

Generate a JSON response with:
{
  "seoTitle": "SEO-optimized title (50-60 characters, include primary keyword)",
  "seoDescription": "Meta description (150-160 characters, compelling and keyword-rich)",
  "keywords": ["5-8 relevant keywords for SEO"]
}

Focus on:
- Durban curry and South African cuisine keywords
- Location-based terms (South Africa, Durban, Grey Street)
- Product-specific terms
- Food delivery and convenience terms`;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(response);
}

/**
 * Generate product highlights from ingredients and features
 */
export async function generateHighlights(
  ingredients: string[],
  specialFeatures: string[]
): Promise<string[]> {
  const prompt = `Create 3-4 punchy product highlights for a Durban curry product with these details:

Ingredients: ${ingredients.join(", ")}
Special Features: ${specialFeatures.join(", ")}

Return a JSON object with a "highlights" array containing 3-4 short, compelling phrases (each under 25 characters).
Focus on what makes this product special, authentic, or convenient.

Example: ["Slow-cooked 6 hours", "Grey Street recipe", "Bone-in richness"]`;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: BRAND_VOICE,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    return [];
  }

  const parsed = JSON.parse(response);
  return parsed.highlights || [];
}

