require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const field = ['_', '_', '_', '_', '_', '_', '_', '_', '_']
const renderButtons = (field) => {
  const signs = { x: '⛌', o: '⭕', _: '⬜' }
  const buttons = []
  let index = 0
  for (let i = 0; i < 3; i++) {
    const row = []
    for (let j = 0; j < 3; j++) {
      // const index = (3 * i + j)
      const cell = {
        text: signs[field[index]],
        callback_data: 't-x-' + index
      }
      index++
      row.push(cell)
    }
    buttons.push(row)
  }
  return buttons
}
bot.onText(/\/game/, (msg) => {
  const chatId = msg.chat.id
  try {
    bot.sendMessage(chatId, 'Ваш ход', {
      reply_markup: {
        inline_keyboard: renderButtons(field)
      }
    })
  } catch (err) {
    console.log('Error!', err)
    bot.sendMessage(chatId, 'Ошибочка вышла')
  }
})

bot.on('callback_query', (query) => {
  try {
    const chatId = query.message.chat.id
    console.log(query.data)
    const [action, ...params] = query.data.split('-')
    console.log(action, params)
    //t = пользователь сделал ход
    if (action === 't') {
      const [sign, position] = params
      if (field[position] !== '_') {
        return bot.sendMessage(chatId, 'клетка занята')
      }
      field[position] = sign
      bot.sendMessage(chatId, 'Ваш ход', {
        reply_markup: {
          inline_keyboard: renderButtons(field)
        }
      })
    }
  }
  catch (err) {
    console.log(err)
  }
})

