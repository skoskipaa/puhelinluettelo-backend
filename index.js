require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())
//app.use(morgan('tiny'))

morgan.token('body', function (request, response) {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        const users = persons.length
        const now = new Date()
        response.send(`<span>Phonebook has ${users} contacts</span>
        <br>
        <span>${now}</span>`)
    })
}) 

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(pers => pers.toJSON()))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
   Person.findById(request.params.id).then(pers => {
       if (pers) {
           response.json(pers.toJSON())
       } else {
           response.status(404).end()
       }
   })
   .catch(error => next(error))   
})

app.delete('/api/persons/:id', (request, response) => {
   Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

   // if (persons.map(pers => pers.name).includes(body.name)) {
   //     return response.status(400).json({
   //         error: 'name is already in the phonebook'
   //     })
   // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson.toJSON())
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, reponse) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})