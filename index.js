const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
// const corsConfig = {
//   origin: '',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("", cors(corsConfig))
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.po42dna.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const database = client.db("craftsDB");
    const craftsCollection = database.collection("crafts");
    const subcategoriesCollection = client
      .db("subcategoriesDB")
      .collection("subcategories");
    app.get("/crafts", async (req, res) => {
      const query = craftsCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    app.get("/subcategories", async (req, res) => {
      const query = subcategoriesCollection.find();
      const result = await query.toArray();
      res.send(result);
    });
    // app.get("/subcategories/:itemName", async (req, res) => {
    //   console.log(req.params.itemName);
    //   const result = await craftsCollection
    //     .find({ itemName: req.params.itemName })
    //     .toArray();
    //   res.send(result);
    // });
    app.get("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.findOne(query);
      res.send(result);
    });
    app.put("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      const craft = req.body;
      console.log(craft);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: craft.image,
          itemName: craft.itemName,
          subcategoryName: craft.subcategoryName,
          price: craft.price,
          rating: craft.rating,
          customization: craft.customization,
          processingTime: craft.processingTime,
          stockStatus: craft.stockStatus,
          email: craft.email,
          name: craft.name,
          description: craft.description,
        },
      };
      const result = await craftsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //  my Craft add list
    app.get("/myCrafts/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await craftsCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    app.delete("/crafts/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Database delete ", id);
      const query = { _id: new ObjectId(id) };
      const result = await craftsCollection.deleteOne(query);
      res.send(result);
    });
    app.post("/crafts", async (req, res) => {
      const craft = req.body;
      console.log("craft post", craft);
      const result = await craftsCollection.insertOne(craft);
      res.send(result);
    });
    // app.post("/subcategories", async (req, res) => {
    //   const subcat = req.body;
    //   console.log("subcategories post", subcat);
    //   const result = await subcategoriesCollection.insertOne(subcat);
    //   res.send(result);
    // });
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Artistic Vistas server is running");
});
app.listen(port, () => {
  console.log(`Server port in running${port}`);
});
