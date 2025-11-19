import openai, { IMAGE_STYLE_GUIDE, AI_MODELS } from "./openai-client";
import type { AIImageRequest, AIImageResponse } from "@/types/product";

/**
 * Generate product image using DALL-E 3
 */
export async function generateProductImage(
  request: AIImageRequest
): Promise<AIImageResponse> {
  const prompt = buildImagePrompt(request);

  const response = await openai.images.generate({
    model: AI_MODELS.DALLE3,
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "standard",
    style: "natural",
  });

  const imageData = response.data[0];
  if (!imageData?.url) {
    throw new Error("No image URL returned from DALL-E");
  }

  return {
    imageUrl: imageData.url,
    prompt,
    revisedPrompt: imageData.revised_prompt,
    metadata: {
      model: AI_MODELS.DALLE3,
      size: "1024x1024",
      quality: "standard",
    },
  };
}

/**
 * Generate themed box image (e.g., Valentine's with SA styling, Halloween with SA styling)
 */
export async function generateThemedBoxImage(
  boxName: string,
  theme: string,
  products: string[],
  occasion?: string
): Promise<AIImageResponse> {
  const prompt = buildThemedBoxPrompt(boxName, theme, products, occasion);

  const response = await openai.images.generate({
    model: AI_MODELS.DALLE3,
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "hd", // Use HD for marketing images
    style: "natural",
  });

  const imageData = response.data[0];
  if (!imageData?.url) {
    throw new Error("No image URL returned from DALL-E");
  }

  return {
    imageUrl: imageData.url,
    prompt,
    revisedPrompt: imageData.revised_prompt,
    metadata: {
      model: AI_MODELS.DALLE3,
      size: "1024x1024",
      quality: "hd",
      theme,
      occasion,
    },
  };
}

/**
 * Build DALL-E prompt for product images
 */
function buildImagePrompt(request: AIImageRequest): string {
  let prompt = IMAGE_STYLE_GUIDE + "\n\n";

  // Base description
  prompt += `Create a professional food photography image of: ${request.productName}.\n`;
  prompt += `Category: ${request.category}\n`;
  
  if (request.description) {
    prompt += `Description: ${request.description}\n`;
  }

  // Category-specific styling
  switch (request.category) {
    case "bunnyFillings":
      prompt += "Show the curry filling in an authentic South African bunny chow loaf presentation. ";
      prompt += "Include the hollowed-out bread loaf filled with rich Durban curry. ";
      prompt += "Warm lighting, steam rising, garnished with fresh herbs. ";
      break;
    
    case "familyCurries":
      prompt += "Show the curry in a traditional serving bowl or pot. ";
      prompt += "Rich, hearty Durban curry with visible meat/vegetables. ";
      prompt += "Warm, inviting presentation suitable for family dining. ";
      break;
    
    case "sides":
      prompt += "Clean, appetizing presentation of the side dish. ";
      prompt += "Show texture and freshness. Complement Durban curry aesthetic. ";
      break;
    
    case "sauces":
      prompt += "Showcase the product in an appetizing way. ";
      prompt += "Show how it pairs with Durban curry cuisine. ";
      break;
    
    case "drinks":
      prompt += "Show the beverage in a clear glass or bottle. ";
      prompt += "Refreshing presentation that complements spicy curry. ";
      break;
  }

  prompt += "\nStyle: Professional food photography, natural lighting, warm tones, ";
  prompt += "South African aesthetic, appetizing, high quality, clean composition.";

  if (request.style) {
    prompt += `\nAdditional style notes: ${request.style}`;
  }

  return prompt;
}

/**
 * Build DALL-E prompt for themed box images
 */
function buildThemedBoxPrompt(
  boxName: string,
  theme: string,
  products: string[],
  occasion?: string
): string {
  let prompt = IMAGE_STYLE_GUIDE + "\n\n";

  prompt += `Create a stunning marketing image for "${boxName}", a themed South African Durban curry box.\n`;
  prompt += `Theme: ${theme}\n`;
  
  if (occasion) {
    prompt += `Occasion: ${occasion}\n`;
  }

  prompt += `Products included: ${products.join(", ")}\n\n`;

  // Theme-specific styling
  const themePrompts: Record<string, string> = {
    valentines: "Blend authentic South African Durban curry presentation with romantic Valentine's elements. Include warm pink/red lighting, rose petals around the curry dishes, heart shapes in the background. Keep the food authentic while creating a romantic ambiance. Elegant table setting with candles.",
    
    halloween: "Combine authentic Durban curry styling with spooky Halloween atmosphere. Dark, mysterious background with warm orange accents. Subtle pumpkins or autumn leaves. The curry should look inviting despite the eerie ambiance. Dramatic lighting creating shadows.",
    
    "heritage-month": "Showcase South African heritage proudly. Include South African flag colors subtly in the background. Traditional Durban street food aesthetic. Celebrate Grey Street curry culture. Vibrant, proud presentation.",
    
    "fathers-day": "Hearty, masculine presentation perfect for Dad. Generous portions, braai-style setting. Beer or whiskey glass nearby. Rustic, substantial presentation. Man-cave or outdoor braai aesthetic.",
    
    "mothers-day": "Elegant, sophisticated presentation perfect for Mom. Beautiful plating, flowers in the background, soft lighting. Pampered, special occasion feel. Fine dining meets Durban curry culture.",
    
    christmas: "Festive holiday presentation with South African summer Christmas vibes. Bright, cheerful, outdoor setting. Christmas decorations with a sunny, warm South African twist. Beach or garden setting possible.",
    
    easter: "Spring-fresh presentation with pastel touches. Colorful, vibrant, fresh ingredients visible. Easter eggs subtly incorporated. Light, bright, hopeful aesthetic.",
    
    "rugby-season": "Bold, energetic presentation for game day. South African rugby colors (green and gold). Stadium/viewing party vibe. Hearty portions, perfect for sharing. Energetic, celebratory.",
    
    summer: "Bright, sunny South African summer vibes. Outdoor braai setting. Fresh, vibrant colors. Cool drinks nearby. Beach or garden aesthetic.",
    
    winter: "Cozy, warming comfort food presentation. Indoor setting, warm lighting. Steam rising from hot curry. Comfort and warmth emphasized. Perfect for cold nights.",
    
    spring: "Fresh, colorful, vibrant spring presentation. New beginnings, fresh ingredients. Bright natural lighting. Garden setting with flowers.",
    
    autumn: "Rich, warm autumn colors. Harvest vibes. Golden lighting. Earthy, grounded presentation. Comfort food for cooler weather.",
  };

  const themeStyle = themePrompts[theme.toLowerCase()] || 
    `Incorporate ${theme} elements while maintaining authentic South African Durban curry presentation. `;

  prompt += themeStyle + "\n\n";

  prompt += "The curry boxes and dishes should look authentic and delicious. ";
  prompt += "Professional food photography quality. Clean composition. ";
  prompt += "Perfect for marketing and social media. ";
  prompt += "Make viewers hungry and excited about this themed box!";

  return prompt;
}

/**
 * Download image from URL and prepare for Supabase storage
 * Returns the image as a buffer
 */
export async function downloadImageFromUrl(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Generate multiple image variations for A/B testing
 */
export async function generateImageVariations(
  request: AIImageRequest,
  count: number = 2
): Promise<AIImageResponse[]> {
  const variations: AIImageResponse[] = [];
  
  for (let i = 0; i < count; i++) {
    // Add variation to the prompt
    const variedRequest = {
      ...request,
      style: `${request.style || ""} Variation ${i + 1}: ${getStyleVariation(i)}`,
    };
    
    const image = await generateProductImage(variedRequest);
    variations.push(image);
  }
  
  return variations;
}

/**
 * Get style variation for different image versions
 */
function getStyleVariation(index: number): string {
  const variations = [
    "top-down flat lay perspective",
    "45-degree angle with depth",
    "close-up with shallow depth of field",
    "wide shot showing full presentation",
  ];
  
  return variations[index % variations.length];
}

/**
 * Validate image generation request
 */
export function validateImageRequest(request: AIImageRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!request.productName || request.productName.trim().length === 0) {
    errors.push("Product name is required");
  }
  
  if (!request.category) {
    errors.push("Category is required");
  }
  
  if (!request.description || request.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

