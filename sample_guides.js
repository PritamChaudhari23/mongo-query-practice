// CREATE:
// 1.Insert a new planet document into the `planets` collection with the following details:
//    - Name: "Pluto"
//    - Order from Sun: 9
//    - Has Rings: false
//    - Main Atmosphere: ["Methane, "Hydrogen"]
//    - Surface Temperature (Celsius): Min: -465, Max: -470, Mean: -467
db.planets.insertOne({
  name: "Pluto",
  orderFromSun: 9,
  hasRings: false,
  mainAtmosphere: ["Methane", "Hydrogen"],
  surfaceTemperatureC: {
    min: -465,
    max: -470,
    mean: -467,
  },
});

// -----------------------------------------------------------------------------------------------------------------------------

// READ:
// 2.Find the document of the planet named "Mercury".
db.planets.find({
  name: "Mercury",
});

// 3.Retrieve all planets that do not have rings.
db.planets.find({
  hasRings: false,
});

// 4.Find planets that have a surface temperature mean greater than 100°C.
db.planets.find({
  "surfaceTemperatureC.mean": { $gt: 100 },
});

// -----------------------------------------------------------------------------------------------------------------------------

// UPDATE:
// 5.Update the planet "Mercury" to change its surface temperature (Celsius) to the following:
//    - Min: -160
//    - Max: 450
//    - Mean: 65

db.planets.updateOne(
  {
    name: "Mercury",
  },
  {
    $set: {
      surfaceTemperatureC: {
        min: -160,
        max: 450,
        mean: 65,
      },
    },
  }
);

// 6.Update the document of the planet "Venus" to add "Oxygen" to its `mainAtmosphere` array.
db.planets.updateOne(
  {
    name: "Mercury",
  },
  {
    $push: {
      mainAtmosphere: "Oxygen",
    },
  }
);
// -----------------------------------------------------------------------------------------------------------------------------

// DELETE:
// 7.Delete the planet document where the name is "Pluto".
db.planets.deleteOne({
  name: "Pluto",
});

// -----------------------------------------------------------------------------------------------------------------------------

// CRUD COMBINED:
// 8.Add a new planet document with the following details:
//    - Name: "Pluto"
//    - Order from Sun: 9
//    - Has Rings: false
//    - Main Atmosphere: ["Methane", "Hydrogen"]
//    - Surface Temperature (Celsius): Min: -50, Max: 50, Mean: 15
db.planets.insertOne({
  name: "Pluto",
  orderFromSun: 9,
  hasRings: false,
  mainAtmosphere: ["Methane", "Hydrogen"],
  surfaceTemperatureC: {
    min: -50,
    max: 50,
    mean: 15,
  },
});

//    Then, update the newly inserted planet "Earth" to change its surface temperature (Celsius) to:
//    - Min: -465, Max: -470, Mean: -467.
db.planets.updateOne(
  {
    name: "Pluto",
  },
  {
    $set: {
      surfaceTemperatureC: {
        min: -465,
        max: -470,
        mean: -467,
      },
    },
  }
);

// -----------------------------------------------------------------------------------------------------------------------------

// READ & SORT:
// 9.Retrieve all planets that have a surface temperature mean greater than 100°C, and sort them by `orderFromSun` in descending order.
db.planets
  .find({
    "surfaceTemperatureC.mean": { $gt: 100 },
  })
  .sort({ orderFromSun: -1 });

// -----------------------------------------------------------------------------------------------------------------------------

// UPDATE & SORT:
// 10.Update the planet named "Venus" to change its `orderFromSun` to 3, then find all planets and sort them by `orderFromSun` in ascending order.
db.planets.updateOne(
  {
    name: "Venus",
  },
  { $set: { orderFromSun: 3 } }
);

db.planets.find().sort({ orderFromSun: +1 });

// -----------------------------------------------------------------------------------------------------------------------------
