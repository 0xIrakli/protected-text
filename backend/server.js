import express from "express"
import cors from "cors"
import mongoose from 'mongoose'
import { NOTE } from './NOTE.js'
import bcrypt from 'bcrypt'

const app = express()

app.use(
  cors({
    origin: '*'
  })
)

app.use(express.json())

app.post('/note', async (req, res) => {
  const { title, note, password: plainTextPasswd } = req.body
  // (!(title && note && plainTextPasswd)) ar davushvat carieli note
  if (!(title && plainTextPasswd)) {
    return res.sendStatus(400)
  }

  const password = await bcrypt.hash(plainTextPasswd, 2)

  if (!await NOTE.findOneAndUpdate({title}, {note})) {
    const newNote = new NOTE({title, note, password})
    await newNote.save()
  }

  // if (NOTE.findOne({title}).exec()) {
  //   NOTE.findOneAndUpdate({title}, {title, note, password})
  //   return res.sendStatus(200)
  // }

  return res.sendStatus(200)
})

app.post('/note/:title', async (req, res) => {
  const { title } = req.params
  const { password: plainTextPasswd } = req.body
  const noteData = await NOTE.findOne({ title }).exec()
  if (!noteData) {
    return res.status(404).json({'message':'note not found'})
  }
  
  // vs code miwers rom await arari aucilebeli magram compare Promise-s aburnebs
  if (await bcrypt.compare(plainTextPasswd, noteData.password)) {
    return res.json(noteData)
  }

  return res.sendStatus(403)
})

app.get('/note-status/:title', async (req, res) => {
  const { title } = req.params
  const available = !(await NOTE.findOne({ title }).exec())

  return res.sendStatus(available ? 200 : 404)
})


app.listen(3000, async () => {
  console.log('Server Started...')

  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/protected-text")
    console.log("Connected to the database...")
  } catch (error) {
    console.log(error)
  }
})