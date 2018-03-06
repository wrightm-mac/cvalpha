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
const cv = require('./models/cv');
const helper = require('./lib/helper');


router.get(["/", "/:page.html"], function(req, res) {
  const page = req.params.page || "index";

  console.log("router.get (.html) [page=%s]", page);

  if (req.session && req.session.user && (page === "index")) {
    const email = req.session.user.email;

    cv.model.findOne({ email: email }, (err, data) => {
      data = data || new cv.model({
        email: email,
        hash: helper.id(),
        personal: {
          title: "Personal",
          items: []
        },
        education: {
          title: "Education",
          items: []
        },
        employment: {
          title: "Employment",
          items: []
        }
      });

      res.render(page, {
        cv: data
      });
    });
  }
  else {
    res.render(page);
  }
});

router.get("/:id", function(req, res) {
  console.log("router.get (id) [id=%s]", req.params.id);

  renderPage(req, res, "index");
});

router.put('/:email', (req, res) => {
  if (req.params.email === req.session.user.email) {
    const payload = req.body;

    cv.model.findOne({ email: req.params.email }, (err, data) => {
        data = data || new cv.model({
          email: req.params.email,
        });

        data = Object.assign(data, {
          _id: data._id,
          hash: data.hash || helper.id(),
          personal: {
            title: payload.personal.title || "Personal",
            items: (payload.personal.items || []).map(item => {
              return {
                _id: item._id,
                name: item.name || "",
                value: item.value || "",
                visible: true
              }
            })
          },
          education: {
            title: payload.education.title || "Education",
            items: (payload.education.items || []).map(item => {
              return {
                _id: item._id,
                school: item.name || "",
                course: item.course || "",
                grade: item.grade || "",
                graduation: new Date(item.graduation),
                visible: true
              }
            })
          },
          employment: {
            title: payload.employment.title || "Employment",
            items: (payload.employment.items || []).map(item => {
              return {
                _id: item._id,
                name: item.name || "",
                title: item.title || "",
                from: new Date(item.from),
                to: new Date(item.to),
                description: item.description || "",
                descriptionvisible: true,
                visible: true
              }
            })
          }
        });

        data.save(helper.responder(res, saved => {
          return {
            success: true,
            email: saved.email,
            hash: saved.hash
          };
        }));
    });
  }
  else {
    helper.sendCode(res, 404, {
      status: 404,
      message: "forbidden"
    });
  }
});

module.exports = router;
