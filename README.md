# Project #2: Happy Feet

### Overview

**Happy Feet** is a sneaker web application allowing users to create and budget an inventory of the hottest sneakers around. 

---

### User Story:

* Create a database with the following tables:
    * **Users** - stores user `name`, `shoe_size` & `balance`
    * **Brand** - stores brand `name` & `headquarters`
    * **Sneakers** - stores sneaker `name`, `brand_id`, `retail_price`, `resale_price`, a brief `description` & `img_url`
    * **Inventory** - joins Sneakers & Users tables storing `user_id` & `sneaker_id`
* Create the following views:
    * **Login** - first page a user sees. displays login form for all visitors
    * **New User** - displays user registration for all new users 
    * **User Page** - user's homepage displaying inventory of their sneakers
    * **All Sneakers** - displays all sneakers queried from user's search
    * **Sneaker** - displays profile of a sneaker
    * **Add Sneaker** - displays sneaker form allowing user to add | edit a sneaker
    * **Error** - displays error message and redirects user to New User page if user's email is not in the database
* List of buttons:
    * **Login** - authenicates & pulls appropriate user information
    * **Logout** - terminates user's session
    * **New User** - displays user registration form to create a new user 
    * **Add Sneaker** - displays sneaker form to create & add a new sneaker 
    * **Edit** - edits current sneaker information
    * **Delete** - removes current sneaker from database

---

### RESTful Routes

## Resourse: `/users`
* create table chart for (users) get, post, put, delete routes  

||Friendly Name| Method | Route Name | What will Happen? | 
|---|---|---|---|---|
|1|Show Login Form | GET  | `/` | `users/login.ejs` | 
|2|Authenicate User login | POST | `/login` | call `db.loginUser`, redirect to `/sneakers/:id` |
|3|Show New User Form | GET | `/new` | `users/new_user.ejs` |
|4|Create a New User | POST | `/` | call `db.createUser`, redirect to `/` login page |
|6|Logout | DELETE | `/logout` | redirect back to `/` login page |


## Sneakers
* create table chart for (sneakers) get, post, put, delete routes


---
### Softwares Used:

* ** Express.js **
* ** Node.js **
* ** PostgreSQL **
* ** JavaScript **
* ** BootStrap **
