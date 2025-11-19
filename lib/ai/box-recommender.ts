import openai, { BRAND_VOICE, AI_MODELS } from "./openai-client";
import type { Product, SeasonalBoxRequest, SeasonalBoxSuggestion, BoxProductItem } from "@/types/product";
import type { DietaryTag } from "@/types/builder";

/**
 * Generate AI-powered box suggestions based on available products
 */
export async function generateBoxSuggestions(
  availableProducts: Product[],
  request: SeasonalBoxRequest
): Promise<SeasonalBoxSuggestion[]> {
  const prompt = buildBoxSuggestionPrompt(availableProducts, request);

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: BRAND_VOICE + "\n\nYou are an expert at creating balanced, appealing meal boxes that showcase Durban curry cuisine.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8, // Higher temperature for creativity
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(response);
  return parsed.suggestions || [];
}

/**
 * Build prompt for box suggestion generation
 */
function buildBoxSuggestionPrompt(
  availableProducts: Product[],
  request: SeasonalBoxRequest
): string {
  let prompt = `Create creative themed box suggestions for Bunny At Home using these available products:\n\n`;

  // List available products
  availableProducts.forEach((product) => {
    prompt += `- ${product.name} (${product.category}): R${(product.price / 100).toFixed(2)}`;
    if (product.dietaryTags && product.dietaryTags.length > 0) {
      prompt += ` [${product.dietaryTags.join(", ")}]`;
    }
    prompt += `\n`;
  });

  prompt += `\n\nRequirements:\n`;

  if (request.season) {
    prompt += `- Season: ${request.season}\n`;
  }

  if (request.month) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    prompt += `- Month: ${monthNames[request.month - 1]}\n`;
  }

  if (request.occasion) {
    prompt += `- Occasion: ${request.occasion}\n`;
  }

  if (request.theme) {
    prompt += `- Theme: ${request.theme}\n`;
  }

  if (request.pricePoint) {
    const minPrice = request.pricePoint * 0.9;
    const maxPrice = request.pricePoint * 1.1;
    prompt += `- Target Price: R${(minPrice / 100).toFixed(2)} - R${(maxPrice / 100).toFixed(2)}\n`;
  }

  if (request.dietaryPreferences && request.dietaryPreferences.length > 0) {
    prompt += `- Dietary Preferences: ${request.dietaryPreferences.join(", ")}\n`;
  }

  if (request.serves) {
    prompt += `- Should serve: ${request.serves} people\n`;
  }

  prompt += `\nGenerate 2-3 creative box suggestions. Each box should:
1. Have a catchy, occasion-appropriate name
2. Include a balanced selection of products (curry + sides/extras)
3. Tell a story or create an experience
4. Be priced appropriately for the occasion
5. Consider South African cultural context

For themed boxes (like Valentine's, Halloween, Heritage Month):
- The NAME and MARKETING should reflect the theme
- The IMAGE PROMPT should blend South African Durban curry aesthetic with the occasion's visual elements
- Example: "Valentine's Love Birds" with romantic styling, or "Halloween Spice Night" with spooky vibes

Return JSON in this format:
{
  "suggestions": [
    {
      "name": "Box name (creative and theme-appropriate)",
      "description": "1-2 sentence description of what's included",
      "marketingCopy": "Compelling marketing copy (2-3 sentences) that sells the experience",
      "theme": "valentine/halloween/heritage-month/etc",
      "season": "summer/winter/spring/autumn (if applicable)",
      "occasion": "fathers-day/mothers-day/etc (if applicable)",
      "products": [
        {
          "productId": "exact product ID from the list above",
          "quantity": 1
        }
      ],
      "totalPrice": calculated total in cents,
      "suggestedDiscountPrice": optional discounted price in cents,
      "imagePrompt": "Detailed DALL-E prompt blending SA curry styling with theme (see examples in system prompt)",
      "launchDateSuggestion": "YYYY-MM-DD format",
      "reasoning": "Why this combination works for the occasion/season"
    }
  ]
}`;

  return prompt;
}

/**
 * Get seasonal suggestions based on current month
 */
export async function getSeasonalSuggestions(
  availableProducts: Product[],
  month?: number
): Promise<SeasonalBoxSuggestion[]> {
  const currentMonth = month || new Date().getMonth() + 1;
  const season = getSeasonForMonth(currentMonth);
  const occasions = getOccasionsForMonth(currentMonth);

  const suggestions: SeasonalBoxSuggestion[] = [];

  // Generate seasonal box
  const seasonalBoxes = await generateBoxSuggestions(availableProducts, {
    season,
    month: currentMonth,
  });
  suggestions.push(...seasonalBoxes);

  // Generate occasion-specific boxes
  for (const occasion of occasions) {
    const occasionBoxes = await generateBoxSuggestions(availableProducts, {
      occasion: occasion.key,
      month: currentMonth,
      theme: occasion.theme,
    });
    suggestions.push(...occasionBoxes);
  }

  return suggestions;
}

/**
 * Determine season based on month (Southern Hemisphere)
 */
function getSeasonForMonth(month: number): string {
  if (month >= 12 || month <= 2) return "summer";
  if (month >= 3 && month <= 5) return "autumn";
  if (month >= 6 && month <= 8) return "winter";
  return "spring";
}

/**
 * Get relevant occasions for a given month
 */
function getOccasionsForMonth(month: number): Array<{ key: string; theme: string; name: string }> {
  const occasions: Record<number, Array<{ key: string; theme: string; name: string }>> = {
    1: [{ key: "new-year", theme: "new-year", name: "New Year" }],
    2: [{ key: "valentines", theme: "valentines", name: "Valentine's Day" }],
    3: [{ key: "heritage", theme: "heritage-month", name: "Heritage Celebration" }],
    4: [{ key: "easter", theme: "easter", name: "Easter" }],
    5: [{ key: "mothers-day", theme: "mothers-day", name: "Mother's Day" }],
    6: [
      { key: "fathers-day", theme: "fathers-day", name: "Father's Day" },
      { key: "youth-day", theme: "heritage-month", name: "Youth Day" },
    ],
    7: [{ key: "mandela-day", theme: "heritage-month", name: "Mandela Day" }],
    8: [{ key: "womens-day", theme: "heritage-month", name: "Women's Day" }],
    9: [
      { key: "heritage-day", theme: "heritage-month", name: "Heritage Day" },
      { key: "spring-day", theme: "spring", name: "Spring Day" },
    ],
    10: [{ key: "halloween", theme: "halloween", name: "Halloween" }],
    11: [{ key: "rugby-final", theme: "rugby-season", name: "Rugby Season" }],
    12: [{ key: "christmas", theme: "christmas", name: "Festive Season" }],
  };

  return occasions[month] || [];
}

/**
 * Analyze box performance and suggest improvements
 */
export async function analyzeBoxPerformance(
  boxName: string,
  products: BoxProductItem[],
  performanceData: {
    views: number;
    addToCart: number;
    purchases: number;
    revenue: number;
  }
): Promise<{
  analysis: string;
  suggestions: string[];
  optimizedProducts?: BoxProductItem[];
}> {
  const conversionRate = performanceData.views > 0 
    ? (performanceData.purchases / performanceData.views) * 100 
    : 0;

  const cartConversion = performanceData.addToCart > 0
    ? (performanceData.purchases / performanceData.addToCart) * 100
    : 0;

  const prompt = `Analyze this box performance and suggest improvements:

Box Name: ${boxName}
Products: ${JSON.stringify(products)}

Performance Metrics:
- Views: ${performanceData.views}
- Add to Cart: ${performanceData.addToCart}
- Purchases: ${performanceData.purchases}
- Revenue: R${(performanceData.revenue / 100).toFixed(2)}
- View-to-Purchase: ${conversionRate.toFixed(2)}%
- Cart-to-Purchase: ${cartConversion.toFixed(2)}%

Provide analysis and actionable suggestions in JSON format:
{
  "analysis": "Overall performance analysis (2-3 sentences)",
  "suggestions": [
    "Specific actionable suggestions to improve performance"
  ],
  "shouldOptimizeProducts": true/false,
  "optimizedProducts": [optional: suggest product changes if shouldOptimizeProducts is true]
}`;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: "You are a data analyst specializing in e-commerce and food delivery optimization.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(response);
}

/**
 * Generate marketing copy for a box
 */
export async function generateBoxMarketingCopy(
  boxName: string,
  products: Product[],
  theme?: string,
  occasion?: string
): Promise<{
  shortDescription: string;
  longDescription: string;
  socialMediaPost: string;
  emailSubject: string;
  emailPreview: string;
}> {
  const prompt = `Generate compelling marketing copy for this Durban curry box:

Box Name: ${boxName}
Products: ${products.map(p => `${p.name} (${p.description})`).join(", ")}
${theme ? `Theme: ${theme}` : ""}
${occasion ? `Occasion: ${occasion}` : ""}

Generate marketing copy in JSON format:
{
  "shortDescription": "One punchy sentence (under 100 chars)",
  "longDescription": "2-3 engaging paragraphs for the product page",
  "socialMediaPost": "Instagram/Facebook post copy with emojis (under 200 chars)",
  "emailSubject": "Compelling email subject line (under 50 chars)",
  "emailPreview": "Email preview text (under 100 chars)"
}

Use South African voice, be warm and appetizing, create FOMO!`;

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
    temperature: 0.8,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(response);
}

/**
 * Validate box suggestion meets business rules
 */
export function validateBoxSuggestion(
  suggestion: SeasonalBoxSuggestion,
  availableProducts: Product[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check all products exist and are available
  for (const item of suggestion.products) {
    const product = availableProducts.find(p => p.id === item.productId);
    if (!product) {
      errors.push(`Product ${item.productId} not found`);
    } else if (!product.isActive) {
      errors.push(`Product ${product.name} is not active`);
    } else if (product.stockLevel < item.quantity) {
      errors.push(`Insufficient stock for ${product.name}`);
    }
  }

  // Check box has at least one main curry
  const hasCurry = suggestion.products.some(item => {
    const product = availableProducts.find(p => p.id === item.productId);
    return product?.category === "bunnyFillings" || product?.category === "familyCurries";
  });

  if (!hasCurry) {
    errors.push("Box must include at least one curry product");
  }

  // Check price is reasonable
  if (suggestion.totalPrice < 1000) {
    errors.push("Box price too low (minimum R10)");
  }

  if (suggestion.totalPrice > 50000) {
    errors.push("Box price too high (maximum R500)");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

