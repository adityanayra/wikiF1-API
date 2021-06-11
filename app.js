const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs");

const app = express()

app.set("view-engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true,useUnifiedTopology: true });

const wikiSchema = {
    title: String, 
    content: String
};

const article = mongoose.model("article", wikiSchema);
///////////////////////////requesting all article/s/////////////////////////////////////////////////

app.route("/articles")
    .get(function(req, res){
        article.find({}, function(err, docs){
            if(!err) res.send(docs);
            else res.send(err); 
        });
    })    
    .post(function(req, res){
        
        const newarticle = new article({
            title: req.body.title,
            content: req.body.content
        });
        newarticle.save(function(err){
            if(err) res.send(err);
            else res.send("successfully added a new article");
        });
    })    
    .delete(function(req, res){
        article.deleteMany({}, function(err){
            if(!err) res.send("Successfully deleted all articles")
            res.send(err)
        });
    });
////////////////////////////////Requesting specific article/s////////////////////////////////////////    

app.route("/articles/:articletitle")

    .get(function(req, res){
        const getTitle = req.params.articletitle;
        article.findOne({title: getTitle}, function(err, docs){
            if(!err) res.send(docs);
            else res.send("NO articles related were found!");
        });
    })

    .put(function(req, res){
        article.update({title: req.params.articletitle}, {
            title: req.body.title,
            content: req.body.content 
        },
        {overwrite: true},
        function(err){
            if(!err) res.send("successfully updated the article");
        
        });
    })

    .patch(function(req, res){
        article.update(
            {title: req.params.articletitle},
            {$set: req.body}, function(err){
                if(!err) res.send("Updated successfully using patch!")
                else res.send(err);
            } 

        )
    })
    .delete(function(req, res){
        article.deleteOne({title: req.params.articletitle},function(err){
            if(!err){
                res.send("deleted successfully!");
            }else res.send(err);
        });
    })


// Listening at ROOT
app.listen(3030, function(req, res){
    console.log("waiting at port 3030");
});