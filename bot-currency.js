require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const quotes = ['бди!', 'быстрее, выше, сильнее', 'меня трудно найти, легко потерять, невозможно забыть!']
bot.on('message', (msg) => {
  // console.log(msg)
  const chatId = msg.chat.id;
  const [word1, word2] = msg.text.split(' ')
  console.log(word1)
  if (
    word1 === 'число'
  ) {
    const randomNumber = Math.floor(Math.random() * 10) + 1
    bot.sendMessage(chatId, `${randomNumber}`)
  }
  else if (
    word1 === 'цитата'
  ) {
    const randomNumber = Math.floor(Math.random() * quotes.length)
    bot.sendMessage(chatId, quotes[randomNumber])
  }
  else if (
    word1 === 'курс'
  ) {
    if (word2 === 'доллара') {
      bot.sendMessage(chatId, `курс доллара 60 рублей`);
    } else if (word2 === 'евро') {
      bot.sendMessage(chatId, `курс евро 70 рублей`);
    } else {
      bot.sendMessage(chatId, `я такой валюты не знаю`);
    }

  }
  else {
    setTimeout(() => {
      bot.sendMessage(chatId, `Вас понял ${msg.from.first_name}, вы сказали ${msg.text}`);
    }, 5000)
  }
});