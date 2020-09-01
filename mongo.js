const mongoose = require("mongoose");

if (process.argv.length < 2) {
  console.log("please provide the password as the argument");
  process.exit(1);
}
const password = process.argv[2];

//const url = ;

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the mongodb"))
  .catch((err) => console.log("Something failed"));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("person", personSchema);

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save(person).then((res) => {
    console.log(
      `Added ${process.argv[3]} number ${process.argv[4]} to the phonebook`
    );
    mongoose.connection.close();
  });
  return;
}

Person.find().then((res) => {
  console.log("phonebook:");
  res.forEach((p) => console.log(`${p.name} ${p.number}`));

  mongoose.connection.close();
});
