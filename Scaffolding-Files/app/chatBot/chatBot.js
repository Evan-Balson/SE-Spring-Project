// chatBot/chatBot.js
const { NlpManager } = require('node-nlp');

class chatBot {
  constructor(manager) {
    this.manager = manager;
  }

  async trainModel() {
//  searching outfits
this.manager.addDocument('en', 'I need an outfit for an interview', 'search.outfit');
this.manager.addDocument('en', 'Looking for something to wear to a wedding', 'search.outfit');
this.manager.addDocument('en', 'Do you have business attire?', 'search.outfit');

// occasion advice
this.manager.addDocument('en', 'What should I wear for my wedding?', 'occasion.advice');
this.manager.addDocument('en', 'I need outfit advice for a party', 'occasion.advice');
this.manager.addDocument('en', 'Can you advise me on what to wear to an anniversary dinner?', 'occasion.advice');
this.manager.addDocument('en', 'Help me choose an outfit for a formal event', 'occasion.advice');

// some greetings and small talk
this.manager.addDocument('en', 'hello', 'greetings.hello');
this.manager.addDocument('en', 'hi', 'greetings.hello');
this.manager.addDocument('en', 'how are you', 'greetings.howareyou');

// Answers for search-related intent
this.manager.addAnswer('en', 'search.outfit', 'Sure! Let me see what we have...');
    
// Answers for occasion advice intent
this.manager.addAnswer('en', 'occasion.advice', 'For a special occasion, I recommend a stylish and polished look. For example, for a wedding, a tailored suit or an elegant dress with complementary accessories is a great choice. Would you like some suggestions?');

// Answers for greetings and small talk
this.manager.addAnswer('en', 'greetings.hello', 'Hello! How can I help you?');
this.manager.addAnswer('en', 'greetings.howareyou', 'I am good, thank you!');


    // Train
    await this.manager.train();
    this.manager.save();
    console.log('NLP model trained and saved.');
  }
}

module.exports = chatBot;
