const express = require('express');
const morgan = require('morgan');
const store = require('./playstore.js');
const cors = require('cors');


const app = express();
app.use(morgan('dev'));
app.use(cors());


app.get('/', (req, res) => {
    res.send('Hello Express!');
});

app.get('/apps', (req, res) => {
    //1. get values from the request

    const sort = req.query.sort;
    const genre = req.query.genre;
    let filtered_store = store;

    //2. validate the values

    if (genre !== undefined) {
        if (genre.toLowerCase() !== 'action' && genre.toLowerCase() !== 'puzzle' && genre.toLowerCase() !== 'strategy' && genre.toLowerCase() !== 'casual' && genre.toLowerCase() !== 'arcade' && genre.toLowerCase() !== 'card') {
            return res.status(400).send('can only filter by Action,Puzzle,Strategy,Casual,Arcade,or Card');
        }
        filtered_store = store.filter(app => {
            return app.Genres.includes(genre.charAt(0).toUpperCase() + genre.slice(1));
        });
    }

    if (sort !== undefined) {
        if (sort.toLowerCase() !== 'rating' && sort.toLowerCase() !== 'app') {
            return res.status(400).send('Can only sort by rating or app');
        }
        else if (sort.toLowerCase() === 'rating') {
            filtered_store.sort(function (a, b) {
                return b.Rating - a.Rating;
            });
        }
        else if (sort.toLowerCase() === 'app') {
            filtered_store.sort(function (a, b) {
                // if (a.App < b.App) { return -1; }
                // if (a.App > b.App) { return 1; }
                // return 0;
                return a.App.localeCompare(b.App)
            });
        }
    }



    res
        .json(filtered_store);

});


module.exports = app;
