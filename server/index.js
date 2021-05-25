require('dotenv/config');
const express = require('express');
const db = require('./db');
// const ClientError = require('./client-error');
// const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const app = express();

app.use(staticMiddleware);

app.use(express.json());

app.get('/api/jokeApp/categories', (req, res, next) => {
  const sql = `
  select "name",
         "categoryId"
    from "category"
    `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/jokeApp', (req, res, next) => {
  const sql = `
  select *, "c"."name"
  from "joke"
  join "category" as "c" using ("categoryId")
  `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/jokeApp/signIn', (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      error: 'Email and Password are required fields'
    });
    return;
  }
  const sql = `
  insert into "Users" ("email", "password")
  values ($1, $2)
  returning *
  `;
  const params = [email, password];
  db.query(sql, params)
    .then(results => {
      const [user] = results.rows;
      res.status(201).json(user);
    })
    .catch(err => next(err));
});

app.post('/api/jokeApp/category', (req, res) => {
  const { category } = req.body;
  if (!category) {
    res.status(400).json({
      error: 'category is a reqired field'
    });
    return;
  }
  const sql = `
  insert into "category" ("name")
  values ($1)
  returning *
  `;
  const params = [category];
  db.query(sql, params)
    .then(results => {
      const [category] = results.rows;
      res.status(201).json(category);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occured'
      });
    });
});

app.post('/api/jokeApp', (req, res) => {
  const { joke, title, categoryId } = req.body;
  const userId = 1;
  const approxMinutes = 0;
  if (!joke || !title) {
    res.status(400).json({
      error: 'Joke and Title are required fields'
    });
    return;
  }
  const sql = `
  insert into "joke" ("categoryId", "userId", "title", "approxMinutes", "joke")
  values ($1, $2, $3, $4, $5)
  returning *
  `;
  const params = [categoryId, userId, title, approxMinutes, joke];
  db.query(sql, params)
    .then(results => {
      const [newJoke] = results.rows;
      res.status(201).json(newJoke);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occured'
      });
    });
});

app.delete('/api/jokeApp', (req, res) => {
  const { jokeId } = req.body;
  if (!jokeId) {
    res.status(400).json({
      error: 'JokeId is a required field'
    });
    return;
  }
  const sql = `
  delete from "joke"
  where "jokeId"=$1
  returning *
  `;
  const params = [jokeId];
  db.query(sql, params)
    .then(results => {
      res.status(201).json(results.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occured'
      });
    });
});

app.patch('/api/jokeApp/:jokeId', (req, res) => {
  const { joke, title, approxMinutes, categoryId, jokeId } = req.body;
  if (!jokeId) {
    res.status(400).json({
      error: 'JokeId is a required field'
    });
    return;
  }
  if (!joke || !title || !approxMinutes || !categoryId) {
    res.status(400).json({
      error: 'All fields required'
    });
    return;
  }
  const sql = `
  update "joke"
  set "joke"=$1, "title"=$2, "approxMinutes"=$3, "categoryId"=$4
  where "jokeId"=$5
  returning *
  `;
  const params = [joke, title, approxMinutes, categoryId, jokeId];
  db.query(sql, params)
    .then(results => {
      res.status(201).json(results.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occured'
      });
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
