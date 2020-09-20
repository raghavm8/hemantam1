var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var PORT = 4000
var methodOverride = require('method-override');
//var expressSanitizer = require('express-sanitizer');

// express configuration
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));
//app.use(expressSanitizer);

// mongoose configuration
mongoose.connect("mongodb://localhost/profile",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
var profileSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : { type: Date, default: Date.now }
})
var profile = mongoose.model('profile',profileSchema);

// Routes

app.get('/',function(req,res){
    res.redirect('/profiles')
})

// NEW route
app.get('/profiles/new',function(req,res){
    res.render('new')
})

// CREATE route
app.post('/profiles',function(req,res){
    //req.body.profile.body = req.sanitizer(req.body.profile.body);
    profile.create(req.body.profile,function(err,newB){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/profiles')
        }
    })
})

// SHOW route
app.get('/profiles/:id',function(req,res){
    profile.findById(req.params.id,function(err,foundprofile){
        if(err)
        {
            res.redirect('/profiles')
            console.log(err);
        }
        else
        {
            res.render('show',{profile:foundprofile})
        }
    })
})

// EDIT route
app.get('/profiles/:id/edit',function(req,res){
    profile.findById(req.params.id, function(err,found){
        if(err){
            console.log(err)
            res.redirect('/profiles')
        }
        else{
            res.render('edit',{profile:found})
        }
    })
})

// UPDATE route
app.put('/profiles/:id',function(req,res){
    //res.send('update route');
    profile.findByIdAndUpdate(req.params.id,req.body.profile,function(err,updated){
        if(err){
            console.log(err)
            res.redirect('/profiles');
        }
        else{
            res.redirect('/profiles/'+req.params.id);
        }
    })
})

// DELETE route
app.delete('/profiles/:id',function(req,res){
    //res.send('this is the delete route')
    profile.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
            res.redirect('/profiles')
        }
        else{
            res.redirect('/profiles')
        }
    })
})

app.get('/profiles',function(req,res){
    profile.find({},function(err,all){
        if(err){
            console.log(err)
        }
        else{
            res.render('index',{profiles:all});
        }
    })
})


app.listen(PORT, () => {
    console.log('server has started');
})