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

var router = require('express').Router();

var helper = require('./lib/helper');


router.get(["/", "/:page"], function(req, res, next) {
  let page = req.params.page || "index.html";

  if (page.endsWith(".html")) {
    console.log("router:index - html [page=%s]", req.params.page)

    res.render(helper.stripExtension(page), {
      info: {
        personal: {
          title: "Personal",
          values: [
            { id: "0001", name: "Name", value: "Charlie Chuckles", visible: true },
            { id: "0004",name: "Date of Birth", value: "1st January, 1901", visible: true },
            { id: "0003",name: "Place of Birth", value: "Lincoln, Nebraska", visible: false }
          ]
        },
        education: {
          title: "Education",
          values: [
            { id: "0001",name: "School #1", course: "Course #1", grade: "Grade #1", graduation: "b", visible: true },
            { id: "0002",name: "School #2", course: "Course #2", grade: "Grade #2", graduation: "q", visible: false },
            { id: "0003",name: "School #3", course: "Course #3", grade: "Grade #3", graduation: "y", visible: true }
          ]
        },
        employment: {
          title: "Employment",
          values: [
            { id: "0001", name: "Place #1", title: "Title #1", from: "a", to: "b", tasks: ["one", "two", "three"] },
            { id: "0002", name: "Place #2", title: "Title #2", from: "a", to: "b", tasks: ["one", "two", "three"] },
            { id: "0003", name: "Place #3", title: "Title #3", from: "a", to: "b", tasks: ["one", "two", "three"] },
            { id: "0004", name: "Place #4", title: "Title #4", from: "a", to: "b", tasks: ["one", "two", "three"] },
            { id: "0005", name: "Place #5", title: "Title #5", from: "a", to: "b", tasks: ["one", "two", "three"] }
          ]
        }
      }
    });
  }
  else {
    // TODO:  This will be a cv display - the 'page' will be the user/cv id..!

  }
});

module.exports = router;
