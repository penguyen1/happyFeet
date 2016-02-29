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
  shoe_size numeric, 
  balance numeric
);

CREATE TABLE sneakers (
  sneaker_id serial PRIMARY KEY UNIQUE,
  name VARCHAR(255),
  brand_id integer REFERENCES brand ON DELETE CASCADE,    -- how to get brand name from brand_id ???
  retail_price numeric,     
  resale_price numeric,
  description VARCHAR(255),
  img_url VARCHAR(255)
);

CREATE TABLE inventory (
  user_id integer REFERENCES users ON DELETE CASCADE,
  sneaker_id integer REFERENCES sneakers ON DELETE CASCADE,
  PRIMARY KEY (user_id, sneaker_id)
);