const functions = require("firebase-functions");
const fetch = require("node-fetch");
exports.chatWithAI = functions.https.onRequest(async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).send({ error: "No question provided" });
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer sk-proj-xxx...",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: question }]
            })
        });
        const data = await response.json();
        res.send({ answer: data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "OpenAI request failed" });
    }
});