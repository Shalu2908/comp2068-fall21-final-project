// Imported express and created router object
const express = require('express');
const { render } = require('../app');

// it initializes the router
const router = express.Router();

// imported model into router
const Patient = require('../models/patient');
const Category = require('../models/category');

// middleware function to stop the anonymous user to get access through url
function IsLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        // if user is authenticated, user can continue the processing
        return next();
    }
    res.redirect('/login');

}

// Route for GET to /patientsList/AddNewPatient
router.get('/addNewPatient', IsLoggedIn, (req, res, next) => {
    Category.find((err, categories)=>{
        if(err) {
            console.log(err);
        }
        else {
            res.render('patientsList/addNewPatient', {
                title: 'Add a new Patient',
                categories: categories,
                user: req.user
            });
        }
    }).sort({name: 1});
});

// Add GET for index, added the middleware function to connect the patientsList Page
router.get('/', IsLoggedIn, (req, res, next) => {
    // find method helps to recieve error messageand  get the list of database object
    Patient.find((err, patientsLists) =>
    {
        if (err)
        {
            console.log(err);
        }
        else
        {
            res.render('patientsList/index', { title: 'Patients List' , dataset : patientsLists, user: req.user});
        }
    })

});


// Added post handler to add new patient
router.post('/addNewPatient', IsLoggedIn, (req, res, next) => {
    Patient.create(
        {
            name: req.body.name,
            date: req.body.date,
            category: req.body.category
        },
        (err, newPatient) =>
        {
            if (err) {
                console.log(err);
            }
            else {
                // redirected the response to patientsList Page
                res.redirect('/patientsList');
            }
        }

    )
});


// this is GET handler for /patientsList/delete
router.get('/delete/:_id', IsLoggedIn,(req, res)=>{
    let _id = req.params._id

    // use mongoose to delete the document & redirect
    Patient.remove({_id: _id }, (err)=>
    {
        if(err){
            console.log(err)
            res.end(err)
        }
        else{
            res.redirect('/patientsList')
        }
    })
})

// GET handler for Edit operations
router.get('/edit/:_id', IsLoggedIn, (req, res, next) => {
    Patient.findById(req.params._id, (err, patientsLists) => {
        if (err) {
            console.log(err)}
        else {
            Category.find((err, categories) => {
                if (err) {
                    console.log(err);}
                else {
                    res.render('patientsList/edit', {
                        title: 'Edit a Patient Information.',
                        patientsLists: patientsLists,
                        categories: categories,
                        user: req.user});
                }
            }).sort({ name: 1 });
        }
    })
})

// POST handler for patientsList/Edit
router.post('/edit/:_id', IsLoggedIn, (req,res,next) => {
    Patient.findOneAndUpdate({_id: req.params._id}, {
        name: req.body.name,
        date: req.body.date,
        category: req.body.category,
        status: req.body.status
    }, (err, updatedPatient) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/patientsList');
        }
    })
})

// Exported router module here
module.exports = router;
