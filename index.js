
const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello World!')
})



const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cfh8khq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('emaJohn');
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('orderDetails');

        // To post all product 
        app.post('/addProduct', (req, res) => {
            const products = req.body;
            productsCollection.insertMany(products).then(result => {
                res.sendStatus(200);
            })
        })

        // To get all products
        app.get('/products', (req, res) => {
            productsCollection.find({}).toArray().then(result => {
                res.send(result);
            })
        })

        // To get a single product by key
        app.get('/product/:key', (req, res) => {
            productsCollection.find({ key: req.params.key }).toArray().then(result => {
                res.send(result[0]);
            })
        })


        // To get multiple products by  keys
        app.post('/getProductsByKeys', (req, res) => {
            const productKeys = req.body;
            productsCollection.find({ key: { $in: productKeys } }).toArray().then(result => {
                res.send(result);
            })
        })


        // To post order details in database
        app.post('/saveOrder', (req, res) => {
            const details = req.body;
            orderCollection.insertOne(details).then(result => {
                res.send(result.acknowledged);
            })
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(process.env.PORT || port)