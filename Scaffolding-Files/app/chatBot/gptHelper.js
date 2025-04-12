// Get the functions in the db.js file to use
const db = require('../services/db');

// services/gptHelper.js
require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getAllCategories() {
  const rows = await db.query('SELECT Category_Name FROM Category');
  return rows.map(r => r.Category_Name);
}

// 2) Build the comprehensive system prompt (shown above)
function buildSystemPrompt(categoriesList, aboutCompany, termsAndConditions) {
  return `
You are the official FitXchange Assistant. Respond politely and helpfully, **only** within the context of FitXchange.

**Platform Info**:
${aboutCompany}

**Terms & Conditions**:
${termsAndConditions}

**Categories in Database**:
[${categoriesList}]

### Your Instructions

1. If the user says a phrase such as "What should I wear for my wedding?" or "I need outfit advice for a party", you must provide tailored outfit advice for that occasion. 
   - For example, you might say "For a wedding, a formal tailored suit or an elegant dress would be appropriate. Consider accessorizing with a statement tie or elegant jewelry."  


2. If the user is **just greeting** or making small talk:
   - Respond politely and kindly, referencing FitXchange only if relevant.

3. If the user **asks about site privacy, policies, T&C, user stories** or other FitXchange details:
   - Reference the relevant Terms & Conditions at http://localhost:3000/terms-and-conditions or the platform overview where appropriate.
   - Keep it concise and on-topic.

4. If the user wants an outfit or says "I need an outfit for X," "Do you have X outfit?," or anything implying they want to search the inventory:
   - Extract relevant categories from the user's request.
   - **Return only a valid JSON array** of categories or tags, e.g. ["business","formal","interview"].

5. If you are **unsure** how to respond in the context of FitXchange or the user asks about something unrelated:
   - Politely respond: "Sorry, I don't know."

### Output Formatting
- **Always** respond in a manner consistent with the instructions above. 
- When searching for outfits, respond with ONLY a JSON array of relevant categories. 
- When giving answers to T&C or FAQs, keep the info relevant and short. 
- Do not provide any external references or info outside FitXchange.

Now, the user says:
  `;
}

/**
 * getRelevantKeywords(prompt)
 * Sends the user’s prompt to GPT and asks it to return an array of relevant keywords/tags in JSON format.
 */
async function getRelevantKeywords(prompt) {
  try {
    // 1) Fetch categories
    const categories = await getAllCategories();
    const categoriesList = categories.join(', ');

    // 2) Build system prompt including categories
    const systemPrompt = `
      You are an assistant extracting relevant categories or tags from user queries about outfits.
      These are the current categories in the database: [${categoriesList}].
      Please choose from these or any closely related synonyms.
      Return only a valid JSON array of possible relevant tags. 
      Example: ["business", "formal", "interview"].
      `;

    // 3) Send to OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // or 'gpt-4'
      messages,
      temperature: 0,
    });

    // Attempt to parse the content as JSON
    const rawText = response.data.choices[0].message.content.trim();
    let tags = [];
    try {
      tags = JSON.parse(rawText);
    } catch (err) {
      console.error('Could not parse GPT response as JSON:', rawText);
      // fallback: if GPT didn’t return JSON, store entire text in an array
      tags = [rawText];
    }

    return tags;
  } catch (error) {
    console.error('Error getting keywords from GPT:', error);
    return [];
  }
}

/**
 * getSQLStatementsFromKeywords(keywords)
 * Builds a list of SQL SELECT statements to query Inventory and Category
 * tables for items that match the relevant keywords.
 */
function getSQLStatementsFromKeywords(keywords) {
  // For each keyword, we do a simple LIKE match on Category_Name 
  // (since Category_Name might be "business", "interview", etc.)
  return keywords.map((keyword) => {
    return `SELECT i.Inventory_ID FROM Inventory AS i JOIN Outfit_and_Categories AS oc ON i.Inventory_ID = oc.Inventory_ID JOIN Category AS c ON oc.Category_ID = c.Category_ID WHERE c.Category_Name LIKE '%${keyword}%';`;
  });
}

async function processUserMessage(userMessage, aboutCompany, termsAndConditions) {
  try {
    // 1) Get categories and build a comma-separated list
    const categories = await getAllCategories();
    const categoriesList = categories.join(', ');

    // 2) Build the system prompt
    const systemPrompt = buildSystemPrompt(categoriesList, aboutCompany, termsAndConditions);

    // 3) Create the conversation messages
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: userMessage
      }
    ];

    // 4) Call the OpenAI API
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // or 'gpt-4' if you have access
      messages,
      temperature: 0
    });

    // 5) Extract the text from GPT's response
    const rawText = response.data.choices[0].message.content.trim();

    // 6) Return that text. (Could be a JSON array or just normal text.)
    return rawText;

  } catch (error) {
    console.error('Error in processUserMessage:', error);
    return 'Sorry, there was an error.';
  }
}


module.exports = {
  getRelevantKeywords,
  getSQLStatementsFromKeywords,
  processUserMessage
};
