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

const sha = require('./hash/sha');


module.exports = {

    /**
     * Maps source objects to a destination object.
     *
     */
    extend: function (dest, ... sources ) {
        sources.forEach(source => {
            Object.assign(dest, source);
        });

        return dest;
    },

    stripExtension: function(path) {
        return path.replace(/\.[^/.]+$/, "")
    },

    hash: function(text) {
        let hasher = new sha("SHA-1", "TEXT");
        hasher.update(text);
        
        return hasher.getHash("HEX");
    },

    /**
     *  Standard response handler to send Mongoose query results back to caller.
     *
     *  Sets the responses status to 500 (error) if the query returns an error.
     *
     *  @res        the response object.
     *  @after      optional callback function that will be called if there is no
     *              error, and before the results data is sent. Can be used to
     *              sanity-check results and/or modify the results before they are
     *              sent.
     */
    responder: function(res, after) {
        return (err, data) => {
            if (err) {
                res.status(500);
                data = err;
            } else if (after) {
                let altered = after(data);
                if (altered !== undefined) {
                    data = altered;
                }
            }

            res.send(data);
        }
    },

    sendOk: function(res, data) {
        res.status = 200;
        res.send(data || {});
    },

    sendCode: function(res, code, data) {
        res.status(code);
        res.send(data || {});
    }
};