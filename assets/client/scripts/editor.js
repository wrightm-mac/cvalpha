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
  var $text;
  var $edit;

  function startEdit() {
    endEdit();

    $text = $(this);
    let $parent = $text.parent();

    $text.hide();
    $edit = $("<input>").attr("type", "text")
              .addClass("editorText")
              .val($text.html())
              .attr("data-id", $text.attr("data-id"))
              .appendTo($parent)
              .click(function() {
                return false;
              })
              .keypress(function (event) {
                if (event.which == 13) {
                  endEdit();
                  return false;
                }
              });

    $edit.focus();

    return false;
  }

  function endEdit() {
    if ($edit && $text) {
      let text = $text.html();
      let edit = $edit.val();
      if (text !== edit) {
        $text.html(edit);
        $text.addClass("editorModified");
      }

      $edit.remove();
      $text.show();

      $edit = null;
      $text = null;
    }
  }

  function passClick() {
    let $span = $("span.editorClickable", this).first();
    if ($span) {
      startEdit.call($span, $span);
    }

    return false;
  }

  function deleteRow() {
    let $row = $(this).parent();
    $row.remove();
  }

  $("body").click(endEdit);

  $("div#cvPersonal .editorClickable").click(startEdit);

  $("td").click(passClick);

  $(".editorAdd").click(function() {
    let $table = $(this).parent().parent().parent();

    let $row = $("<tr>");
    $("<td>", { class: "editorColumnVisible" })
      .append($("<input>", { type: "checkbox", checked: true }))
      .appendTo($row);

    let datacolumns = $table.attr("data-columns");
    console.log("[columns=%s]", datacolumns);
    for (let column of datacolumns.split(",")) {
      let info = column.split(":");

      let $cell = $("<td>", { class: info[1] } )
        .click(passClick);
      $("<span>", { class: "editorClickable editorModified" })
        .attr("data-id", info[0])
        .click(startEdit)
        .appendTo($cell);

      $cell.appendTo($row);
    }

    $("<td>", { class: "editorDelete" })
      .append($("<img>", { src: "/images/badge_minus.png" }))
      .click(deleteRow)
      .appendTo($row);

    $table.append($row);
  });

  $(".editorDelete").click(deleteRow);
});