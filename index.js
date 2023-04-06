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

const port=5000;

const uri=process.env.MONGO_URI
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const serviceCollection = client.db("ClassicMotor").collection("Services");
  const reviewCollection=client.db("ClassicMotor").collection("Reviews");
  const bookingCollection=client.db("ClassicMotor").collection("Booking");
  const adminCollection=client.db("ClassicMotor").collection("Admin");

  app.post('/addServices',(req,res)=>{
      const service=req.body;
      serviceCollection.insertOne(service)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })


  app.post('/addReview',(req,res)=>{
    const review=req.body;
    reviewCollection.insertOne(review)
    .then(result=>{
        res.send(result.insertedCount>0)
    })
})

  app.get('/allServices',(req,res)=>{
    serviceCollection.find()
    .toArray((err,services)=>{
      res.send(services)
    })
  })

    app.delete('/deleteService/:id',(req,res)=>{
      serviceCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result=>{
        res.send(result.deletedCount>0)
      })
    })

  app.get('/allReviews',(req,res)=>{
    reviewCollection.find()
    .toArray((err,reviews)=>{
      res.send(reviews)
    })
  })

    app.post('/addBooking',(req,res)=>{
      const booking=req.body;
      bookingCollection.insertOne(booking)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
    })

    app.get('/bookingByEmail',(req,res)=>{
      bookingCollection.find({email:req.query.email})
      .toArray((err,booking)=>{
        res.send(booking)
      })
    })

    app.get('/allBooking',(req,res)=>{
      bookingCollection.find()
      .toArray((err,booking)=>{
        res.send(booking)
      })
    })

    app.post('/makeAdmin',(req,res)=>{
      const adminEmail=req.body;
      adminCollection.insertOne(adminEmail)
      .then(result=>{
          res.send(result.insertedCount>0)
      })
  })
  
  app.post('/adminEmail',(req,res)=>{
    const email=req.body.email;
    adminCollection.find({email:email})
    .toArray((err,admin)=>{
      res.send(admin.length>0)
    })
})
  
  app.patch('/update',(req,res)=>{
    bookingCollection.updateOne({_id: ObjectId(req.body.id)},
    {
      $set:{status:req.body.status}
    })
    .then(result=>{
      res.send(result.modifiedCount>0)
    })
  })

});

app.get('/',(req,res)=>{
    res.send('Hello,Server is working perfectly..!')
})

app.listen(process.env.PORT || port)