const express = require("express")
const cors = require("cors")
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5000

// middileware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i5tec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        const database = client.db("travelTourism")
        const travelInfo = database.collection("travelInfo")
        const bookings = database.collection("bookings")

        // Home Panel
        app.get("/info", async (req, res) => {
            const info = travelInfo.find({})
            const result = await info.toArray()
            res.json(result)
        })
        app.get('/info/:id', async (req, res) => {
            const id = req.params.id
            // console.log("jot", id)
            const query = { _id: ObjectId(id) }
            const info = await travelInfo.findOne(query)
            res.json(info)
        })

        app.post("/bookings", async (req, res) => {
            const infos = req.body
            console.log(infos)
            const result = await bookings.insertOne(infos)
            console.log(result)
            res.json(result)
        })

        // Admin Panel
        app.post("/info", async (req, res) => {
            // console.log(req.body)
            const newServiceInfo = req.body
            const result = await travelInfo.insertOne(newServiceInfo)
            res.json(result)
        })

        app.get("/bookings", async (req, res) => {
            const bookingInfo = bookings.find({})
            const result = await bookingInfo.toArray()
            res.json(result)
        })
        app.delete("/bookings/:id", async (req, res) => {
            const id = req.params.id
            // console.log(id)
            const query = { _id: ObjectId(id) }
            const result = await bookings.deleteOne(query)
            res.json(result)
        })
        app.put("/info/:id", async (req, res) => {
            const id = req.params.id
            const updateInfo = req.body
            console.log(req.body)
            // console.log(id, updateInfo)
            const filter = { _id: ObjectId(id) }
            // const options = { upsert: true }
            const updateDoc = {
                $set: {
                    status: updateInfo[0].status
                }
            }
            const result = await bookings.updateOne(filter, updateDoc)
            console.log(updateInfo)
            res.json(result)
        })

        // My Bookings Panel
        app.get("/mybookings/:id", async (req, res) => {
            // console.log(req.params.id)
            const query = { email: req.params.id }
            const cursor = bookings.find(query)
            const result = await cursor.toArray()
            console.log(result)
            res.send(result)
        })

        app.delete("/mybookings/:id", async (req, res) => {
            console.log(req.params.id)
            const query = { _id: ObjectId(req.params.id) }
            const result = await bookings.deleteOne(query)
            res.json(result)
        })


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    res.send("hello world")
})


app.listen(port, () => {
    console.log(`hello listening from ${port}`)
})