import fs from 'node:fs/promises'
import WhatappWeb from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

const { Client, LocalAuth } = WhatappWeb

const client = new Client({
  authStrategy: new LocalAuth()
})

client.on('qr', qr => {
  console.log({ qr })
  qrcode.generate(qr, { small: true })
})

client.on('ready', async () => {
  console.log('¡Celular conectado correctamente!')
})

client.on('message', async (message) => {
  if (!message.body.startsWith('!')) return message.reply('¡Hola! Soy un bot. Escribe !help para ver los comandos disponibles.')

  const args = message.body.slice('!').trim().split(/ +/g)
  const command = args.shift().toLowerCase().slice(1)

  if (command === 'ping') {
    return message.reply('Pong!')
  }

  if (['txt', 't', 'wame'].includes(command)) {
    return message.reply(`https://wa.me/${args[0]}`)
  }

  if (message.hasMedia) {
    const { data: image, mimetype } = await message.downloadMedia()

    const today = new Date()
    const formatter = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit' })
    const currentDate = formatter.format(today).replace(/\//g, '_')

    const ext = `.${mimetype.split('/')[1]}`
    const fileName = `IMG_${currentDate}_${today.getTime()}${ext}`
    const filePath = './files/images/' + fileName

    fs.writeFile(filePath, image, 'base64', (err) => {
      if (err) throw err
      console.log(`File ${fileName} has been saved.`)
    })
  }
})

client.initialize()
