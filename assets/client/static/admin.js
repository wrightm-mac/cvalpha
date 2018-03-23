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


$(function() {
  function getSectionData(endpoint, callback) {
      $.ajax({
        url: `/api/${endpoint}`
      })
      .then(function(data) {
        callback(data);
      })
      .catch(function(error) {
      });
  }

  const sectiondata = {
    users: function($panel, $table) {
      getSectionData("users", function(users) {
        for (let user of users) {
          const $row = $("<tr>").appendTo($table);
          $("<td>", { class: "adminTableUsersId" })
            .text(user._id)
            .appendTo($row);
          $("<td>", { class: "adminTableUsersEmail" })
            .text(user.email)
            .appendTo($row);
          const $roles = $("<td>", { class: "adminTableUsersRoles" }).appendTo($row);
          const $roleList = $("<ul>").appendTo($roles);
          for (let role of user.roles) {
            $("<li>")
              .text(role)
              .appendTo($roleList);
          }

          const $buttons = $("<td>", { class: "adminTableButtons" }).appendTo($row);
          $("<div>", { class: "adminButtonStandard"}).text("Suspend").appendTo($buttons);
          $("<div>", { class: "adminButtonSpecial"}).text("Delete").appendTo($buttons);
        }
      });
    },

    documents: function($panel, $table) {
      getSectionData("documents", function(documents) {
        for (let cv of documents) {
          const $row = $("<tr>").appendTo($table);
          $("<td>", { class: "adminTableUsersId" })
            .text(cv._id)
            .appendTo($row);
          $("<td>", { class: "adminTableUsersEmail" })
            .text(cv.email)
            .appendTo($row);

          const $buttons = $("<td>", { class: "adminTableButtons" }).appendTo($row);
          $("<div>", { class: "adminButtonStandard"}).text("Rehash").appendTo($buttons);
        }
      });
    }
  };

  $("dl.adminSection").on("click", "dt[data-section]", function() {
    const $this = $(this);
    const section = $this.attr("data-section");
    const $panel = $(`dd[data-section='${section}']`, $this.parent());
    if ($panel.hidden()) {
      if (!$panel.data("loaded") && sectiondata[section]) {
        sectiondata[section].call($panel, $panel, $("table", $panel));
        $panel.data("loaded", true);
      }
      $panel.show();
    }
    else {
      $panel.hide();
    }
  });
});
