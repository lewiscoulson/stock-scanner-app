stock-scanner-app
=================

##Overview

This app allows a user to enter a ftse100 stock with an associated target buy price. Using a public api the stocks current price will be compared with the users target price in order to calculate the difference in price. This gives the user an indication of how under or over valued a stock is at a given time in relation to their own target price.

##Key Features
- Add new stock by entering the Company name, symbol and target price.
- Edit existing entry.
- Delete existing entry.
- View all entries.
- Sort entries by most over or under valued.

##Build steps
- npm install
- run 'grunt'
- run 'node app.js'
- view app at http://localhost:3000/
