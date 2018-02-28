/* ----------------------------------------------------------------------------

                            BSD 3-Clause License

                        Copyright (c) 2018, wrightm-mac
                            All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  * Redistributions of source code must retain the above copyright notice, this
    list of conditions and the following disclaimer.

  * Redistributions in binary form must reproduce the above copyright notice,
    this list of conditions and the following disclaimer in the documentation
    and/or other materials provided with the distribution.

  * Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from
    this software without specific prior written permission.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
  DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
  DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
  SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
  OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
  OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

----------------------------------------------------------------------------- */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const lessMiddleware = require('less-middleware');
const mongoose = require('mongoose');

const config = require('./routes/lib/config');
const helper = require('./routes/lib/helper');
const pug = require('./routes/lib/pug');
const sha = require('./routes/lib/hash/sha');
const session = require('./routes/lib/session');

const fragments = require('./routes/fragments');
const index = require('./routes/index');
const login = require('./routes/login');
const document = require('./routes/document');

const apiUsers = require('./routes/api/users');

const app = express();


console.log("site  ('%s', %d, '%s')", config.site.id.name, config.site.id.version, config.site.hash);
console.log("mongo (host='%s', port='%s', db='%s', url='%s')", config.mongo.host, config.mongo.port, config.mongo.db, config.mongo.url);


// Initialise mongo/mongoose...
mongoose.connect(config.mongo.url, {
  autoIndex: false
});


// Make config and some libraries & functions available in view...
helper.extend(app.locals, pug, config);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.site.hash));
app.use(session);
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// Prevent access to 'api' if the user does not have permission...
app.use('/api', function(req,res,next) {
  if (! (req.session.user && req.session.user.roles.includes("api"))) {
    helper.sendCode(res, 404, {
      status: 404,
      message: "forbidden"
    });
  }
  else {
    next();
  }
});

// Pass the request object to the view - this will make the
// 'req' object (and all of its contents) visible as a local
// to code in the pug view...
app.use(function(req,res,next) {
  res.locals.req = req;
  next();
});


// The application's pages...
app.use('/', index);
app.use('/login', login);
app.use('/document', document);

// The application's API handlers...
app.use('/api/users', apiUsers);

// The application's fragments...
app.use('/fragments', fragments);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
