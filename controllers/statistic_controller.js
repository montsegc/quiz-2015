var models = require('../models/models');
var Promise = require('promise');

//GET /quizes/statistics
exports.show = function(req, res, next) {

	var statistics = {};

	// numero preguntas
	var pNumQuiz = models.Quiz.count();
	// numero comentarios publicados
	var pNumPublishComment = models.Comment.count({
			where: {publicado: true}
		});
	// numero preguntas con comentarios
	var pQuizWithComment = models.Quiz.count({
			where: ['EXISTS (SELECT c.id FROM "Comments" c WHERE "Quiz"."id" = c."QuizId" and c."publicado")']
		});

	Promise.all([pNumQuiz, pNumPublishComment, pQuizWithComment])
	  .then(function (result) {
	    statistics.numQuizs = result[0];
	    statistics.numComments = result[1];
	    //numero medio de comentarios publicados por pregunta
	    statistics.avgComments = 0;
	    if (statistics.numQuizs > 0) {
	 		statistics.avgComments = statistics.numComments / statistics.numQuizs;
		}
	    statistics.numQuizsWithComments = result[2];
	    // numero preguntas sin comentarios publicados
		statistics.numQuizsWithoutComments = statistics.numQuizs - statistics.numQuizsWithComments;
		res.render('statistics/show', {statistics: statistics, errors: [] });
	  }
	  ,function(error) {
	  	next(error);
	  }
	  ).catch(function(error) { next(error); });


	// // numero preguntas
	// statistics.numQuizs = 0;
	// models.Quiz.count().then(function(count){
	// 	statistics.numQuizs = count;

	// 	// numero comentarios
	// 	statistics.numComments = 0;
	// 	models.Comment.count().then(function(count){
	// 		statistics.numComments = count;

	// 		// numero medio de comentarios por pregunta
	// 		statistics.avgComments = 0;
	// 		if (statistics.numComments > 0) {
	// 			statistics.avgComments = statistics.numQuizs / statistics.numComments;
	// 		}

	// 		// numero preguntas con comentarios
	// 		statistics.numQuizsWithComments = 0;
	// 		models.Quiz.count().then(function(count){
	// 			statistics.numQuizsWithComments = count;

	// 			// numero preguntas sin comentarios
	// 			statistics.numQuizsWithoutComments = statistics.numQuizs - statistics.numQuizsWithComments;

	// 			res.render('statistics/show', {statistics: statistics, errors: [] });

	// 		}).catch(function(error) { next(error); });

	// 	}).catch(function(error) { next(error); });

	// }).catch(function(error) { next(error); });
};