'use strict';

var crypto = require('crypto'),
  util = require('util'),
  postgres = require('./api_pg'),
  tools = require('./tools');

var pg = require('pg');

exports.signin = function(req, res){
  // VALIDACE
  //req.check('id', 'Neplatné ID produktu').isInt();
  var obj = {login:false};
  var await = false;
  try{
    var encrypred_password = crypto.createHmac('sha1', 'MBSystem.*').update(req.body.password).digest('hex');
    var vals = [req.body.username, encrypred_password, req.body.company];
    var fceError = function(err){
      obj.message = 'Chyba údajů pro přihlášení (connect to user account)';
      res.json(obj);
    };
    var fce = function(res, result){
      if(result){
        if(result.rows[0]){
          if(result.rows[0].exist == '1'){
            var encrypred = crypto.createHmac('sha1', Math.round((new Date().valueOf() * Math.random())) + '').update(Math.round((new Date().valueOf() * Math.random())) + '').digest('hex');
            tools.createCookie(res, 'auth_token', encrypred, 0);
            postgres.setConnection({company: req.body.company, user: req.body.username, password: req.body.password, login_token: encrypred});
            await = true;
            postgres.executeSQL(
              req,
              "UPDATE USERS SET LOGIN_TOKEN = $1,LOGIN_TOKEN_EXPIRE = CURRENT_TIMESTAMP + '0.5 hour' WHERE LOGIN = $2",
              [encrypred, req.body.username],
              function(){
                obj.login = true;
                res.json(obj);
              },
              function(err){
                obj.message = 'Chyba při přihlášení (error update user token)';
                res.json(obj);
              }
            );
          }else{
            obj.message = 'Chybné zadání přihlašovacích údajů.';
          }
        }
      }
      if(!await){
        obj.message = 'Chybné jméno nebo heslo.';
        res.json(obj);
      }
    }
    postgres.select("SELECT 1 AS EXIST FROM USERS WHERE LOGIN = $1 AND PASSWORD = $2 AND COMPANY = $3", vals, req, res, fce, fceError, null);
  }catch(e){
    obj.message = 'Chyba při přihlášení';
    res.json(obj);
  }
};

exports.home = function(req, res){
  var obj = {};
  res.send(obj);
};

exports.test = function(req, res){
  var obj = {test: ""};
  postgres.setConnection({company: 'NOTIA', user: 'developer', password: 'hymen349.'});
  req.body.username = 'developer';
  req.body.password = 'hymen349.';
  //tools.insertUser(req, {first_name:'Martin',last_name:'Boháč',login:'developer',password:'hymen349.'});

  var client = new pg.Client(postgres.getConn(req));
  client.on('drain', client.end.bind(client));
  client.connect(function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
  });
  client.query('SELECT * FROM users', [], function(err) {
    if(err) {
      return console.error('could not connect to postgres', err);
    }
  });
  client.on('error', function(error) {
    console.error('error executeSQL query', error);
  });

  /*setTimeout(function(){
    res.json(postgres.getConn(req));
  }, 5000);*/
};

exports.logout = function(req, res, next){
  var obj = {logout: false};
  var login_token = req.signedCookies.auth_token;
  try{
    var fce = function(res, result){
      tools.deleteCookie(res, 'auth_token');
      obj.logout = true;
      postgres.executeSQL(
        req,
        'UPDATE USERS SET LOGIN_TOKEN_EXPIRE = NULL,LOGIN_TOKEN = NULL WHERE LOGIN_TOKEN = $1',
        [login_token],
        function(){
          postgres.removeConnection(req);
          res.json(obj);
        },
        function(err){
          obj.message = err;
          res.json(obj);
        });
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

exports.menu = function(req, res, next){
  //req.assert('','').isInt();
  var obj = {isLogin:false};
  var login_token = req.signedCookies.auth_token;
  try{
    var fce = function(res, result){
      obj.isLogin = true;
      var fceError = function(err){
        obj.message = err;
        res.json(obj);
      };
      var fceMenu = function(res, result){
        obj.title = encodeURIComponent(result.rows[0].company) + ' / ' +
          encodeURIComponent(result.rows[0].first_name) + ' ' + encodeURIComponent(result.rows[0].last_name);
        res.json(obj);
      }
      var sql = tools.isDevelopment ? 'SELECT \'COMPANY\' AS COMPANY,\'FIRST_NAME\' AS FIRST_NAME,\'LAST_NAME\' AS LAST_NAME, $1::varchar AS X FROM DUAL'
        : 'SELECT * FROM USERS WHERE LOGIN_TOKEN = $1';
      postgres.select(sql, [login_token], req, res, fceMenu, fceError, null);
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

exports.events_post = function(req, res, next){
  req.assert('subject', 'Předmět musí být vyplněn.').notEmpty();
  req.assert('subject', 'Předmět je příliš dlouhý (max. 100 znaků).').len(1,100);
  req.assert('place', 'Místo musí být vyplněno.').notEmpty();
  req.assert('place', 'Místo je příliš dlouhé (max. 100 znaků).').len(1,100);
  req.assert('date_from', 'Datum od musí být vyplněn.').notEmpty();
  req.assert('date_to', 'Datum do musí být vyplněn.').notEmpty();
  //req.assert('date_reservation', 'Datum rezervace má chybný formát.').len(1,100);
  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  var obj = {type: 'success', msg: 'Událost byla uložena.'};
  try{
    var fce = function(res, result){
      var id_event = null;
      var sql_id_event = 'SELECT nextval(\'seq_events_id\') AS ID'; // pridat sequenci
      postgres.select(sql_id_event, [], req, res, function(res, result, arg) {
        if(result) {
          if (result.rows) {
            id_event = result.rows[0].id;
            var sql = 'INSERT INTO events(name, description, room, date_from, date_to, owner, place, type, id) ' +
              'VALUES($1::varchar, $2::varchar, null, to_timestamp($3::varchar,\'DD.MM.YYYY HH24:MI\'), to_timestamp($4::varchar,\'DD.MM.YYYY HH24:MI\'), (select id from users where login_token = $7::varchar), $5::varchar, 0, $6::integer)';
            postgres.executeSQL(req, sql, [decodeURIComponent(req.body.subject), decodeURIComponent(req.body.description), req.body.date_from, req.body.date_to, decodeURIComponent(req.body.place), id_event, tools.getLoginToken(req)],
              function () {
                //console.log(req.body.contacts);
                if (req.body.contacts.length > 0) {
                  var count = 0;
                  for (var i = 0; i < req.body.contacts.length; i++) {
                    var item = req.body.contacts[i];
                    var sql_insert_contacts = 'INSERT INTO event_contacts(id_event, id_contact) VALUES($1::integer, $2::integer)';
                    postgres.executeSQL(req, sql_insert_contacts, [id_event, item.id],
                      function () {
                        if (count == req.body.contacts.length - 1) {
                          res.json(obj);
                        } else {
                          count++;
                        }
                      },
                      function (msg, err) {
                        console.error(err);
                        obj = {type: 'danger', msg: 'Chyba při ukládání události. (' + msg + ')'};
                        res.json(obj);
                      });
                  }
                } else {
                  res.json(obj);
                }
              },
              function (msg, err) {
                console.error(err);
                obj = {type: 'danger', msg: 'Chyba při ukládání události. (' + msg + ')'};
                res.json(obj);
              },
              null);
          }
        }
      },
      function(msg, err){
        console.error(err);
        obj = {type: 'danger', msg: 'Chyba při ukládání události. (' + msg + ')'};
        res.json(obj);
      });
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

exports.events_put = function(req, res, next){
  req.assert('subject', 'Předmět musí být vyplněn.').notEmpty();
  req.assert('subject', 'Předmět je příliš dlouhý (max. 100 znaků).').len(1,100);
  req.assert('place', 'Místo musí být vyplněno.').notEmpty();
  req.assert('place', 'Místo je příliš dlouhé (max. 100 znaků).').len(1,100);
  req.assert('date_from', 'Datum od musí být vyplněn.').notEmpty();
  req.assert('date_to', 'Datum do musí být vyplněn.').notEmpty();
  //req.assert('date_reservation', 'Datum rezervace má chybný formát.').len(1,100);
  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  var obj = {type: 'success', msg: 'Událost byla uložena.'};
  try{
    var fce = function(res, result){
      var sql = 'UPDATE events set '+
        'name = $1::varchar,'+
        'description = $2::varchar,'+
        'date_from = to_timestamp($3::varchar,\'DD.MM.YYYY HH24:MI\'),'+
        'date_to = to_timestamp($4::varchar,\'DD.MM.YYYY HH24:MI\'),'+
        'place = $5::varchar'+
        ' WHERE id = $6::integer';
      postgres.executeSQL(req, sql, [decodeURIComponent(req.body.subject),decodeURIComponent(req.body.description),req.body.date_from,req.body.date_to,decodeURIComponent(req.body.place),req.params.id],
        function(){
          if(contacts.length == 0){
            res.json(obj);
          }
        },
        function(msg, err){
          console.error(err);
          obj = {type: 'danger', msg: 'Chyba při ukládání události. ('+msg+')'};
          res.json(obj);
        });
      // contacts
      var count = 0;
      var contacts = req.body.contacts;
      var sql_delete = 'DELETE FROM event_contacts WHERE id_event = $1::integer';
      var sql_insert_contacts = 'INSERT INTO event_contacts(id_event, id_contact) VALUES($1::integer, $2::integer)';
      postgres.executeSQL(req, sql_delete, [req.params.id],
        function(){
          for (var i = 0; i < contacts.length; i++) {
            var item = contacts[i];
            postgres.executeSQL(req, sql_insert_contacts, [req.params.id, item.id],
              function(){
                if(count == contacts.length - 1){
                  res.json(obj);
                }else{
                  count++;
                }
              },
              function(msg, err){
                console.error(err);
                obj = {type: 'danger', msg: 'Chyba při ukládání události. ('+msg+')'};
                res.json(obj);
              });
          }
        },
        function(msg, err){
          console.error(err);
          obj = {type: 'danger', msg: 'Chyba při ukládání události. ('+msg+')'};
          res.json(obj);
        });
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

exports.events_delete = function(req, res, next){
  req.assert('id', 'ID události musí být vyplněno.').notEmpty();
  //req.assert('date_reservation', 'Datum rezervace má chybný formát.').len(1,100);
  var errors = req.validationErrors();
  if (errors) {
    res.json(errors);
    return;
  }
  var obj = {type: 'success', msg: 'Událost byla smazána.'};
  try{
    var fce = function(res, result){
      var sql = 'DELETE FROM events WHERE ID=$1::integer';
      postgres.executeSQL(req, sql, [decodeURIComponent(req.params.id)],
        function(){
          res.json(obj);
        },
        function(msg, err){
          console.error(err);
          obj = {type: 'danger', msg: 'Chyba při mazání události. ('+msg+')'};
          res.json(obj);
        });
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

exports.events_list = function(req, res, next){
  var obj = {type: 'success', msg: 'Události byly načteny.',rows:[]};
  try{
    var fce = function(res, result){
      var sql = 'SELECT * FROM events e WHERE $1::integer = 0 OR $2::integer = 0';
      var sql_contacts = 'SELECT u.id,u.first_name||\' \'||u.last_name AS name FROM users u,event_contacts ec WHERE u.id = ec.id_contact and ec.id_event = $1::integer';
      postgres.select(sql, ['0','0'], req, res,
        function(res, result){
          if(result){
            if(result.rows){
              var pom = result.rows.length;
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                row.contacts = [];
                // NESTED SQL
                postgres.select(sql_contacts, [row.id], req, res,
                  function(res, result, arg){
                    if(result) {
                      if (result.rows) {
                        for (var j = 0; j < result.rows.length; j++) {
                          arg.contacts.push({id: result.rows[j].id, name:result.rows[j].name});
                        }
                      }
                    }
                    obj.rows.push(arg);
                    if(obj.rows.length == pom){
                      res.json(obj);
                    }
                  },
                  function(msg, err){
                    console.error(err);
                    obj = {type: 'danger', msg: 'Chyba při načítání událostí - vnoření. ('+msg+')'};
                    res.json(obj);
                  },
                  row);
                //obj.rows.push(row);
              };
              if(result.rows.length == 0){
                res.json(obj);
              }
            }else{
              res.json(obj);
            }
          }else{
            res.json(obj);
          }
          //res.json(obj);
        },
        function(msg, err){
          console.error(err);
          obj = {type: 'danger', msg: 'Chyba při načítání událostí. ('+msg+')'};
          res.json(obj);
        },
        null);
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

exports.events_team = function(req, res, next){
  var obj = {type: 'success', msg: 'Události týmu byly načteny.',rows:[]};
  try{
    var fce = function(res, result){
      var sql = 'SELECT * FROM events e,users u WHERE e.owner = u.id AND u.login_token = $1::varchar';
      var sql_contacts = 'SELECT u.id,u.first_name||\' \'||u.last_name AS name FROM users u,event_contacts ec WHERE u.id = ec.id_contact and ec.id_event = $1::integer';
      postgres.select(sql, [tools.getLoginToken(req)], req, res,
        function(res, result){
          if(result){
            if(result.rows){
              var pom = result.rows.length;
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                row.contacts = [];
                // NESTED SQL
                postgres.select(sql_contacts, [row.id], req, res,
                  function(res, result, arg){
                    if(result) {
                      if (result.rows) {
                        for (var j = 0; j < result.rows.length; j++) {
                          arg.contacts.push({id: result.rows[j].id, name:result.rows[j].name});
                        }
                      }
                    }
                    obj.rows.push(arg);
                    if(obj.rows.length == pom){
                      res.json(obj);
                    }
                  },
                  function(msg, err){
                    console.error(err);
                    obj = {type: 'danger', msg: 'Chyba při načítání událostí týmu. ('+msg+')'};
                    res.json(obj);
                  },
                  row);
                //obj.rows.push(row);
              };
              if(result.rows.length == 0){
                res.json(obj);
              }
            }else{
              res.json(obj);
            }
          }else{
            res.json(obj);
          }
          //res.json(obj);
        },
        function(msg, err){
          console.error(err);
          obj = {type: 'danger', msg: 'Chyba při načítání událostí týmu. ('+msg+')'};
          res.json(obj);
        },
        null);
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

exports.search_contacts = function(req, res, next){
  var obj = {type: 'success', msg: 'Kontakty byly načteny.',rows:[]};
  try{
    var fce = function(res, result){
      var sql = 'SELECT id,first_name||\' \'||last_name AS name FROM users WHERE UPPER(first_name||\' \'||last_name) LIKE $1::varchar';
      postgres.select(sql, ['%'+req.params.str.toUpperCase()+'%'], req, res,
        function(res, result){
          if(result){
            if(result.rows){
              for (var i = 0; i < result.rows.length; i++) {
                var row = result.rows[i];
                obj.rows.push(row);
              }
            }
          }
          res.json(obj);
        },
        function(msg, err){
          console.error(err);
          obj = {type: 'danger', msg: 'Chyba při načítání kontaktů. ('+msg+')'};
          res.json(obj);
        },
        null);
    }
    tools.exec(req, res, fce);
  }catch(e){
    res.json(obj);
  }
};

