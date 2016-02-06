/**
 * Author: Rafiul Sabbir
 * Created on 2/6/2016.
 */

//basic package calls
var express = require('express');
var app = express();
var bodyParser = require('body-parser');


//setup for mongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/herolocker');
//mongoose.connect('mongodb://iamrafiul:ami420@apollo.modulusmongo.net:27017/atow7iJo');
//mongoose.connect('mongodb://<user>:<pass>@apollo.modulusmongo.net:27017/atow7iJo');

var Hero = require('./app/models/hero');

//configuration for bodyParser()
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//Routes for the API
var router = express.Router();

//middleware for all the requests
//print a single line log in the console
router.use(function(req, res, next) {
    console.log('Something is happeing in the server');
    next(); //Make sure we go to the next routes and don't stop here
});

//test route to make sure everything is working fine!
router.get('/', function(req, res) {
    res.json({ message : 'YES!! The API is working!!'});
});

//on routes that end in /heros

router.route('/heros')
    //create a hero (accessed at POST http://localhost:8080/api/heros)
    .post(function(req, res){
        var hero = new Hero();   //Create a new instance of the Hero model
        hero.name = req.body.name; //Set the hero name(comes from the user request

        //save the hero and check for errors
        hero.save(function(err) {
            if (err) {
                res.send(err);
            }

            res.json({ message : 'Hero Created!'});
        });
    })

    //get all the heros(accessed at GET http://locahost:8080/api/heros)
    .get(function(req, res) {
        Hero.find(function(err, heros) {
            if (err) {
                res.send(err);
            }

            res.json(heros);
        });
    });

router.route('/heros/:hero_id')
    //get the hero of that id(accessed at GET http://locahost:8080/api/heros/:hero_id)
    .get(function(req, res) {
        Hero.findById(req.params.hero_id, function(err, hero) {
            if (err) {
                res.send(err);
            }

            res.json(hero);
        });
    })

    //update the hero with this id(access at PUT http://localhost:8080/api/heros/:hero_id)
    .put(function(req, res) {
        //update the hero model to find the hero we want
        Hero.findById(req.params.hero_id, function (err, hero) {
            if (err) {
                res.send(err);
            }

            hero.name = req.body.name;
            hero.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({message: 'Hero Updated!'});
            });
        });
    })

    //delete the bear with this id(accessed at DELETE http://localhost:8080/api/heros/:hero_id)
    .delete(function(req, res) {
        Hero.remove({
            _id: req.params.hero_id
        }, function(err, hero) {
            if (err) {
                res.send(err);
            }
            res.json({ message : 'Successfully deleted!' });
        });
    });

//all of our routes will be prefixed with /api
app.use('/api', router);

//start server
app.listen(port);
console.log('The server is running on port: ' + port);