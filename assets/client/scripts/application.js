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


$.extend({
  fragment: function(callback) {
    $("div [data-fragment]").each(function() {
      $(this).fragment(callback);
    });

    return this;
  },

  redirect: function(url) {
    $(location).attr('href', url);
  },

  showWaiting: function() {
    if (! $("body .waitGraphic").exists()) {
      $("body").append("<div>", { id: "waitGraphic"});
    }
  },

  hideWaiting: function() {
    $("body #waitGraphic").remove();
  },

  datechooser: function(config = {}) {
    const months = ["January", "February", "March", "April", "May", "June", "July",
                    "August", "September", "October", "November", "December"];
    
    const today = new Date();
    let selectedMonth = (config.date || today).getMonth();
    let selectedYear = (config.date || today).getFullYear();

    let $chooser = $("<span>")
                    .addClass("editDate");

    let $year = $("<select>")
                  .addClass("editDateSelect editDateYear")
                  .appendTo($chooser);
    for (let year = 1950; year <= today.getFullYear(); ++year) {
    $("<option>")
      .attr("value", year)
      .attr("selected", year === selectedYear)
      .text(year)
      .appendTo($year);
    }
    
    let $month = $("<select>")
                  .addClass("editDateSelect editDateMonth")
                  .appendTo($chooser);
    for (let month = 0; month < 12; ++month) {
      $("<option>")
        .attr("value", month)
        .attr("selected", month === selectedMonth)
        .text(months[month])
        .appendTo($month);
    }

    function doDateChange() {
      if (config.change) {
        let selectedDate = new Date($year.val(), $month.val());
        config.change.call($chooser, selectedDate);
      }
    }

    $year.change(doDateChange);
    $month.change(doDateChange);

    return $chooser;
  }
});


$.fn.extend({
  exists: function() {
    return (this.length > 0);
  },

  hidden: function()
  {
    return $(this).css("display") === "none";
  },

  showing: function() {
    return ! this.hidden();
  },

  enterkey: function(callback) {
    $(this).keypress(function (event) {
      if (event.which == 13) {
        callback.call(this, event);
        return false;
      }
    });
  },

  // (requires jqueryui)...
  showModalDialog: function(config) {
    $("<div>", { id: "dialogModalBackdrop" }).prependTo($("body"));
    $(this).dialog(config);
  },

  hideModalDialog: function() {
    $(this).dialog("close");
    $(this).remove();
    $("#dialogModalBackdrop").remove();
  },

  fragment(callback) {
    $(this).load($(this).attr("data-fragment"), null, function() {
      callback && callback.call(this, element);
    });
  }
});


$(function() {
  // $(document)
  //   .ajaxStart(function () {
  //     $.showWaiting();
  //   })
  //   .ajaxStop(function () {
  //     $.hideWaiting();
  //   })

  //  $.fragment();
});
