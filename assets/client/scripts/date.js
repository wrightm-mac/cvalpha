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

/*
  List of days of week.
  
  JS dates have 'Sunday' as the first day of week.
*/
let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];


/*
  List of months.
  
  Full name of month.
*/
let months = [
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
];


/*
  List of months.
  
  Abbreviated name of month.
*/
let shortMonths = [
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
];


/*
  Date formatting.
*/
$.extend(Date.prototype, {

    shortMonthYear: function() {
        return `${shortMonths[this.getMonth()]} ${this.getFullYear()}`;
    },

    longMonthYear: function() {
        return `${months[this.getMonth()]} ${this.getFullYear()}`;
    },

    getDayString: function() {
        return daysOfWeek[this.getDay()];
    },

    getMonthString: function() {
        return months[this.getMonth()];
    },

    getShortMonthString: function() {
        return shortMonths[this.getMonth()];
    },

    toISO: function() {
        return this.getFullYear() + "-" + padNumber(this.getMonth() + 1, 2) + "-" + padNumber(this.getDate(), 2);
    },

    toShort: function() {
        return padNumber(this.getDate(), 2) + "/" + padNumber(this.getMonth() + 1, 2) + "/" + this.getFullYear();
    },

    toLong: function() {
        return this.getShortMonthString() + " " + this.getDate() + " " + this.getFullYear();
    },

    toFull: function() {
        return daysOfWeek[this.getDay()] + " " + this.getMonthString() + " " + this.getDate() + " " + this.getFullYear();
    },

    toNeutral: function() {
        return padNumber(this.getDate(), 2) + "-" + this.getShortMonthString() + "-" + this.getFullYear();
    },

    toLongNeutral: function() {
        return padNumber(this.getDate(), 2) + "-" + this.getShortMonthString() + "-" + this.getFullYear() + " (" + this.getDayString() + ")";
    }
});