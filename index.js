const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
//app.use(morgan('tiny'))

morgan.token('body', function (request, response) {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



let persons = [
    {
        name: "John Doe",
        number: "555-123456",
        id: 1
    },
    {
        name: "Jane Doe",
        number: "555-654321",
        id: 2
    },
    {
        name: "Bond, James Bond",
        number: "007",
        id: 3
    }
]
app.get('/info', (request, response) => {
    const users = persons.length
    const now = new Date()
    response.send(`<span>Phonebook has ${users} contacts</span>
                   <br>
                   <span>${now}</span>`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(pers => pers.id === id)
   
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(pers => pers.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.map(pers => pers.name).includes(body.name)) {
        return response.status(400).json({
            error: 'name is already in the phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const generateId = () => {
    const newId = Math.floor(Math.random() * Math.floor(1000))

    return newId
}


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})