const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env

const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;
 
const filmScheme = new Schema({name: String, 
    director: String, genre: String, date: Number}, 
    {versionKey: false});
const Film = mongoose.model("Film", filmScheme);
 
app.use(express.static(__dirname + "/public"));
 
// для отримання films
app.get("/api/films", function(req, res){
        
    Film.find({}, function(err, films){
        if(err) 
            return console.log(err);
        res.send(films)
    });
});
 
// для отримання film
app.get("/api/films/:id", function(req, res){
         
    const id = req.params.id;
    Film.findOne({_id: id}, function(err, film){       
        if(err) 
            return console.log(err);
        res.send(film);
    });
});
    
// для додавання film в базу даних
app.post("/api/films", jsonParser, function (req, res) {
        
    if(!req.body) 
        return res.sendStatus(400);
        
    const filmName = req.body.name;
    const filmDirector = req.body.director;
    const filmGenre = req.body.genre;
    const filmDate = req.body.date;
    const film = new Film({name: filmName, 
        director: filmDirector, genre: filmGenre, date: filmDate});
        
        film.save(function(err){
        if(err) 
            return console.log(err);
        res.send(film);
    });
});

// для вилучення films із бази даних
app.delete("/api/films/:id", function(req, res){
         
    const id = req.params.id;
    Film.findByIdAndDelete(id, function(err, film){            
        if(err) 
            return console.log(err);
        res.send(film);
    });
});

// для оновлення інформації про film
app.put("/api/films", jsonParser, function(req, res){
         
    if(!req.body) 
        return res.sendStatus(400);
    const id = req.body.id;
    const filmName = req.body.name;
    const filmDirector = req.body.director;
    const filmGenre = req.body.genre;
    const filmDate = req.body.date;
    const newFilm = {director: filmDirector, 
        name: filmName, genre: filmGenre, date: filmDate};
     
    Film.findOneAndUpdate({_id: id}, newFilm, {new: true}, 
        function(err, film){
        if(err) 
            return console.log(err); 
        res.send(film);
    });
});