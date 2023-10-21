const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.fzaqft4.mongodb.net/?retryWrites=true&w=majority`;




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
    // await client.connect();

    const productCollection = client.db("productDB").collection("product");
    const cartCollection = client.db("productDB").collection("cart");
    


    app.get('/products', async(req,res)=>{
      const cursor = productCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get('/cart', async(req,res)=>{
      const cursor = cartCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/cart/:id', async (req,res)=>{ 
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.findOne(query);
      res.send(result)
  })



    app.post('/cart',async(req,res)=>{
      const product = req.body
      console.log(product)
      const result = await cartCollection.insertOne(product);
      res.send(result)
    })

    app.delete('/cart/:id', async(req,res)=>{
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result)
    })




    app.get('/products/:id', async (req,res)=>{ 
      const id = req.params.id
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result)
  })


    app.post('/products',async(req,res)=>{
      const product = req.body
      const result = await productCollection.insertOne(product);
      res.send(result)
    })


    app.put('/products/:id', async (req,res)=>{ 
      const id = req.params.id
      const product = req.body
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image:product.image,
          name:product.name,
          brandName:product.brandName,
          shortDescription:product.shortDescription,
          type:product.type,
          price:product.price,
          rating:product.rating
        },
      };

      const result = await productCollection.updateOne(filter, updateDoc, options);
      res.send(result)

  })




    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req,res)=>{
    res.send("Electro & Techno is running..!!")
})

app.listen(port,(req,res)=>{
    console.log("Electro and Techno is running on port: ",port)
})