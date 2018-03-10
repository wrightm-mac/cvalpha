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

function isLoggedIn(req) {
  return req.session && req.session.user;
}

function isMapLink(path, map) {
    if (path === map.path) {
        return true;
    }

    var isSelected = false;
    if (map.children) {
        map.children.forEach(child => {
            isSelected = isSelected
                || ((typeof(child) === "string") && (child === path))
                || ((typeof(child) === "object") &&  child.test(path));

        });
    }

    return isSelected;
}

function nameFromPath(path, map) {
    var name;
    map.forEach(link => {
        if (isMapLink(path, link)) {
            name = link.name;
        }
    });

    return name;
}

function isMapItemVisible(session, item) {
    // An item without any roles should always be visible...
    if (! item.roles) {
        return true;
    }

    // The session will only have a user if it's logged in - so hide all links
    // that have a defined role from all non-login views...
    if (! (session.user)) {
        return;
    }

    for (let userRole of session.user.roles || []) {
        for (let itemRole of item.roles) {
            if (userRole === itemRole) {
                return true;
            }
        }
    }
}

class Id {

    constructor() {
        this.current = Math.round(Math.random() * 10000);
    }

    next() {
        return ++this.current;
    }

    prev() {
        return this.current;
    }
}

const dateFormat = {
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],

  longMonths: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],

  shortMonthYear: function(date) {
    return `${this.shortMonths[date.getMonth()]} ${date.getFullYear()}`;
  },

  longMonthYear: function(date) {
    return `${this.longMonths[date.getMonth()]} ${date.getFullYear()}`;
  }
};

module.exports = {
  isLoggedIn,
  nameFromPath,
  isMapLink,
  isMapItemVisible,
  id: new Id(),
  dateFormat
};