var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: [] });
});

//load de rutas con parametro :quizId
router.param('quizId',quizController.load);

// rutas /quizes
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes', quizController.index);
router.get('/author', quizController.author);
router.get('/quizes/new',quizController.new);
router.post('/quizes/create',quizController.create);

module.exports = router;
