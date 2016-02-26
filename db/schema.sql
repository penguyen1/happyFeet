DROP TABLE if exists brand CASCADE;
DROP TABLE if exists users CASCADE;
DROP TABLE if exists sneakers CASCADE;
DROP TABLE if exists inventory CASCADE;

CREATE TABLE brand (
  brand_id serial PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  headquarters VARCHAR(255)
);

CREATE TABLE users (
  user_id serial PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  shoe_size integer, 
  balance numeric
);

CREATE TABLE sneakers (
  sneaker_id serial PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  brand_id integer REFERENCES brand ON DELETE CASCADE,
  retail_price numeric,
  resale_price numeric,
  description text
);

CREATE TABLE inventory (
  user_id integer REFERENCES users ON DELETE CASCADE,
  sneaker_id integer REFERENCES sneakers ON DELETE CASCADE,
  PRIMARY KEY (user_id, sneaker_id)
);