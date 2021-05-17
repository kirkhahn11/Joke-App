set client_min_messages to warning;
-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;
create schema "public";
CREATE TABLE "Users" (
    "usersId" serial NOT NULL,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "password" text NOT NULL,
    CONSTRAINT "Users_pk" PRIMARY KEY ("usersId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "category" (
    "categoryId" serial NOT NULL,
    "name" text NOT NULL,
    CONSTRAINT "category_pk" PRIMARY KEY ("categoryId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "joke" (
    "jokeId" serial NOT NULL,
    "categoryId" integer NOT NULL,
    "userId" integer NOT NULL,
    "title" text NOT NULL,
    "approxMinutes" integer NOT NULL,
    "joke" text NOT NULL,
    CONSTRAINT "joke_pk" PRIMARY KEY ("jokeId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "setlist" (
    "setlistId" serial NOT NULL,
    "userId" integer NOT NULL,
    "setlistName" text NOT NULL,
    CONSTRAINT "setlist_pk" PRIMARY KEY ("setlistId")
) WITH (
  OIDS=FALSE
);
CREATE TABLE "setlistJokes" (
    "setlistId" serial NOT NULL,
    "jokeId" integer NOT NULL,
    CONSTRAINT "setlistJokes_pk" PRIMARY KEY ("setlistId","jokeId")
) WITH (
  OIDS=FALSE
);
ALTER TABLE "joke" ADD CONSTRAINT "joke_fk0" FOREIGN KEY ("categoryId") REFERENCES "category"("categoryId");
ALTER TABLE "joke" ADD CONSTRAINT "joke_fk1" FOREIGN KEY ("userId") REFERENCES "Users"("usersId");
ALTER TABLE "setlist" ADD CONSTRAINT "setlist_fk0" FOREIGN KEY ("userId") REFERENCES "Users"("usersId");
ALTER TABLE "setlistJokes" ADD CONSTRAINT "setlistJokes_fk0" FOREIGN KEY ("setlistId") REFERENCES "setlist"("setlistId");
ALTER TABLE "setlistJokes" ADD CONSTRAINT "setlistJokes_fk1" FOREIGN KEY ("jokeId") REFERENCES "joke"("jokeId");
