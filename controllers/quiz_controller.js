var models = require('../models/models');

//load
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		where: {id: Number(quizId)}
		,include: [{model: models.Comment }]
	})
	.then(
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
			res.render('quizes/index', {quizes: quizes, errors: []});
		}
	).catch(function(error) { next(error); });
};

//GET /quizes/:quizId(\\d+)
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/:quizId(\\d+)/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta && req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
		resultado= 'Corrrecto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
}

//GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "pregunta", respuesta: "respuesta", tipo: "otro"}
	);
	res.render('quizes/new',{quiz: quiz, errors: []});
}

//GET /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/new',{quiz: quiz, errors: err.errors});
			} else {
				quiz.save({fields: ["pregunta","respuesta","tipo"]}).then(function(){
					res.redirect('/quizes');
				});
			}
		}
	);
}

//GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;
	res.render('quizes/edit',{quiz: quiz, errors: []});
}

//PUT /update/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tipo = req.body.quiz.tipo;

	req.quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz.save({fields: ["pregunta","respuesta","tipo"]}).then(function(){
					res.redirect('/quizes');
				});
			}
		}
	);
}

//DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(
		function(){	
			res.redirect('/quizes');
		}
	).catch(function(error){next(error);});
}


//GET /quizes/author
exports.author = function(req, res) {
	res.render('author',{ errors: []});
}