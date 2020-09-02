require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const Person = require("./models/Person");
const { findByIdAndUpdate } = require("./models/Person");
require("./config/db")();

app.use(express.json());
app.use(express.static("build"));

if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms :body"
    )
  );
  morgan.token("body", (req, res) => JSON.stringify(req.body));
}

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

app.get("/info", async (req, res) => {
  try {
    const persons = await Person.find();
    res.send(`
      <p>Phone book has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `);
  } catch (err) {
    console.log(err.message);
    res.status(500).end();
  }
});

app.get("/api/persons", async (req, res) => {
  try {
    const persons = await Person.find();
    res.json(persons);
  } catch (err) {
    res.status(404).end();
    console.log(err.message);
  }
});

app.get("/api/persons/:id", async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    res.json(person);
  } catch (err) {
    res.status(404).end();
    console.log(err.message);
  }
});

app.delete("/api/persons/:id", async (req, res) => {
  try {
    await Person.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/api/persons", async (req, res) => {
  try {
    let body = req.body;

    if (!body.name && !body.number)
      return res.status(400).json({ error: "Name or number is required" });

    const { name, number } = req.body;
    let person = new Person({
      name,
      number,
    });

    person = await person.save();
    res.json(person);
  } catch (err) {
    console.log(err.message);
    res.json(err);
  }
});

app.put("/api/persons/:id", async (req, res) => {
  const id = req.params.id;
  const updatedPerson = {
    name: req.body.name,
    number: req.body.number,
  };
  const person = await Person.findByIdAndUpdate(id, updatedPerson, {
    new: true,
  });
  res.json(person);
});

const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  res.status(500).send({ error: "Something failed" });
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
