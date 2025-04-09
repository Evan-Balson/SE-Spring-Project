// chatBot/chatBot.js
const { NlpManager } = require('node-nlp');

class chatBot {
  constructor(manager) {
    this.manager = manager;
  }

  async trainModel() {
    // Add example documents for searching outfits
    this.manager.addDocument('en', 'I need an outfit for an interview', 'search.outfit');
    this.manager.addDocument('en', 'Looking for something to wear to a wedding', 'search.outfit');
    this.manager.addDocument('en', 'Do you have business attire?', 'search.outfit');

    // Add some greetings, small talk, etc.
    this.manager.addDocument('en', 'hello', 'greetings.hello');
    this.manager.addDocument('en', 'hi', 'greetings.hello');
    this.manager.addDocument('en', 'how are you', 'greetings.howareyou');

    // Answers
    this.manager.addAnswer('en', 'search.outfit', 'Sure! Let me see what we have...');
    this.manager.addAnswer('en', 'greetings.hello', 'Hello! How can I help you?');
    this.manager.addAnswer('en', 'greetings.howareyou', 'I am good, thank you!');

    // Train
    await this.manager.train();
    this.manager.save();
    console.log('NLP model trained and saved.');
  }
}

module.exports = chatBot;
