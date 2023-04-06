const express=require('express')
require('dotenv').config()
const bodyParser=require('body-parser');
const cors =require('cors');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;

const app=express();
app.use(bodyParser.json());
app.use(cors());

const PORT=5000;

const uri=process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  app.post('/addServices',async(req,res)=>{
      const serviceCollection = client.db("ClassicMotor").collection("Services");
      const service=req.body;
      await serviceCollection.insertOne(service)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })


  app.post('/addReview',async(req,res)=>{
    const reviewCollection=client.db("ClassicMotor").collection("Reviews");
    const review=req.body;
    await reviewCollection.insertOne(review)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
})

  app.get('/allServices',async(req,res)=>{
    const serviceCollection = client.db("ClassicMotor").collection("Services");
    await serviceCollection.find()
    .toArray((err,services)=>{
      res.send(services)
    })
  })

    app.delete('/deleteService/:id',async(req,res)=>{
      await serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result=>{
        res.send(result.deletedCount>0)
      })
    })

  app.get('/allReviews',async(req,res)=>{
    const reviewCollection=client.db("ClassicMotor").collection("Reviews");
    await reviewCollection.find()
    .toArray((err,reviews)=>{
      res.send(reviews)
    })
  })

    app.post('/addBooking',async(req,res)=>{
      const bookingCollection=client.db("ClassicMotor").collection("Booking");
      const booking=req.body;
      await bookingCollection.insertOne(booking)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
    })

    app.get('/bookingByEmail',async(req,res)=>{
      const bookingCollection=client.db("ClassicMotor").collection("Booking");
      await bookingCollection.find({email:req.query.email})
      .toArray((err,booking)=>{
        res.send(booking)
      })
    })

    app.get('/allBooking',async(req,res)=>{
      const bookingCollection=client.db("ClassicMotor").collection("Booking");
      await bookingCollection.find()
      .toArray((err,booking)=>{
        res.send(booking)
      })
    })

    app.post('/makeAdmin',async(req,res)=>{
      const adminCollection=client.db("ClassicMotor").collection("Admin");
      const adminEmail=req.body;
      await adminCollection.insertOne(adminEmail)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })
  
  app.post('/adminEmail',async(req,res)=>{
    const adminCollection=client.db("ClassicMotor").collection("Admin");
    const email=req.body.email;
    await adminCollection.find({email:email})
    .toArray((err,admin)=>{
      res.send(admin.length>0)
    })
})
  
  app.patch('/update',async(req,res)=>{
    const bookingCollection=client.db("ClassicMotor").collection("Booking");
    await bookingCollection.updateOne({_id: ObjectId(req.body.id)},
    {
      $set:{status:req.body.status}
    })
    .then(result=>{
      res.send(result.modifiedCount>0)
    })
  })

app.get('/',(req,res)=>{
    res.send('Hello,Server is working perfectly..!')
})

client.connect(err => {
    if(err){ console.error(err); return false;}
    // connection to mongo is successful, listen for requests
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
});