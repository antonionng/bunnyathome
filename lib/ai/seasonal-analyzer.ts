import openai, { AI_MODELS } from "./openai-client";
import type { Product, ReadyBox, BoxPerformance } from "@/types/product";

export interface SeasonalInsights {
  currentSeason: string;
  upcomingOccasions: OccasionInsight[];
  recommendedThemes: string[];
  suggestedLaunchDates: Date[];
  historicalPerformance?: SeasonalPerformanceData;
}

export interface OccasionInsight {
  name: string;
  date: Date;
  theme: string;
  culturalSignificance: string;
  suggestedBoxTypes: string[];
  marketingTips: string[];
}

export interface SeasonalPerformanceData {
  season: string;
  averageRevenue: number;
  bestPerformingThemes: string[];
  customerPreferences: string[];
}

/**
 * Analyze current season and suggest box drops
 */
export async function analyzeSeasonalOpportunities(
  currentMonth: number,
  currentYear: number,
  availableProducts: Product[],
  historicalBoxes?: ReadyBox[],
  performanceData?: BoxPerformance[]
): Promise<SeasonalInsights> {
  const prompt = buildSeasonalAnalysisPrompt(
    currentMonth,
    currentYear,
    availableProducts,
    historicalBoxes,
    performanceData
  );

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: `You are a seasonal marketing strategist for a South African food delivery business specializing in Durban curry. 
        You understand South African culture, holidays, seasons (Southern Hemisphere), and food trends.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(response);

  // Convert date strings to Date objects
  const insights: SeasonalInsights = {
    currentSeason: parsed.currentSeason,
    upcomingOccasions: parsed.upcomingOccasions.map((occ: any) => ({
      ...occ,
      date: new Date(occ.date),
    })),
    recommendedThemes: parsed.recommendedThemes,
    suggestedLaunchDates: parsed.suggestedLaunchDates.map((d: string) => new Date(d)),
    historicalPerformance: parsed.historicalPerformance,
  };

  return insights;
}

/**
 * Build prompt for seasonal analysis
 */
function buildSeasonalAnalysisPrompt(
  currentMonth: number,
  currentYear: number,
  availableProducts: Product[],
  historicalBoxes?: ReadyBox[],
  performanceData?: BoxPerformance[]
): string {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];

  let prompt = `Analyze seasonal opportunities for Bunny At Home (South African Durban curry delivery).

Current Date: ${monthNames[currentMonth - 1]} ${currentYear}
Current Season: ${getSeasonForMonth(currentMonth)} (Southern Hemisphere)

Available Products (${availableProducts.length}):
${availableProducts.slice(0, 10).map(p => `- ${p.name} (${p.category})`).join("\n")}
${availableProducts.length > 10 ? `... and ${availableProducts.length - 10} more` : ""}
`;

  if (historicalBoxes && historicalBoxes.length > 0) {
    prompt += `\n\nPrevious Themed Boxes:
${historicalBoxes.slice(0, 5).map(box => `- ${box.name} (${box.theme}, launched ${box.launchDate})`).join("\n")}`;
  }

  if (performanceData && performanceData.length > 0) {
    const totalRevenue = performanceData.reduce((sum, p) => sum + p.revenue, 0);
    const totalPurchases = performanceData.reduce((sum, p) => sum + p.purchases, 0);
    prompt += `\n\nHistorical Performance:
- Total Revenue: R${(totalRevenue / 100).toFixed(2)}
- Total Purchases: ${totalPurchases}`;
  }

  prompt += `\n\nProvide strategic seasonal insights in JSON format:
{
  "currentSeason": "summer/winter/spring/autumn",
  "upcomingOccasions": [
    {
      "name": "Occasion name",
      "date": "YYYY-MM-DD",
      "theme": "Theme keyword",
      "culturalSignificance": "Why this matters in SA",
      "suggestedBoxTypes": ["Type of box that would work"],
      "marketingTips": ["How to market this effectively"]
    }
  ],
  "recommendedThemes": ["Top 3-5 themes for the next 2-3 months"],
  "suggestedLaunchDates": ["YYYY-MM-DD dates optimal for launches"],
  "historicalPerformance": {
    "season": "Current or similar season",
    "averageRevenue": estimated average,
    "bestPerformingThemes": ["Themes that historically worked"],
    "customerPreferences": ["What customers typically want this season"]
  }
}

Consider:
1. South African public holidays and cultural events
2. Southern Hemisphere seasons (opposite to Northern)
3. Rugby season, school holidays, festive periods
4. Weather patterns (braai season, comfort food season)
5. Heritage Day, Youth Day, Women's Day, etc.
6. International occasions adapted for SA (Valentine's, Halloween, Christmas)`;

  return prompt;
}

/**
 * Get season for month (Southern Hemisphere)
 */
function getSeasonForMonth(month: number): string {
  if (month >= 12 || month <= 2) return "summer";
  if (month >= 3 && month <= 5) return "autumn";
  if (month >= 6 && month <= 8) return "winter";
  return "spring";
}

/**
 * Generate content calendar for box drops
 */
export async function generateContentCalendar(
  startMonth: number,
  endMonth: number,
  year: number,
  availableProducts: Product[]
): Promise<ContentCalendarItem[]> {
  const prompt = `Generate a content calendar for themed box drops from ${getMonthName(startMonth)} to ${getMonthName(endMonth)} ${year}.

Available Products: ${availableProducts.length} Durban curry products

Create a strategic calendar with 1-2 box launches per month, considering:
- South African seasons and culture
- Public holidays and occasions
- Customer buying patterns
- Optimal launch timing (usually 2-3 weeks before occasion)

Return JSON array:
[
  {
    "month": number (1-12),
    "launchDate": "YYYY-MM-DD",
    "boxTheme": "Theme name",
    "occasionTarget": "Target occasion/event",
    "marketingStartDate": "YYYY-MM-DD",
    "rationale": "Why this timing and theme works"
  }
]`;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: "You are a marketing calendar strategist for South African food delivery.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.6,
    max_tokens: 1200,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  const parsed = JSON.parse(response);
  return parsed.calendar || [];
}

export interface ContentCalendarItem {
  month: number;
  launchDate: Date;
  boxTheme: string;
  occasionTarget: string;
  marketingStartDate: Date;
  rationale: string;
}

/**
 * Analyze competitor seasonal offerings (if data available)
 */
export async function analyzeCompetitorTrends(
  competitorData: string[]
): Promise<{
  trends: string[];
  opportunities: string[];
  differentiators: string[];
}> {
  const prompt = `Analyze these competitor seasonal offerings in the South African food delivery space:

${competitorData.join("\n")}

Identify:
1. Current trends in seasonal/themed boxes
2. Gaps/opportunities we can exploit
3. How we can differentiate with our Durban curry focus

Return JSON:
{
  "trends": ["Top trends in the market"],
  "opportunities": ["Gaps we can fill"],
  "differentiators": ["How to stand out with Durban curry"]
}`;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 600,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(response);
}

/**
 * Suggest optimal pricing for seasonal boxes
 */
export async function suggestSeasonalPricing(
  occasion: string,
  products: Product[],
  targetMargin: number = 0.3
): Promise<{
  suggestedPrice: number;
  discountPrice?: number;
  bundleSavings: number;
  reasoning: string;
}> {
  const costPrice = products.reduce((sum, p) => sum + p.price, 0);
  const basePrice = Math.ceil(costPrice / (1 - targetMargin));

  const prompt = `Suggest optimal pricing for a ${occasion} themed Durban curry box.

Products Cost: R${(costPrice / 100).toFixed(2)}
Calculated Base Price: R${(basePrice / 100).toFixed(2)}
Target Margin: ${(targetMargin * 100).toFixed(0)}%

Consider:
- Occasion price sensitivity (premium vs value)
- Bundle discount expectations
- Competitor pricing in SA
- Psychological pricing (R99 vs R100)

Return JSON:
{
  "suggestedPrice": price in cents,
  "discountPrice": optional promotional price in cents,
  "bundleSavings": amount customer saves vs buying separately,
  "reasoning": "Why this pricing strategy works"
}`;

  const completion = await openai.chat.completions.create({
    model: AI_MODELS.GPT4,
    messages: [
      {
        role: "system",
        content: "You are a pricing strategist with expertise in South African food delivery and e-commerce.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.5,
    max_tokens: 400,
    response_format: { type: "json_object" },
  });

  const response = completion.choices[0]?.message?.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  return JSON.parse(response);
}

/**
 * Helper function to get month name
 */
function getMonthName(month: number): string {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[month - 1] || "Unknown";
}

/**
 * Get South African public holidays for a year
 */
export function getSouthAfricanHolidays(year: number): Array<{ name: string; date: Date; theme: string }> {
  return [
    { name: "New Year's Day", date: new Date(year, 0, 1), theme: "new-year" },
    { name: "Human Rights Day", date: new Date(year, 2, 21), theme: "heritage-month" },
    { name: "Good Friday", date: getEasterDate(year, -2), theme: "easter" },
    { name: "Family Day", date: getEasterDate(year, 1), theme: "easter" },
    { name: "Freedom Day", date: new Date(year, 3, 27), theme: "heritage-month" },
    { name: "Workers' Day", date: new Date(year, 4, 1), theme: "workers" },
    { name: "Youth Day", date: new Date(year, 5, 16), theme: "heritage-month" },
    { name: "Women's Day", date: new Date(year, 7, 9), theme: "heritage-month" },
    { name: "Heritage Day", date: new Date(year, 8, 24), theme: "heritage-month" },
    { name: "Day of Reconciliation", date: new Date(year, 11, 16), theme: "heritage-month" },
    { name: "Christmas Day", date: new Date(year, 11, 25), theme: "christmas" },
    { name: "Day of Goodwill", date: new Date(year, 11, 26), theme: "christmas" },
  ];
}

/**
 * Calculate Easter date (for movable holidays)
 */
function getEasterDate(year: number, offset: number = 0): Date {
  // Simplified Easter calculation (Computus)
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  const easterDate = new Date(year, month - 1, day);
  easterDate.setDate(easterDate.getDate() + offset);
  return easterDate;
}

