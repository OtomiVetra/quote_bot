require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

let field = ['_', '_', '_', '_', '_', '_', '_', '_', '_']
const combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

let messageId = null
let finished = true

const updateMessage = (chatId, text) => {
  bot.editMessageText(text, {
    chat_id: chatId,
    message_id: messageId
  }).then(() => {
    bot.editMessageReplyMarkup({
      inline_keyboard: renderButtons(field)
    }, {
      chat_id: chatId,
      message_id: messageId
    })
  })
}

const checkDraw = () => {
  if (field.find((cell) => cell === '_')) {
    return false
  } else {
    return true
  }
}
const checkWin = (sign) => {
  for (const combination of combinations) {
    let count = 0
    for (const index of combination) {
      if (sign === field[index]) {
        count += 1
      }
    }
    if (count === 3) {
      return true
    }
  }
  return false
}
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
    field = ['_', '_', '_', '_', '_', '_', '_', '_', '_']
    finished = false
    bot.sendMessage(chatId, 'Ваш ход', {
      reply_markup: {
        inline_keyboard: renderButtons(field)
      }
    }).then(msg => {
      messageId = msg.message_id
    })

  } catch (err) {
    console.log('Error!', err)
    bot.sendMessage(chatId, 'Ошибочка вышла')
  }
})
const getFreeRandomIndex = () => {
  const freeCellsCount = field.filter((n) => {
    return n === '_'
  }).length
  const randomFreeCellIndex = Math.floor(Math.random() * freeCellsCount)
  let incIndex = 0
  for (let i = 0; i < field.length; i++) {
    if (field[i] === '_') {
      if (incIndex === randomFreeCellIndex) {
        return i
      } else {
        incIndex++
      }
    }
  }
  return -1
}




bot.on('callback_query', (query) => {
  try {
    const chatId = query.message.chat.id
    console.log(query.data)
    const [action, ...params] = query.data.split('-')
    if (action === 't') {
      if (finished) {
        updateMessage(chatId, 'игра завершена!')
        return
      }
      const [sign, position] = params
      if (field[position] !== '_') {
        updateMessage(chatId, 'клетка занята!')
        return
      }
      field[position] = sign
      if (checkWin(sign)) {
        finished = true
        updateMessage(chatId, 'вы победили!')
        return
      }
      if (checkDraw()) {
        finished = true
        updateMessage(chatId, 'ничья!')
        return
      }
      const position2 = getFreeRandomIndex()
      const sign2 = sign === 'x' ? 'o' : 'x'
      field[position2] = sign2
      if (checkWin(sign2)) {
        finished = true
        updateMessage(chatId, 'вы проиграли!')
        return
      }
      if (checkDraw()) {
        finished = true
        updateMessage(chatId, 'ничья!')
        return
      }
      updateMessage(chatId, 'ваш ход!')
    }
  }
  catch (err) {
    console.log(err)
  }
})

