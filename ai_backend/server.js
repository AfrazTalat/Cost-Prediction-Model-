const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000; // node backend port 

app.use(cors()); 
app.use(express.json()); 

// PERSON 1'S TERRITORY: THE AI PREDICTION ROUTE
// react will send a POST request to api to predict budget

app.post('/api/predict-budget', async (req, res) => {
    try {
        console.log("Received project data from React:", req.body);

        // fwd data to python on PORT 8000
        const aiResponse = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.body)
        });

        const finalResult = await aiResponse.json();
        console.log("Received prediction from Python:", finalResult);
        
        // final result to react 
        res.json(finalResult);

    } catch (error) {
        console.error("AI Communication Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI Model on Port 8000" });
    }
});


// ===================================================================
// PERSON 2'S TERRITORY: DATABASE ROUTES (They will add these later)
// ===================================================================
// app.get('/api/projects', ...)
// app.post('/api/add-contractor', ...)

app.listen(PORT, () => {
    console.log(`Node Backend is live and listening on http://localhost:${PORT}`);
});