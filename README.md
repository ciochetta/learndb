# LuisDB

> My study on how to create a database

Hello, this is the repository for my database project, I am trying to learn how to create a database from scratch using Node.js

My objective is to understand a little better how databases work internally

## Installation

You need to have Node.js and NPM to install and use this project

```sh
npm i learndb
```

## Usage

you can use this in two ways, either as an REPL or as a driver for the database

### REPL

If you want to use this project as a REPL I would adivise to clone it instead of installing it, if you have it cloned, to access the REPL, all you need to do is type this on the terminal:

```sh
node index.js repl
```

### REPL Commands

#### using [database name]

Either loads a database from the directory you are currently in or creates a database with the specified name if none exists

Example: using test

#### create [table name] [columns names]

creates a new table in the database with the specified columns

Example:

```sh
create users username password
```

#### insert [table name] [columns values]

inserts a new document in the specified table with the values passed

Example:

```sh
insert users luis p4ssw0rd
```

#### select [columns name or *] From [table name] [where?]

returns an array with the specified columsn from the database

Example:

```sh
select username from users
```

#### where [key] [operator] [value]

optional parameter for the select command, compares the values from the table with the ones informed using the informed operator

Example:

```sh
select username from users where name = luis
```

### Driver

to use this project as a driver, you need to install it on your project, require it from the modules:

```js
const LuisDB = require("learndb");
```

and then you have access the same same commands from the repl but with objects (kinda like mongodb)

there is only one function currently that transforms the objects into database actions

evalObject

It acepts one parameter that should have this structure:

```js
{
	type: "keyword",
	params: keywordparams
}
```

I actually have an repo with a test I've made using this database as a driver, this should help understand how it works

https://github.com/ciochetta/testing-luisdb

### Driver keywords and params

### Using

#### Params: database name

Example

```js
LuisDB.evalObject({
	type: "using",
	params: "databasename",
});
```

### Using

#### Params: table, columns

```js
LuisDB.evalObject({
	type: "create",
	params: {
		table: "students",
		columns: ["name", "grade"],
	},
});
```

### Insert

#### Params: table, document

```js
LuisDB.evalObject({
	type: "insert",
	params: {
		table: "students",
		document: ["luis", 7],
	},
});
```

## To do

These are the things I want to implement in this project, in order of importance

- write documentation for: UPDATE, DELETE, BULK INSERT, CREATE INDEX
- move documentation to another file
- Support indexing
- Create a CLI for global use
- Create an authentication system
- Support partitioning
- Support migration from SQL schemas

## Devlog

I am documenting this project on Dev.to, in this url:

https://dev.to/ciochetta/series/10300

## Resources

Every resource I've used to study for this project, not in any particular order:

https://www.stefanjudis.com/today-i-learned/how-to-create-your-own-node-js-repl/

https://nodejs.org/api/repl.html

https://cstack.github.io/db_tutorial/parts/part1.html

https://www.youtube.com/watch?v=WNKw1tiskSM

https://github.com/oguimbal/pgsql-ast-parser

https://youtube.com/watch?v=TOb1tuEZ2X4
