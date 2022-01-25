const express = require('express');
const morgan = require('morgan');
const { Prohairesis } = require('prohairesis');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(morgan('dev'));
router.use(express.static('public'));
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


router.get('/', (req, res) => {
  res.render('index.ejs');
});

router.post('/add/team', (req, res) => {

  res.json(req.body);
});

module.exports = router;
