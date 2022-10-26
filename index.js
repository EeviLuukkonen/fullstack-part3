require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :response-time :body'))

let persons = [
      {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
      },
      {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
      },
      {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
      }
    ]

app.get('/info', (req, res) => { 
    const date = new Date()
    console.log(date)
    
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date}</p>`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const getId = (max) => (Math.floor(Math.random() * max))
    
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (!body.number) {
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    body.id = getId(10000)
    persons = persons.concat(body)

    res.json(body)
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})