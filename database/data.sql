insert into "Users" ("username", "password")
values ('demoAccount', 'tempPassword');

insert into "category" ("name", "userId")
values ('Family', 1);

insert into "category" ("name", "userId")
values ('One-liner', 1);

insert into "joke" ("categoryId", "userId", "title", "approxMinutes", "joke")
values (1, 1, 'Momma Told Me', 2, 'My mom always tells me I never finish what I start so I tell her, look here mom... *walks away*');

insert into "joke" ("categoryId", "userId", "title", "approxMinutes", "joke")
values (2, 1, 'First Rule', 3, 'I feel like Fight Club and CrossFit have the exact opposite first rule');

insert into "setlist" ("userId", "setlistName")
values (1, 'March 3rd @ The Garden');

insert into "setlistJokes" ("setlistId", "jokeId")
values(1, 1);

insert into "setlistJokes" ("setlistId", "jokeId")
values (1, 2);
