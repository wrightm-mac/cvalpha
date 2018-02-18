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

const router = require('express').Router();

const helper = require('../lib/helper');

const user = require('../models/user');


/**
  Gets all users.
*/
router.get('/', function(req, res, next) {
    user.model.find(helper.responder(res));
});

/**
  Gets an identified user.

  :id - user's identifier.
*/
router.get('/:id', (req, res) => {
    user.model.findById(req.params.id, helper.responder(res, (data) => {
        if (!data) {
            res.status(404);
        }
    }));
});

/**
  Adds a new user.
*/
router.post('/', (req, res) => {
    let passwordHash = req.body.password;

    let newUser = new user.model({
        name: req.body.name,
        roles: ["user"],
        email: req.body.email,
        password: passwordHash
    });

    newUser.save(helper.responder(res));
});

/**
  Updates an identified user.

  :id - user's identifier.
*/
router.put('/:id', (req, res) => {
    req.body.updated_at = Date.now();

    user.model.findByIdAndUpdate(req.params.id, req.body, helper.responder(res));
});

/**
  Deletes an identified user.

  :id - user's identifier.
*/
router.delete('/:id', (req, res) => {
    user.model.findByIdAndRemove(req.params.id, helper.responder(res));
});

module.exports = router;