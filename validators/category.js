const {check}=require('express-validator');


exports.catagoryCreateValidator=[
    check('name').not().isEmpty().withMessage('name is required'),
   

];