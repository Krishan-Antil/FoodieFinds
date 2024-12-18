const express = require('express');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './BD4_Assign/database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function getAllRestaurants() {
  let query = 'SELECT * FROM restaurants';

  let response = await db.all(query, []);

  return { restaurants: response };
}
app.get('/restaurants', async (req, res) => {
  try {
    let results = await getAllRestaurants();

    if (results.restaurants.lenght === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantById(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);

  return { restaurants: response };
}
app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);

  try {
    let results = await fetchRestaurantById(id);
    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found with id ' + id });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';

  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}
app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;

  try {
    let results = await fetchRestaurantByCuisine(cuisine);

    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants foound by cuisine ' + cuisine });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.messgae });
  }
});

async function filterRestaurants(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';

  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}
app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  try {
    let results = await filterRestaurants(isVeg, hasOutdoorSeating, isLuxury);

    if (results.restaurants.length === 0) {
      return res
        .status(404)
        .json({ message: 'No restaurants found based on your filter' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
async function sortByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';

  let response = await db.all(query, []);

  return { restaurants: response };
}
app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let results = await sortByRating();

    if (results.restaurants.length === 0) {
      return res.status(404).json({ messgae: 'No restaurants found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.messgae });
  }
});

async function allDishes() {
  let query = 'SELECT * FROM dishes';

  let response = await db.all(query, []);

  return { dishes: response };
}
app.get('/dishes', async (req, res) => {
  try {
    let results = await allDishes();

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dish found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDishById(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);

  try {
    let results = await getDishById(id);

    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dish found by id ' + id });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function filterDishes(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;

  try {
    let results = await filterDishes(isVeg);
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found ' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function sortDishesByPrice() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let results = await sortDishesByPrice();
    if (results.dishes.length === 0) {
      return res.status(404).json({ message: 'No dishes found' });
    }
    return res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
