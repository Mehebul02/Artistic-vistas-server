const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware
const corsConfig = {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.use(cors(corsConfig));
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
    app.get('/crafts',async(req,res)=>{
      const query = craftsCollection.find()
      const result = await query.toArray()
      res.send(result)
    })

    app.post("/crafts", async (req, res) => {
      const craft = req.body;
      console.log("craft post", craft);
      const result = await craftsCollection.insertOne(craft);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
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
