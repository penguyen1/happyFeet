# Project #2: Happy Feet

### Overview

**Happy Feet** is a sneaker web application allowing users to create and budget an inventory of the hottest sneakers around. 

---

### User Story:

* Create a database with the following tables:
    * **Users** - stores user `name`, `budget`, `shoe_size` & `balance`
    * **Brand** - stores brand `name`, `founder` & `headquarters`
    * **Sneakers** - stores sneaker `name`, `brand`, `retail_price`, `resale_price` & a brief `description` of the sneaker
    * **Inventory** - joins Sneakers & Users tables storing `user_id` & `sneaker_id`
* Create the following views:
    * **Welcome** - home page for all visitors with a login form 
    * **Homepage** - user's homepage displaying inventory of all their sneakers
    * **All_Sneakers** - displays all sneakers queried from user's search
    * **Sneaker** - displays profile of a sneaker
    * **Sneaker_form** - allows user to add | edit sneaker form
* Buttons:
    * **Login** - authenicates & pulls appropriate user information
    * **Logout** - terminates user's session
    * **New User** - displays user registration form to create a new user 
    * **Add Sneaker** - displays sneaker form to create & add a new sneaker 
    * **Edit** - edits current sneaker information
    * **Delete** - removes current sneaker from database

---

### Programs & Softwares Used:

* ** Express.js **
* ** Node.js **
* ** PostgreSQL **
* ** JavaScript **
* ** BootStrap **
