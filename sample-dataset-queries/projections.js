/*
MONGODB SAMPLE QUERIES — PROJECTIONS
Condensed from the 9 original sample_* files.

A projection controls WHICH FIELDS are returned.
find(filter, projection) has two separate arguments:
1. filter     — which documents to return
2. projection — which fields to include/exclude in those documents
*/

// =============================================================================
// 1. INCLUDE SELECTED FIELDS
// =============================================================================

// Include chosen fields. _id is included by default unless explicitly excluded.
// Source pattern: sample_geospatial.js.
db.shipwrecks.find(
  { feature_type: "Wrecks - Visible" },
  { recrd: 1, vesslterms: 1, coordinates: 1 },
);

// =============================================================================
// 2. EXCLUDE FIELDS
// =============================================================================

// Exclude selected fields; all other fields are returned.
// Source pattern: sample_restaurants.js / sample_training.js.
db.inspections.find(
  { result: "No Violation Issued" },
  { date: 0, "address.zip": 0 },
);

// =============================================================================
// 3. NESTED FIELD PROJECTION
// =============================================================================

// Select specific fields inside an embedded document.
// Source pattern: sample_training.js.
db.inspections.find(
  { result: "No Violation Issued" },
  {
    _id: 0,
    business_name: 1,
    "address.street": 1,
    "address.number": 1,
    "address.city": 1,
    date: 1,
  },
);

// =============================================================================
// 4. PROJECT FIELDS FROM EMBEDDED ARRAY DOCUMENTS
// =============================================================================

// Return selected fields from each embedded item.
// Source pattern: sample_supplies.js.
db.sales.find(
  { _id: ObjectId("5bd761dcae323e45a93ccfe8") },
  { "items.name": 1, "items.price": 1 },
);

// =============================================================================
// 5. INCLUDE FIELDS AND EXCLUDE _id
// =============================================================================

// _id: 0 is the special allowed exclusion in an inclusion projection.
// Source pattern: sample_training.js.
db.trips.find(
  { "birth year": { $lt: 1970 } },
  {
    _id: 0,
    tripduration: 1,
    "start station name": 1,
    "end station name": 1,
    usertype: 1,
  },
);

// =============================================================================
// PROJECTION RULES
// =============================================================================

/*
- Inclusion projection: { fieldA: 1, fieldB: 1 }
  Returns only those fields, plus _id unless excluded.
- Exclusion projection: { fieldA: 0, fieldB: 0 }
  Returns all fields except those listed.
- Do not mix inclusion and exclusion in one projection, except for _id.
- Dot notation selects nested fields.
- Projection does not filter documents; the first find() argument does that.
- These source files demonstrate find() projections. They do not contain
  distinct examples of $slice or projection-form $elemMatch.
*/
