# EcoSort Web App

This is an app based on the HeroUI base project, licensed under the MIT license as per the LICENSE file.

## Use
Create a .env file and include a `SESSION_SECRET`, it can be whatever but ideally it should be a 32-char encrypted string
Build and pack the database module, then drag the .tgz file into the /site/ folder
Create a database, ideally import database to a node terminal in /site/ and run `createDatabase("database.db")`
Run with `npm run dev`