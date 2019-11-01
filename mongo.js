const mongoose = require('mongoose')

if ( process.argv.length < 3 ) {
    console.log('give password as argument')
    process.exit(1)
}

if ( process.argv.length > 5 ) {
    console.log('too many arguments')
    process.exit(1)
}

if ( process.argv.length === 4 ) {
    console.log('missing argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://user_one:${password}@cluster0-jadvn.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if ( process.argv.length === 3) {
Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
        console.log(person.name, person.number)
    })
    mongoose.connection.close()
})

} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const pers = new Person({
        name: name,
        number: number
    })

    pers.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`)
        mongoose.connection.close()
    })

}