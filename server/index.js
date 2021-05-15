require('dotenv/config');
const express = require('express');
const db = require('./db');
// const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');

const app = express();

app.use(staticMiddleware);

app.use(express.json());

app.get('/api/jokeApp', (req, res, next) => {
  const sql = `
  select "name",
         "categoryId"
    from "category"
    `;
  db.query(sql)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.post('/api/jokeApp', (req, res) => {
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
