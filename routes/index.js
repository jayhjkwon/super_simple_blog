exports.index = function(req, res){
  res.render('index', { title: 'Express', posts:null, post:null});
};