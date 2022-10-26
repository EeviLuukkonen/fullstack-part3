require('dotenv').config()
const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :response-time :body'))

app.get('/info', (req, res) => { 
    const date = new Date()
    console.log(date)
    
    res.send(`<p>Phonebook has info for ${Person.length} people</p>
            <p>${new Date}</p>`)
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
    res.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
        if (person) {
          res.json(person)
        } else {
          res.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
      .then(result => {
        res.status(204).end()
      })
      .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {    
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

    const person = new Person({
      name: body.name,
      number: body.number,
    })

    person.save().then(savedPerson => {
      res.json(savedPerson)
    })

})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})