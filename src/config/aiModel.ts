import {GoogleGenerativeAI} from '@google/generative-ai'
import config from './config';

export const getAIModelWithSystemPrompt = (systemPrompt?: string) => {
    const client = new GoogleGenerativeAI(config.geminiApiKey);
    const model = client.getGenerativeModel({
        model: "gemini-flash-lite-latest",
        systemInstruction: systemPrompt ? systemPrompt : "",
    })
    return model
}
        
export const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
}