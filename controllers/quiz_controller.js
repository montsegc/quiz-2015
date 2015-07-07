var models = require('../models/models');

//load
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('NO existe quizId:' + quizId));
			}
		}
	).catch(function(error) { next(error); });
};

//GET /quizes
exports.index = function(req, res, next) {
	var busqueda = '%';
	if (req.query.search) {
		busqueda = '%'+req.query.search.replace(' ','%')+'%';
	}
	models.Quiz.findAll({
		where: ["pregunta LIKE ?",busqueda] 
		,order: [['pregunta', 'ASC']]
	}).then(
		function(quizes) {
			res.render('quizes/index', {quizes: quizes});
		}
	).catch(function(error) { next(error); });
};

//GET /quizes/:quizId(\\d+)
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

//GET /quizes/:quizId(\\d+)/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta && req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
		resultado= 'Corrrecto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
}

//GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "pregunta", respuesta: "respuesta"}
	);
	res.render('quizes/new',{quiz: quiz});
}

//GET /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	quiz.save({fields: ["pregunta","respuesta"]}).then(function(){
		res.redirect('/quizes');
	});
}

//GET /quizes/author
exports.author = function(req, res) {
	res.render('author');
}