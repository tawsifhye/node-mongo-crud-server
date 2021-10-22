const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());

app.use(express.json())
// user : mydbuser1
// password : pBAyeH29BdFtIx9M


const uri = "mongodb+srv://mydbuser1:pBAyeH29BdFtIx9M@cluster0.youri.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("test");
      const usersCollection = database.collection("users");
      //GET API 
      app.get('/users', async(req, res)=>{
          const cursor = usersCollection.find({});
          const users = await cursor.toArray();
          res.send(users)
      })

      
      //specific user
      app.get('/users/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const user = await usersCollection.findOne(query);
          res.send(user);
      })

      //POST API
      app.post('/',  async(req, res) => {
          const newUser = req.body;
          const result = await usersCollection.insertOne(newUser);
        //   console.log('got new user', req.body)
        //   console.log('added user', result)
          res.json(res)
      })

       // DELETE API
       app.delete("/users/:id", async(req, res)=>{
           const id = req.params.id;
           const query = {_id: ObjectId(id)}
           const result = await usersCollection.deleteOne(query);
           console.log("deleteing user with id", result);
           res.send(result);
    })
    }
    finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

/* client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  console.log("Hitting the database");
    const user ={name: 'Tawsif', email: 'tawsif@xyz.com'}
  collection.insertOne(user)
  .then(() => {
      console.log('insert success');
  })

//   client.close();
}); */


app.get("/", (req, res) => {
    res.send("Running my CRUD Server");
})

app.listen(port, ()=> {
    console.log("Running Server on port", port);
})