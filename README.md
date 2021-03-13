# Music Library API project

A Manchester Codes project to set up a music library API using an ExpressJS app connected to a MySQL database via Sequelize.

## Concepts explored

* Databases & database design
* SQL in general & MySQL in particular
* Using Sequelize to interact with the database
* Database querying and standard CRUD operations
* Building our application in a Docker container
* Using MySQL Workbench to set up the initial database
* Using Postman to manage API requests
* Testing our code with Mocha / Chai
* Using environment variables to store sensitive information and how Dotenv is helpful in that regard
* Using Nodemon to restart the Node application automatically after code changes

## The database

We used a local MySQL database inside a Docker container.
The database has the following structure:

**Artist table**
name - string
genre - string

**Album table**
name - string
year - integer
artistId - foreign key

**Song table**
name - string
artistId - foreign key
albumId - foreign key

## API end points
**ADD ARTIST** `POST /artists` Body: "name" <string>, "genre" <string>
**ADD ALBUM** `POST /artists/:artistId/albums`  Body: "name" <string>, "year" <integer>
**ADD SONG** `POST /albums/:albumId/song Body: "name" <string>

 


