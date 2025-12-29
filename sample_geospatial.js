// CREATE
// 1.Insert a new shipwreck document with the following details:
//    {
//      "recrd": "Record 101",
//      "vesslterms": "Vessel ABC",
//      "feature_type": "Wrecks - Visible",
//      "chart": "US,U1,graph,DNC H1409999",
//      "latdec": 12.3456789,
//      "londec": -98.7654321,
//      "gp_quality": "High",
//      "depth": 150,
//      "sounding_type": "Echo",
//      "history": "Sank in 1823",
//      "quasou": "Some information",
//      "watlev": "always submerged",
//      "coordinates": [-98.7654321, 12.3456789]
//    }

db.shipwrecks.insertOne({
  recrd: "Record 101",
  vesslterms: "Vessel ABC",
  feature_type: "Wrecks - Visible",
  chart: "US,U1,graph,DNC H1409999",
  latdec: 12.3456789,
  londec: -98.7654321,
  gp_quality: "High",
  depth: 150,
  sounding_type: "Echo",
  history: "Sank in 1823",
  quasou: "Some information",
  watlev: "always submerged",
  coordinates: [-98.7654321, 12.3456789],
});

// 2.Insert a new shipwreck document with the following details:
//    {
//      "recrd": "Record 102",
//      "vesslterms": "Vessel XYZ",
//      "feature_type": "Wrecks - Visible",
//      "chart": "US,U1,graph,DNC H1409870",
//      "latdec": 15.5678901,
//      "londec": -77.6543210,
//      "gp_quality": "Medium",
//      "depth": 80,
//      "sounding_type": "Lidar",
//      "history": "Found in 1900",
//      "quasou": "Additional details",
//      "watlev": "partially submerged",
//      "coordinates": [-77.6543210, 15.5678901]
//    }

db.shipwrecks.insertOne({
  recrd: "Record 102",
  vesslterms: "Vessel XYZ",
  feature_type: "Wrecks - Visible",
  chart: "US,U1,graph,DNC H1409870",
  latdec: 15.5678901,
  londec: -77.654321,
  gp_quality: "Medium",
  depth: 80,
  sounding_type: "Lidar",
  history: "Found in 1900",
  quasou: "Additional details",
  watlev: "partially submerged",
  coordinates: [-77.654321, 15.5678901],
});

// -----------------------------------------------------------------------------------------------------------------------------

// READ:
// 3.Find all shipwrecks that have the feature type "Wrecks - Visible" and return only their `recrd`, `vesslterms`, and `coordinates` fields.
db.shipwrecks.find(
  { feature_type: "Wrecks - Visible" },
  { recrd: 1, vesslterms: 1, coordinates: 1 }
);

// 4.Retrieve all shipwreck documents where the depth is greater than 100 and the water level is "always submerged."
db.shipwrecks.find({
  depth: { $gt: 100 },
  watlev: "always submerged",
});

// 5.Find the shipwrecks located at coordinates with a longitude less than -80 and return the `vesslterms`, `latdec`, and `londec` fields.
db.shipwrecks.find(
  { "coordinates.0": { $lt: -80 } },
  { vesslterms: 1, latdec: 1, londec: 1 }
);

// -----------------------------------------------------------------------------------------------------------------------------

// UPDATE:
// 6.Update the shipwreck document where the `recrd` is "Record 101" by changing its `depth` to 120 and `watlev` to "partially submerged."
db.shipwrecks.updateOne(
  {
    recrd: "Record 101",
  },
  {
    $set: {
      depth: 120,
      watlev: "partially submerged",
    },
  }
);

// 7.Modify the shipwreck document with `recrd` "Record 102" to update the `history` field to "Discovered in 2005" and `gp_quality` to "High."
db.shipwrecks.updateOne(
  {
    recrd: "Record 102",
  },
  {
    $set: {
      history: "Discovered in 2005",
      gp_quality: "High",
    },
  }
);

// -----------------------------------------------------------------------------------------------------------------------------

// DELETE:
// 8.Delete the shipwreck document where the `recrd` is "Record 101."
db.shipwrecks.deleteOne({
  recrd: "Record 101",
});

// 9.Remove all shipwreck documents where the depth is less than 50 meters.
db.shipwrecks.deleteMany({
  depth: { $lt: 50 },
});

// 10.Delete all shipwrecks that have the feature type "Wrecks - Visible" and a `latdec` greater than 20.
db.shipwrecks.deleteMany({
  feature_type: "Wrecks - Visible",
  latdec: { $gt: 20 },
});
// -----------------------------------------------------------------------------------------------------------------------------
