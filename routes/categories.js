// imported the modules
const express = require('express');
const router = express.Router();

// imported model to access the collection from dataset
const Category = require('../models/category');


// middleware function to stop the for anonymous through url
function IsLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        // if user is authenticated, user can continue the processing
        return next();
    }
    res.redirect('/login');

}

// defined routes and middleware
router.get('/', IsLoggedIn, (req, res, next) =>
{
    // categories here are returning the list of categories
    Category.find((err, categories)=>
    {
        if(err){
            console.log(err);
        }
        else
        {
            // sending the list of categories back to the view
            res.render('categories/index', {title: 'Category List', dataset : categories, user: req.user});
        }
    });

});

// GET handler to add new category
router.get('/addCategory', IsLoggedIn, (req, res, next) =>{
    res.render('categories/addCategory', {title: 'Add a new Category', user: req.user});
});

// Added post handeler to add new category
router.post('/addCategory', IsLoggedIn, (req, res, next) => {
    Category.create(
        {
            name: req.body.name
        },
        (err, newCategory) =>
        {
            if (err) {
                console.log(err);
            }
            else {
                // redirected the response to categories List Page
                res.redirect('/categories');
            }
        }

    )
});

// exported the module
module.exports = router;