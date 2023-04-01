const express = require('express')
const connectDB = require('./db/mongoDB')
const rssRoute = require('./routes/routeRss')


const app = express()

const port = 3002
const host = "localhost"

try {
    const db = connectDB()
} catch (error) {
    process.exit(1);
}
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'localhost');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(rssRoute)

app.listen(port, host, () => { console.log(`Serveur à l'écoute sur http://${host}:${port} `) })