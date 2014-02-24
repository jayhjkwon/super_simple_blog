var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var post = require('./routes/post');
var sm = require('sitemap');

var app = express();

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/api/posts', post.getAllPosts);
app.put('/api/posts/:post_id', post.editPost);
app.post('/api/posts', post.addPost);
app.delete('/api/posts/:post_id', post.deletePost);

/* --> start : fallback for users without javascript */
app.get('/posts', post.renderPosts);
app.get('/posts/:post_id', post.renderPost);
app.get('/posts', routes.index);
app.get('/posts/:post_id', routes.index);
app.get('/posts/edit/:post_id', routes.index);
app.get('/posts/new', routes.index);
/* <-- end : fallback for users without javascript */

app.get('/sitemap.xml', function(req, res) {
  var fullURL = req.protocol + "://" + req.get('host');// + req.url + ':' + app.get('port');

  var sitemap = sm.createSitemap ({
    hostname: fullURL,  // 'http://localhost:3000',
    cacheTime: 600000,        // 600 sec - cache purge period
    urls: [
      { url: '',  changefreq: 'daily'},
      { url: '/posts',  changefreq: 'daily'}
    ]
  });

  sitemap.toXML( function (xml) {
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
