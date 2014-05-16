'use strict';

// Module dependencies.
var express = require('express'),
  path = require('path'),
  //pem = require('pem'),
  https = require('https'),
  expressValidator = require('express-validator');

var app = express();

// Controllers
var api = require('./lib/controllers/api');
var tools = require('./lib/controllers/tools');

// Express Configuration
app.configure(function(){
  //app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        type: 'danger',
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  })); // this line must be immediately after express.bodyParser()!
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser('MBSystem.1*'));
  app.use(express.cookieSession({cookie: {secure: true}}));
  app.use(function(req,res,next){
    tools.useXSRF(req,res,next,express.csrf({value: tools.xsrfValue}))
  });
  app.use(function(req,res,next){
    tools.useXSRF(req,res,next,function(req,res,next){
      res.cookie('XSRF-TOKEN', req.csrfToken(), {secure: true});
      next();
    });
  });
  app.use(function(req,res,next){
    req.onValidationError(function (msg) {
      //Redirect the user with error 'msg'
      res.send({message:encodeURIComponent(msg)});
    });
    next();
  });
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.static(path.join(__dirname, '.tmp')));
  app.use(express.static(path.join(__dirname, 'app')));
  app.use(express.errorHandler());
  tools.isDevelopment = true;
});

app.configure('production', function(){
  app.use(express.logger('dev'));
  app.use(express.favicon(path.join(__dirname, 'app/favicon.ico')));
  app.use(express.static(path.join(__dirname, 'app')));
});

// Routes
app.get('/',  function(req, res){
  res.sendfile(__dirname + "/app/index.html");
});
app.post('/api/events', api.events_post);
app.get('/api/events', api.events_list);
app.delete('/api/events/:id', api.events_delete);
app.put('/api/events/:id', api.events_put);
app.get('/api/events/team', api.events_team);
app.get('/api/search/contacts/:str', api.search_contacts);
app.post('/home', api.home);
app.post('/signin', api.signin);
app.post('/logout', api.logout);
app.post('/menu', api.menu);
app.get('/test', api.test);

// Start server
//var port = 3000;
var port = process.env.PORT || 3000;
var port_ssl = 4444;

if(app.get('env') == 'development'){
// HTTP
  app.listen(port);
}else{
// HTTP
  app.listen(port);
// HTTPS
  /*pem.createCertificate({days:1, selfSigned:true}, function(err, keys){
    https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(port_ssl);
  });*/
};