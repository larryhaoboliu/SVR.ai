const express = require('express');
const multer = require('multer');
const router = express.Router();

// Set up Multer for handling file uploads (stored in memory)
const upload = multer({ storage: multer.memoryStorage() });

// OpenAI API configuration (ensure your .env has the OPENAI_API_KEY)
const OpenAIApi = require('openai');
const openai = new OpenAIApi({ key: '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'});

// Route to generate description based on uploaded photos
router.post('/generate-description', upload.array('photos', 10), async (req, res) => {
  const photos = req.files; // Get uploaded photos from the request

  if (!photos || photos.length === 0) {
    return res.status(400).json({ error: 'No photos uploaded' });
  }

  // Simulate generating a prompt using the uploaded photos.
  const prompt = `Generate a site visit report description based on the following photos: ${photos.map((photo, index) => `photo ${index + 1}`).join(', ')}.`;

  try {
    // Make the call to OpenAI's GPT-4 to generate the description
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 300,
    });

    // Extract the generated description
    const description = response.data.choices[0].text.trim();
    res.json({ description }); // Return the generated description
  } catch (error) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: 'Error generating description' });
  }
});

module.exports = router;
