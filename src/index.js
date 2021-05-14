const express = require("express");
const app = express();
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const bodyparser = require("body-parser");
const { json } = require("body-parser");

app.use(
  cors({
    origin: "*"
  })
);

app.use(bodyparser.json());

//UANwNJFr1nKilkVM

const uri =
  "mongodb+srv://user_Himanshu:UANwNJFr1nKilkVM@provision.moovh.mongodb.net/Provision?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
client.connect((err) => {
  if (err) {
    console.log(err);
  }
});
const connection = (prop) => {
  const collection = client.db("provisionDB").collection(prop);
  return collection;
};

const userColInsert = async (props) => {
  const userCollection = connection("userCol");
  let result = await userCollection.insertOne(props);
  if (result.insertedCount === 1) {
    return "ok";
  } else {
    throw new Error("not inserted");
  }
};

const provColInsert = async (props) => {
  const Collection = connection("provisionCol");
  let result = await Collection.insertOne(props);
  if (result.insertedCount === 1) {
    return "ok";
  } else {
    throw new Error("not inserted");
  }
};

const userColFind = async (props) => {
  const userCollection = connection("userCol");
  let result = await userCollection.find({
    auth: props
  });
  return await result.toArray();
};
const provisionColFind = async (props) => {
  // console.log(props);
  const provCollection = connection("provisionCol");
  let result = await provCollection.find({
    auth: props
  });
  return await result.toArray();
};

const provisionColFindAll = async (props) => {
  // console.log(props);
  const provCollection = connection("provisionCol");
  let result = await provCollection.find();
  return await result.toArray();
};

app.get("/provision", (req, res) => {
  const auth = req.header("authorization");
  // console.log(auth);
  provisionColFind(auth).then((re) => {
    if (re.length !== 0) {
      res.send(re);
    } else {
      res.status(404).end();
      res.status("No provision found");
    }
  });
});

app.get("/provisionAll", (req, res) => {
  provisionColFindAll().then((re) => {
    if (re.length !== 0) {
      console.log(re);
      res.send(re);
    } else {
      res.status(404).end();
      res.status("No provision found");
    }
  });
});

app.post("/provision", (req, res) => {
  const auth = req.header("authorization");

  let obj = {
    auth: auth,
    provision: req.body.provision
  };
  const result = provColInsert(obj);

  result
    .then((re) => {
      res.send(re);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.get("/login", (req, res) => {
  const auth = req.header("authorization");

  userColFind(auth)
    .then((re) => {
      if (re.length !== 0) res.send(re);
      else {
        res.status(404).end();
        res.send("Wrong user id or password");
      }
    })
    .catch((err) => {
      res.status(500).end();
      res.send("internal server error");
    });
});
app.post("/register", (req, res) => {
  const auth = req.header("authorization");

  let obj = {
    auth: auth,
    name: req.body.name,
    mail: req.body.mail
  };

  let result = userColInsert(obj);

  result
    .then((re) => {
      res.send(re);
    })
    .catch((err) => {
      res.send(err);
    });
});

app.listen(3000, "localhost", () => {
  console.log("listening");
});
