/**
 * Created by Martin on 29.11.13.
 */
'use strict';

var crypto = require('crypto'),
  postgres = require('./api_pg'),
  tools = require('./tools');

exports.isDevelopment = false;

/*exports.test_connections = function(req, res){
  postgres.getConnectionsList(req, res);
}*/

exports.getLoginToken = function(req){
  try{
    return req.signedCookies.auth_token;
  }catch(e){
    return '';
  }
}

exports.deleteCookie = function(res, name){
  try{
    res.clearCookie(name);
    //res.cookie(name, '', {expires: new Date(1), path: '/' });
  }catch(e){

  }
}

exports.createCookie = function(res, name, value, expiration){
  try{
    res.cookie(name, value, { /*maxAge: expiration,*/ httpOnly: true, signed: true/*, secure: true*/ });
  }catch(e){

  }
}

//tools.insertUser({first_name:'Martin',last_name:'Boháč',login:'bohacc@seznam.cz',password:'mata553'});
exports.insertUser = function(req, obj){
  try{
    var encrypred = crypto.createHmac('sha1', 'MBSystem.*').update(obj.password).digest('hex');
    var vals = [obj.first_name, obj.last_name, obj.login, encrypred];
    postgres.executeSQL(req, 'INSERT INTO USERS(FIRST_NAME,LAST_NAME,LOGIN,PASSWORD) VALUES($1,$2,$3,$4)', vals);
  }catch(e){

  }
}

exports.exec = function(req, res, fce){
  try{
    var login_token = req.signedCookies.auth_token;
    postgres.select("SELECT COALESCE((SELECT MAX(1) FROM USERS WHERE LOGIN_TOKEN = $1 AND LOGIN_TOKEN_EXPIRE >= CURRENT_TIMESTAMP + '-0.5 hour'),0) AS EXIST FROM DUAL", [login_token], req, res, function(res, result){
      if(result) {
        if (result.rows[0].exist == '1' || tools.isDevelopment) {
          postgres.executeSQL(req, "UPDATE USERS SET LOGIN_TOKEN_EXPIRE = CURRENT_TIMESTAMP + '0.5 hour' WHERE LOGIN_TOKEN = $1", [login_token], function () {
            fce(res, result);
          });
        } else {
          postgres.executeSQL(req, 'UPDATE USERS SET LOGIN_TOKEN_EXPIRE = NULL,LOGIN_TOKEN = NULL WHERE LOGIN_TOKEN = $1', [login_token], function () {
            tools.deleteCookie(res, 'auth_token');
            postgres.removeConnection(req);
            res.json({access: 'not_authorization'});
          });
        }
      }
    });
  }catch(e){
    res.json();
  }
}

exports.useXSRF = function(req,res,next,fce) {
  var WHITE_LIST = tools.isDevelopment ? ['/signin','/menu','/test','/home','/api/rooms/list'] : [];
  var WHITE_LIST_LIKE = ['/api/rooms/put','/api/reservation-office/put'];
  if (/*req.method !== 'POST' &&*/ req.url !== '/app') {
    next();
    return;
  }
  for (var i = 0; i < WHITE_LIST_LIKE.length; i++) {
    var str = WHITE_LIST_LIKE[i];
    if(str == req.url.substring(0, str.length)){
      next();
      return;
    }
  }
  if (WHITE_LIST.indexOf(req.url) !== -1) {
    next();
  } else {
    fce(req,res,next);
  }
}

exports.xsrfValue = function(req) {
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token']);
  return token;
};