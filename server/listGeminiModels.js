require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');

async function listGeminiModels() {
    if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is missing from the environment.');
        process.exitCode = 1;
        return;
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const models = await ai.models.list();

        for await (const model of models) {
            if (model.name) {
                console.log(model.name);
            }
        }
    } catch (error) {
        console.error('Failed to list Gemini models:', error instanceof Error ? error.message : error);
        process.exitCode = 1;
    }
}

listGeminiModels();
