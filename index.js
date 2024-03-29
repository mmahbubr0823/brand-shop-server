const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.scdnbhm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db('productDB').collection('product');
    const selectedProductCollection = client.db('selectedProductDB').collection('selectedProduct');

    // get products 

    app.get('/selectedProducts', async (req, res) => {
      const cursor = selectedProductCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
  })

  app.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await productCollection.findOne(query);
    res.send(result);
})

  // posting server 
    app.post('/selectedProducts', async (req, res) => {
      const allProducts = req.body;
      console.log(allProducts);
      const result = await selectedProductCollection.insertOne(allProducts);
      res.send(result);
  })
    app.post('/products', async (req, res) => {
      const allProducts = req.body;
      console.log(allProducts);
      const result = await productCollection.insertOne(allProducts);
      res.send(result);
  })

  // updating data 

  app.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) }
    const options = { upsert: true };
    const updatedProducts = req.body;

    const newProduct = {
        $set: {
            image: updatedProducts.image,
            name: updatedProducts.name,
            type: updatedProducts.type,
            price: updatedProducts.price,
            brand: updatedProducts.brand,
            rating: updatedProducts.rating,
            description: updatedProducts.description
        }
    }

    const result = await productCollection.updateOne(filter, newProduct, options);
    res.send(result);
})

  // delete an item 

  app.delete('/selectedProducts/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await selectedProductCollection.deleteOne(query);
    res.send(result);
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('hallow')
})
app.listen(port, (rq, res) => {
  console.log(`brand: ${port}`);
})