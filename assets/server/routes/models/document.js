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

var mongoose = require("mongoose");


var DocumentPersonalItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    visible: Boolean
});

var DocumentPersonalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    items: [DocumentPersonalItemSchema]
});

var DocumentEducationItemSchema = new mongoose.Schema({
    school: {
        type: String,
        required: true
    },
    course: {
        type: String
    },
    grade: {
        type: String
    },
    graduation: {
        type: Date,
        required: true
    },
    visible: Boolean
});

var DocumentEducationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    items: [DocumentEducationItemSchema]
});

var DocumentEmploymentItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    descriptionvisible: Boolean,
    visible: Boolean
});

var DocumentEmploymentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    items: [DocumentEmploymentItemSchema]
});

var DocumentSchema = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    deleted: Boolean,
    personal: [DocumentPersonalSchema],
    education: [DocumentEducationSchema],
    employment: [DocumentEmploymentSchema]
}, { timestamps: true });

module.exports = {
    schema: DocumentSchema,
    model: mongoose.model("Document", DocumentSchema)
};