const {check}=require('express-validator');


exports.userSignupValidator=[
    check('name').not().isEmpty().withMessage('name is required'),
    check('email').isEmail().withMessage('Unique email is required'),
    check('password').isLength({min:6}).withMessage('password must be of minimum 6 characters'),

];

exports.userSigninValidator=[
    check('email').isEmail().withMessage('Unique email is required'),
    check('password').isLength({min:6}).withMessage('password must be of minimum 6 characters'),

];