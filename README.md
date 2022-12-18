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

**Artist table** <br>
name - string, 
genre - string

**Album table** <br>
name - string, 
year - integer, 
artistId - foreign key

**Song table** <br>
name - string, 
artistId - foreign key, 
albumId - foreign key

## API end points

ACTION | URI | BODY CONTENT
-------|-----|-------------
Add ARTIST | `POST /artists` | name [string], genre [string]
Edit ARTIST | `PATCH /artists/:artistId` | name [string] and/or genre [string]
Delete ARTIST | `DELETE /artists/:artistId` | n/a
Get all ARTISTS | `GET /artists` | n/a
Get a single ARTIST | `GET /artists/:artistId` | n/a
Add ALBUM | `POST /artists/:artistId/albums` | name [string], year [integer]
Edit ALBUM | `PATCH /albums/:albumId` | name [string] and/or year [integer]
Delete ALBUM | `DELETE /albums/:albumId` | n/a
Get all ALBUMS | `GET /albums` | n/a
Get a single ALBUM | `GET /albums/:albumId` | n/a
Get all ALBUMS by an artist | `GET /artists/:artistId/albums` | n/a
Add SONG | `POST /albums/:albumId/song` | name [string]
Get all SONGS | `GET /songs` | n/a
Get a single SONG | `GET /songs/:songId` | n/a
Get all SONGS by an artist | `GET /artists/:artistId/songs` | n/a

## Status

This project is complete


