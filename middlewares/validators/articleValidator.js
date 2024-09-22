const { body } = require('express-validator');

module.exports = [
  body('title')
    .notEmpty().withMessage('Le titre est requis.')
    .isLength({ max: 255 }).withMessage('Le titre ne doit pas dépasser 255 caractères.'),
  
  body('content')
    .notEmpty().withMessage('Le contenu est requis.')
];
