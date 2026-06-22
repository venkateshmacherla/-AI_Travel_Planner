import { GoogleGenerativeAI } from "@google/generative-ai";

const getGeminiClient = () => {
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
};

console.log("Gemini Key Available:", Boolean(process.env.GEMINI_API_KEY));

export const generateItinerary = async (
  destination: string,
  durationDays: number,
  budgetTier: string,
  interests: string[],
) => {
  const geminiClient = getGeminiClient();
  const model = geminiClient.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
        You are an expert travel planner.

        Create a detailed travel plan in JSON format.

        Destination: ${destination}
        Duration: ${durationDays} days
        Budget: ${budgetTier}
        Interests: ${interests.join(", ")}

        Return ONLY valid JSON.

        Structure:

        {
        "tripSummary": "",
        "itinerary": [
            {
            "day": 1,
            "title": "",
            "activities": []
            }
        ],
        "budgetEstimate": {
            "flights": "",
            "accommodation": "",
            "food": "",
            "activities": "",
            "total": ""
        },
        "hotelSuggestions": [
            {
            "name": "",
            "type": "",
            "description": ""
            }
        ],
        "travelTips": []
        }

        Rules:
        - Generate day-wise itinerary
        - Estimate realistic costs
        - Suggest 3 hotels:
        1 Budget
        1 Mid-range
        1 Luxury
        - Include 5 to 8 travel tips
        - Travel tips must be short
        - Do not use markdown symbols like ** or #
        - Return plain text only
        - Each tip should be one sentence
        - Return JSON only
    `;

  const result = await model.generateContent(prompt);

  const response = result.response.text();

  const cleanedResponse = response
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("JSON Parse Error:", error);

    return { rawResponse: cleanedResponse };
  }
};

export const regenerateDayPlan = async (
  destination: string,
  budgetTier: string,
  interests: string[],
  day: number,
) => {
  try {
    console.log("=== REGENERATE DAY START ===");

    const geminiClient = getGeminiClient();

    const model = geminiClient.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
            You are an expert travel planner.

            Destination: ${destination}
            Budget: ${budgetTier}
            Interests: ${interests.join(", ")}

            Generate a completely NEW itinerary for Day ${day}.

            Return ONLY valid JSON.

            {
            "title": "Day Title",
            "activities": [
                "Activity 1",
                "Activity 2",
                "Activity 3"
            ]
            }

            IMPORTANT:
            - Return JSON only.
            - Do not add explanations.
            - Do not add markdown.
            - Do not add text before JSON.
            - Activities must be strings.
        `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    console.log("RAW GEMINI RESPONSE:");
    console.log(response);

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedResponse);
  } catch (error) {
    console.error("REGENERATE DAY SERVICE ERROR:", error);

    throw error;
  }
};
