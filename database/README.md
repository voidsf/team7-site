An adapter module to interface the site with a dummy SQLite database. Another module will be written when hosting solutions are finished that will interface with the PostGreSQL database.

# How to Use
If the packages aren't installed on your system, first run `npm install`

To run unit tests, ensure you are in the database directory and run `npx jest`

Before running site, build with `npm run build`, pack database with `npm pack` and drag tgz file into site folder. It's a scuffed way of fixing the requirements errors but it works