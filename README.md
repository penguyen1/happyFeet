# Project #2: Happy Feet

### Overview

**Happy Feet** is a sneaker web application allowing users to create and budget an inventory of the hottest sneakers around. 

### NEED TO DO:
* include ERD image
* include Wireframe pages
* installation manual
* Sneaker app description summary (maybe change name?)
    * What can the user do?
    * What are the features?
* create issues

---

### User Story:

* Create a database with the following tables:
    * **Users** - stores user `name`, `shoe_size` & `balance`
    * **Brand** - stores brand `name` & `headquarters`
    * **Sneakers** - stores sneaker `name`, `brand_id`, `retail_price`, `resale_price`, a brief `description` & `img_url`
    * **Inventory** - joins Sneakers & Users tables storing `user_id` & `sneaker_id`
![](./images/ERD.pdf)
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
* table chart of routes for `/users`

||Friendly Name| Method | Route Name | What will Happen? | 
|---|---|---|---|---|
|1|Show Login Form | GET  | `/` | `users/login.ejs` | 
|2|Authenicate User login | POST | `/login` | call `db.loginUser`, redirect to `/sneakers/:id` |
|3|Show New User Form | GET | `/new` | `users/new_user.ejs` |
|4|Create a New User | POST | `/` | call `db.createUser`, redirect to `/` login page |
|6|Logout | DELETE | `/logout` | redirect back to `/` login page |


## Sneakers
* table chart of routes for `/sneakers`

||Friendly Name| Method | Route Name | What will Happen? | 
|---|---|---|---|---|
|1|Show Login Form | GET  | `/` | `users/login.ejs` | 
|2|Authenicate User login | POST | `/login` | call `db.loginUser`, redirect to `/sneakers/:id` |
|3|Show New User Form | GET | `/new` | `users/new_user.ejs` |
|4|Create a New User | POST | `/` | call `db.createUser`, redirect to `/` login page |
|6|Logout | DELETE | `/logout` | redirect back to `/` login page |

---

### pg.js Functions

--- 

### Project 2 Requirements:
* **Have at _least_ 2 models:** 
    * ~~users~~
    * sneakers
* ~~**Include sign up/log in functionality**, with encrypted passwords & an authorization flow. (Using Bcrypt)~~
* **Have complete RESTful routes:** 
    * ~~GET~~
    * ~~POST~~
    * PUT
    * ~~DELETE~~
* ~~**Write full SQL queries using PG module or PG-promise module**~~
* **Include wireframes** that you designed during the planning process
* ~~**Include User Stories**~~
* ~~**Include ERDs**~~
* ~~Have **semantically clean HTML and CSS**~~ *(always)*
* **Be deployed online** and accessible to the public

---

### Softwares Used:

* ** Express.js **
* ** Node.js **
* ** PostgreSQL **
* ** JavaScript **
* ** BootStrap **
