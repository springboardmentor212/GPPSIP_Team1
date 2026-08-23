require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const DocumentChunk = require('./documentChunk.model');

async function getGeminiEmbedding(text, apiKey) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text }] }
        })
    });
    const data = await response.json();
    return data.embedding?.values || null;
}

async function seed() {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
        console.error("No GEMINI_API_KEY found, cannot seed embeddings.");
        process.exit(1);
    }

    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/policygpt';
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const chunks = await DocumentChunk.find({ embedding: { $exists: false } });
    console.log(`Found ${chunks.length} chunks without embeddings.`);

    for (let chunk of chunks) {
        console.log(`Generating embedding for chunk ${chunk._id}...`);
        const values = await getGeminiEmbedding(chunk.text, geminiApiKey);
        if (values) {
            chunk.embedding = values;
            await chunk.save();
            console.log(`Saved embedding for chunk ${chunk._id}.`);
        } else {
            console.error(`Failed to generate embedding for chunk ${chunk._id}`);
        }
        // Rate limiting precaution
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log("Seeding complete.");
    process.exit(0);
}

seed();
