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

const document = require('../models/document');

const helper = require('../lib/helper');


module.exports = {

    create: function(userEmail) {
        return new document.model({
            email: userEmail,
            hash: helper.id(),
            personal: {
                title: "Personal",
                items: [{
                    name: "Name",
                    value: "My Name",
                    visible: true,
                }, {
                    name: "Location",
                    value: "Somewhere",
                    visible: true
                }]
            },
            education: {
                title: "Education",
                items: [{
                    school: "My Last School",
                    course: "My Course",
                    graduation: Date.now(),
                    visible: true
                }]
            },
            employment: {
                title: "Employment",
                items: [{
                    name: "My Last Employer",
                    title: "My Last Job Title",
                    from: Date.now(),
                    to: Date.now(),
                    description: "My roles & achievements."
                }]
            }
        });
    },

    get: function(userEmail, callback) {
        document.model.findOne({ email: userEmail }, function(data) {
            callback.call(data || this, data);
        });
    },

    save: function(document, callback) {
        console.log("services/document: save [%o]", document);

        document.save(function(data) {
            callback.call(data || this, data);
        });
    },

    delete: function(userEmail, callback) {
        document.deleted = true;

        this.save(document, callback);
    }
};