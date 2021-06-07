require('dotenv/config');
const express = require('express');
const argon2 = require('argon2');
const db = require('./db');
const ClientError = require('./client-error');
const jwt = require('jsonwebtoken');
const errorMiddleware = require('./error-middleware');
const staticMiddleware = require('./static-middleware');
const authorizationMiddleware = require('./authorization-middleware');

const app = express();

app.use(staticMiddleware);

app.use(express.json());

app.post('/api/jokeApp/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(400, 'username and password are required fields');
  }

  argon2
    .hash(password)
    .then(hashedPassword => {
      const sql = `
  insert into "Users" ("username", "password")
  values ($1, $2)
  returning "usersId", "username"
  `;
      const params = [username, hashedPassword];

      db.query(sql, params)
        .then(result => {
          const [user] = result.rows;
          const { usersId, username } = user;
          const payload = { usersId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        })
        .catch(err => next(err));
    });
});

app.use(authorizationMiddleware);

app.get('/api/jokeApp/categories', (req, res, next) => {
  const { usersId } = req.user;
  const sql = `
  select "categoryId", "name"
  from "category"
  where "userId" = $1
    `;
  const params = [usersId];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/jokeApp', (req, res, next) => {
  const { usersId } = req.user;
  const sql = `
  select *, "c"."name"
  from "joke" as "j"
  join "category" as "c" using ("categoryId")
  where "j"."userId" = $1
  `;
  const params = [usersId];
  db.query(sql, params)
    .then(result => res.json(result.rows))
    .catch(err => next(err));
});

app.get('/api/jokeApp/setlists', (req, res, next) => {
  const { usersId } = req.user;
  const sql = `
  with jokes as (
    select s."setlistId", array_to_json(array_agg(json_build_object('jokeId', s."jokeId", 'title', s."title", 'approxMinutes', s."approxMinutes"))) as matching
    from (
      select
        "sj"."setlistId",
        "jk"."jokeId",
        "title",
        "joke",
        "approxMinutes"
      from "joke" as "jk"
      join "setlistJokes" as "sj" using ("jokeId")
    ) as "s"
    group by "s"."setlistId"
  )
  select
      "setlistId",
      "setlistName",
      coalesce((select matching from "jokes" where "jokes"."setlistId" = "sl"."setlistId"),
      '[]'::json) as "jokes"
      from "setlist" as "sl"
      where "sl"."userId" = $1;
  `;
  const params = [usersId];
  db.query(sql, params)
    .then(results => res.json(results.rows))
    .catch(err => next(err));
});

app.post('/api/jokeApp/category', (req, res) => {
  const { usersId } = req.user;
  const { category } = req.body;
  if (!category) {
    res.status(400).json({
      error: 'category is a reqired field'
    });
    return;
  }
  const sql = `
  insert into "category" ("name", "userId")
  values ($1, $2)
  returning *
  `;
  const params = [category, usersId];
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
  const { usersId } = req.user;
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
  const params = [categoryId, usersId, title, approxMinutes, joke];
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

app.post('/api/jokeApp/setlist', (req, res, next) => {
  const { name, jokeId } = req.body;
  const { usersId } = req.user;
  if (!name || !jokeId) {
    res.status(400).json({
      error: 'JokeId and name are required field'
    });
    return;
  }
  const sql = `
  insert into "setlist" ("setlistName", "userId")
  values ($1, $2)
  returning *
  `;
  const params = [name, usersId];
  db.query(sql, params)
    .then(results => {
      const { rows: [newSetlist] } = results;
      const params = [newSetlist.setlistId];
      const jokeInserts = jokeId.map(id => {
        params.push(id);
        return `($1, $${params.length})`;
      });
      const jokeSql = `
      insert into "setlistJokes"
        ("setlistId", "jokeId")
        values
          ${jokeInserts.join(', ')}
      `;
      db.query(jokeSql, params)
        .then(results => {
          const [newSetlistJoke] = results.rows;
          res.status(201).json(newSetlistJoke);
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
});

app.post('/api/jokeApp/setlistJokes', (req, res, next) => {
  const { setlistId, jokeId } = req.body;
  if (!setlistId || !jokeId) {
    res.status(400).json({
      error: 'JokeId and setlistId are required field'
    });
    return;
  }
  const params = [setlistId];
  const jokeInserts = jokeId.map(id => {
    params.push(id);
    return `($1, $${params.length})`;
  });
  const setlistSql = `
      insert into "setlistJokes"
        ("setlistId", "jokeId")
        values
          ${jokeInserts.join(', ')}
      `;
  db.query(setlistSql, params)
    .then(results => {
      const [updatedSetlist] = results.rows;
      res.status(201).json(updatedSetlist);
    })
    .catch(e => next(e));
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

app.delete('/api/jokeApp/setlist', (req, res, next) => {
  const { setlistId } = req.body;
  if (!setlistId) {
    res.status(400).json({
      error: 'setlistId is a required field'
    });
    return;
  }
  const sql = `
  delete from "setlistJokes"
  where "setlistId"=$1
  returning *
  `;
  const params = [setlistId];
  db.query(sql, params)
    .then(results => {
      const setlistSql = `
      delete from "setlist"
      where "setlistId"=$1
      returning *
      `;
      db.query(setlistSql, params)
        .then(results => {
          res.status(201).json(results.rows);
        })
        .catch(e => next(e));
    })
    .catch(e => next(e));
});

app.delete('/api/jokeApp/setlistJokes', (req, res, next) => {
  const { setlistId, jokeId } = req.body;
  if (!setlistId || !jokeId) {
    res.status(400).json({
      error: 'setlistId and jokeId are required fields'
    });
    return;
  }
  const sql = `
  delete from "setlistJokes"
  where "setlistId"=$1 and "jokeId"=$2
  returning *
  `;
  const params = [setlistId, jokeId];
  db.query(sql, params)
    .then(results => {
      res.status(201).json(results.rows);
    })
    .catch(e => next(e));
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
