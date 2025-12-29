// CREATE:
// 1.Insert a new weather data record with the following details:
// {
//   "st": "x+12345-001234",
//   "ts": { "$date": "2024-01-01T08:00:00.000Z" },
//   "position": { "type": "Point", "coordinates": [-34.5, 45.3] },
//   "elevation": 500,
//   "callLetters": "XY123",
//   "qualityControlProcess": "V021",
//   "dataSource": "3",
//   "type": "FM-11",
//   "airTemperature": { "value": 15.4, "quality": "1" },
//   "dewPoint": { "value": 8.2, "quality": "1" },
//   "pressure": { "value": 1013.5, "quality": "1" },
//   "wind": {
//     "direction": { "angle": 90, "quality": "1" },
//     "type": "8",
//     "speed": { "rate": 12.5, "quality": "1" }
//   },
//   "visibility": {
//     "distance": { "value": 5000, "quality": "1" },
//     "variability": { "value": "V", "quality": "1" }
//   },
//   "skyCondition": {
//     "ceilingHeight": { "value": 5000, "quality": "1", "determination": "1" },
//     "cavok": "Y"
//   },
//   "sections": ["AG2"],
//   "precipitationEstimatedObservation": {
//     "discrepancy": "1",
//     "estimatedWaterDepth": 20
//   }
// }

db.data.insertOne({}); // Same as others

// -----------------------------------------------------------------------------------------------------------------------------

// READ:
// 2.Find all weather data records with a `ts` timestamp after "2023-01-01T00:00:00.000Z".
db.data.find({
  ts: { $gt: new Date("2023-01-01T00:00:00.000Z") },
});

// 3.Retrieve the air temperature and pressure values from the weather data record with `_id: "5553a998e4b02cf7151190b8"`.
db.data.find(
  { _id: ObjectId("5553a998e4b02cf7151190b8") },
  {
    airTemperature: 1,
    pressure: 1,
  }
);

// 4.Find all records where the visibility distance is greater than 10000 and the wind speed rate is less than 5.
db.data.find({
  "visibility.distance.value": { $gt: 10000 },
  "wind.speed.rate": { $lt: 5 },
});

// -----------------------------------------------------------------------------------------------------------------------------

// UPDATE:
// 5.Update the weather data record with `_id: "5553a998e4b02cf7151190b8"` to change the air temperature to 20.5 and the pressure to 1020.0.
db.data.updateOne(
  {
    _id: ObjectId("5553a998e4b02cf7151190b8"),
  },
  {
    $set: {
      "airTemperature.value": 20.5,
      "pressure.value": 1020.0,
    },
  }
);

// 6.Update the visibility variability to "V" in all records where the wind speed rate is greater than 10.
db.data.updateMany(
  {
    "wind.speed.rate": { $gt: 10 },
  },
  {
    $set: {
      "visibility.variability.value": "V",
    },
  }
);

// 7.Change the `callLetters` to "NEWXYZ" for the weather data record with `_id: "5553a998e4b02cf7151190b8"`.
db.data.updateOne(
  {
    _id: ObjectId("5553a998e4b02cf7151190b8"),
  },
  {
    $set: {
      callLetters: "NEWXYZ",
    },
  }
);

// -----------------------------------------------------------------------------------------------------------------------------

// DELETE:
// 8.Delete the weather data record where the `st` field is "x+47600-047900".
db.data.deleteOne({ st: "x+47600-047900" });

// 9.Remove all weather data records where the `elevation` is greater than 8000.
db.data.deleteMany({ elevation: { $gt: 8000 } });

// 10.Delete all weather data records where the `airTemperature.value` is greater than 25 degrees Celsius.
db.data.deleteMany({ "airTemperature.value": { $gt: 25 } });

// -----------------------------------------------------------------------------------------------------------------------------
