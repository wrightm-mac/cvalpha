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

const document = require('./models/document');
const service = require('./services/document');
const helper = require('./lib/helper');



/**
  Gets an identified document.

  :id - document's identifier.
*/
router.get('/:id', (req, res) => {
    service.get(req.params.id, (data) => {
        if (data) {
          helper.sendOk(res, data);
        }
        else {
          helper.sendError(404, "not found");
        }
    });
});

/**
  Adds a new document.
*/
router.post('/', (req, res) => {
  console.log("document.post");

  service.save(req.body, (data) => {
      if (data) {
        helper.sendOk(res, data);
      }
      else {
        helper.sendError(404, "not found");
      }
  });
});

/**
  Updates an identified document.

  :id - document's identifier.
*/
router.put('/:id', (req, res) => {
  console.log("document.put [user=%s][email=%s][%o]", req.session.user.email, req.params.id, req.body);

  const cv = req.body;
  document.model.findOne({ email: cv.email }, (err, data) => {
      data = data || new document.model({
        email: cv.email,
      });

      data = Object.assign(data, {
        _id: data._id,
        hash: data.hash || helper.id(),
        personal: {
          title: cv.personal.title || "Personal",
          items: (cv.personal.items || []).map(item => {
            return {
              _id: item._id,
              name: item.name,
              value: item.value,
              visible: true
            }
          })
        },
        education: {
          title: cv.education.title || "Education",
          items: (cv.education.items || []).map(item => {
            return {
              _id: item._id,
              school: item.name,
              course: item.course,
              grade: item.grade,
              graduation: new Date(item.graduation),
              visible: true
            }
          })
        },
        employment: {
          title: cv.employment.title || "Employment",
          items: (cv.employment.items || []).map(item => {
            return {
              _id: item._id,
              name: item.name,
              title: item.title,
              from: new Date(item.from),
              to: new Date(item.to),
              description: item.description,
              descriptionvisible: true,
              visible: true
            }
          })
        }
      });

      // helper.sendOk(res, { message: "hello, world!" });
      data.save(helper.responder(res, saved => {
        console.log("save: (%o)", saved);

        return {
          success: true,
          email: saved.email,
          hash: saved.hash
        };
      }));
  });
});

/**
  Deletes an identified document.

  :id - document's identifier.
*/
router.delete('/:id', (req, res) => {
  service.delete(req.body, (data) => {
    if (data) {
      helper.sendOk(res, data);
    }
    else {
      helper.sendError(404, "not found");
    }
  });
});

module.exports = router;