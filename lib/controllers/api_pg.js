/**
 * Created by Martin on 29.11.13.
 */
'use strict';

var pg = require('pg'),
  //Transaction = require('pg-transaction'),
  tools = require('./tools');

var connections = [];

// tohle jen pro testovani SMAZAT!!!
/*exports.getConnectionsList = function(req, res){
  res.json(connections);
}*/

exports.removeConnection = function(req){
  try{
    var login_token = tools.getLoginToken(req);
    for (var i = 0; i < connections.length; i++) {
      if(login_token == connections[i].login_token){
        connections.splice(i, 1);
        return;
      }
    }
  }catch(e){
    console.log(e.message);
  }
}

exports.getConn = function(req){
  return getConnection(req);
}

var getConnection = function(req){
  try{
    var login_token = tools.getLoginToken(req);
    for (var i = 0; i < connections.length; i++) {
      if(login_token == connections[i].login_token){
        return connections[i].conn;
      }
    }
    return {
      user: req.body.username || 'developer',
      password: req.body.password || '',
      database: 'crm',
      host: tools.isDevelopment ? 'localhost' : 'localhost', //37.205.9.8
      port: 5432,
      company: req.body.company || ''
    }
  }catch(e){
    console.log(e.message);
  }
}

exports.setConnection = function(credentials, req){
  try {
    connections.push({
      login_token: credentials.login_token,
      conn: {
        user: credentials.user,
        password: credentials.password,
        database: 'crm',
        host: tools.isDevelopment ? 'localhost' : 'localhost', //37.205.9.8
        port: 5432,
        company: credentials.company
      }
    });
  }catch(e){
    console.log(e.message);
  }
}

exports.executeSQL = function(req, sql, vals, fce, fceError){
  var client = new pg.Client(getConnection(req));
  client.on('drain', client.end.bind(client));
  client.connect(function(err) {
    if(err) {
      fceError('could not connect to postgres', err);
    }
  });
  /*var tx = new Transaction(client);
  tx.on('error', function(error) {
    console.error('error executeSQL query', error);
  });*/
  //tx.begin();
  //console.log(sql);
  //console.log(vals);
  client.query(sql, vals, function(err) {
    if(err) {
      fceError('error running query', err);
    }
    if(fce){
      fce(req);
    }
  });
  //tx.commit();
  client.on('error', function(error) {
    console.error('error executeSQL query', error);
  });
}

exports.select = function(sql, vals, req, res, fce, fceError, arg){
  var client = new pg.Client(getConnection(req));
  client.on('drain', client.end.bind(client));
  client.connect(function(err) {
    if(err) {
      //return console.error('could not connect to postgres', err);
      //throw new Error('could not connect to postgres');
      fceError('could not connect to postgres', err);
    }
  });
  client.query(sql, vals, function(err, result) {
    if(err) {
      //return console.error('error running query:'+sql, err);
      //throw new Error('error running query');
      fceError('error running query', err);
    }
    fce(res, result, arg);
    //client.end();
  });
  client.on('error', function(error) {
    console.error('error select query', error);
    //throw new Error(error);
  });
}

exports.selectSync = function(sql, vals, req, res, fce, fceError){
  var client = new pg.Client(getConnection(req));
  client.on('drain', client.end.bind(client));
  client.connect(function(err) {
    if(err) {
      //return console.error('could not connect to postgres', err);
      //throw new Error('could not connect to postgres');
      fceError('could not connect to postgres');
    }
  });
  client.query(sql, vals, function(err, result) {
    if(err) {
      //return console.error('error running query', err);
      //throw new Error('error running query');
      fceError('error running query');
    }
    fce(res, result);
    //client.end();
  });
  client.on('error', function(error) {
    console.error('error select query', error);
    //throw new Error(error);
  });
}