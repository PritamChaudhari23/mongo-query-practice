// 1.Find all companies that have the tag "media-platform" and have a funding round greater than $10M. List the company names, their funding round amounts, and their founding years.
db.companies.aggregate([
  {
    $match: {
      tag_list: { $regex: /media-platform/ },
    },
  },
  { $unwind: "$funding_rounds" },
  {
    $match: {
      "funding_rounds.raised_amount": { $gt: 10000000 },
    },
  },
  {
    $project: {
      _id: 0,
      name: 1,
      founded_year: 1,
      funding_amount: "$funding_rounds.raised_amount",
    },
  },
]);

// 2.Retrieve the details of all inspections conducted in the year 2015 where the result was "No Violation Issued." Include the business name, address, and inspection date.
db.inspections.find(
  {
    result: "No Violation Issued",
    date: { $regex: /2015/ },
  },
  {
    _id: 0,
    business_name: 1,
    "address.street": 1,
    "address.number": 1,
    "address.city": 1,
    date: 1,
  }
);

// 3.Identify all posts that have the tag "food" and were created in 2012. Include the title, author, and the number of comments in each post.
db.posts.aggregate([
  {
    $match: {
      tags: "food",
      date: {
        $gte: ISODate("2012-01-01"),
        $lt: ISODate("2013-01-01"),
      },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      author: 1,
      commentCount: { $size: "$comments" },
    },
  },
]);

// 4.List all trips taken by users born before 1970. For each trip, display the trip duration, start station name, end station name, and user type.
db.trips.find(
  {
    "birth year": { $lt: 1970 },
  },
  {
    _id: 0,
    tripduration: 1,
    "start station name": 1,
    "end station name": 1,
    usertype: 1,
  }
);

// 5.Find the top 3 companies by the number of employees that have a relationship with the person named "Ben Elowitz." Show the company name, number of employees, and the person's title.
db.companies.aggregate([
  { $unwind: "$relationships" },
  {
    $match: {
      "relationships.person.first_name": "Ben",
      "relationships.person.last_name": "Elowitz",
    },
  },
  {
    $project: {
      _id: 0,
      company: "$name",
      employees: "$number_of_employees",
      title: "$relationships.title",
    },
  },
  { $sort: { employees: -1 } },
  { $limit: 3 },
]);

// 6.Find all routes operated by the airline "Aerocondor" and list their source and destination airports along with the number of stops for each route.
db.routes.find(
  {
    "airline.name": "Aerocondor",
  },
  {
    _id: 0,
    src_airport: 1,
    dst_airport: 1,
    stops: 1,
  }
);

// 7.Retrieve all students' exam scores who have a score greater than 90 in any exam. Show the student ID and their corresponding scores from the "grades" collection.
db.grades.find(
  {
    scores: {
      $elemMatch: {
        type: "exam",
        score: { $gt: 90 },
      },
    },
  },
  {
    _id: 0,
    student_id: 1,
    scores: 1,
  }
);

// 8.Find all companies that have an acquisition price greater than $25M and list the company name, acquisition price, and acquiring company name.
db.companies.find(
  {
    "acquisition.price_amount": { $gt: 25000000 },
  },
  {
    _id: 0,
    name: 1,
    "acquisition.price_amount": 1,
    "acquisition.acquiring_company.name": 1,
  }
);

// 9.Identify all cities in the `zips` collection that have a population greater than 40,000. Include the city name, state, and population.
db.zips.find(
  {
    pop: { $gt: 40000 },
  },
  {
    _id: 0,
    city: 1,
    state: 1,
    pop: 1,
  }
);

// 10.Get the total number of trips that started and ended in the same zip code. Display the trip's start station and end station names, along with the total number of such trips.
db.trips.aggregate([
  {
    $match: {
      $expr: {
        $eq: ["$start station name", "$end station name"],
      },
    },
  },
  {
    $group: {
      _id: {
        start: "$start station name",
        end: "$end station name",
      },
      totalTrips: { $sum: 1 },
    },
  },
  {
    $project: {
      _id: 0,
      start_station: "$_id.start",
      end_station: "$_id.end",
      totalTrips: 1,
    },
  },
]);
