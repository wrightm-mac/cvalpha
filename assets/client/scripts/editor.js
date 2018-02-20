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

  function doFormat($span) {
    let format = $span.attr("data-format");
    let text = $span.text();

    if (text) {
      let date = new Date(text);
      $span.text(date[format]());
    }
  }

  $("[data-format]").each(function() {
    doFormat($(this));
  });

  const sections = {
    personal: {
      insert: "last",
      rows: [[{
        name: "name",
        css: "editorColumnPersonalName"
      }, {
        name: "value",
        css: "editorColumnPersonalValue"
      }]]
    },

    education: {
      insert: "last",
      rows: [[{
        name: "name",
        css: "editorColumnEducationName"
      }, {
        name: "course",
        css: "editorColumnEducationCourse"
      }, {
        name: "graduation",
        css: "editorColumnEducationGraduation",
        edit: "date",
        format: "longMonthYear"
      }]]
    },

    employment: {
      insert: "first",
      rows: [[{
        name: "name",
        css: "editorColumnEmploymentName"
      }, {
        name: "title",
        css: "editorColumnEmploymentTitle"
      }, {
        name: "from",
        css: "editorColumnEmploymentDate",
        edit: "date",
        format: "shortMonthYear"
      }, {
        locked: true,
        content: " - "
      }, {
        name: "to",
        css: "editorColumnEmploymentDate",
        edit: "date",
        format: "shortMonthYear"
      }], [{
        name: "description",
        css: "editorColumnEmploymentDescription",
        colspan: 5,
        edit: "large"
      }]]
    }
  };

  var $text;
  var $edit;

  function startEdit() {
    endEdit();

    $text = $(this);
    if (! $text.attr("data-locked")) {
      let $parent = $text.parent();

      $text.hide();

      let edit = $text.attr("data-edit");
      if (edit === "date") {
        let rawDate = $text.attr("data-raw");
        let currentDate = new Date(rawDate);
        console.log("**** [raw=%s][date=%s]", rawDate, currentDate.toDateString());
        
        $edit = $("<input>").attr("type", "text");
        $edit.datepicker({
          changeMonth: true,
          changeYear: true,
          showButtonPanel: true,
          defaultDate: currentDate,
          onClose: function() {
            endEdit();
          },
          onChangeMonthYear: function(year, month, inst) {
            let date = new Date(year, month - 1, 1);

            $text.attr("data-raw", date.toDateString());
            let displayDate = date[$text.attr("data-format")]();
            $edit.text(displayDate);
          }
        });
      }
      else if ($text.attr("data-edit") === "large") {
        $edit = $("<textarea>").attr("rows", 20);
      }
      else {
        $edit = $("<input>")
          .attr("type", "text")
          .keypress(function (event) {
            if (event.which == 13) {
              endEdit();
              return false;
            }
          });
      }
      
      $edit
        .addClass("editorText")
        .val($text.html())
        .attr("data-id", $text.attr("data-id"))
        .appendTo($parent)
        .click(function() {
          return false;
        });
        
  
        $edit.focus();

      return false;
    }
  }

  function endEdit() {
    if ($edit && $text) {
      if ($text.attr("data-edit") !== "date") {
        let text = $text.html();
        let edit = $edit.val();
        if (text !== edit) {
          $text.html(edit);
          $text.addClass("editorModified");
        }
      }
      else {
        let date = new Date($text.attr("data-raw"));
        $text.html(date[$text.attr("data-format")]());
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
    let id = $row.attr("data-id");
    console.log("delete (id=%s)", id);
    $(`[data-id='${id}']`, $row.parent()).remove();
  }

  $("body").click(endEdit);

  $("div#cvPersonal .editorClickable").click(startEdit);

  $("td").click(passClick);


  ///
  // Called when the '+' is clicked for a section...
  //
  $(".editorAdd").click(function() {
    let $table = $(this).parent().parent().parent();

    let info = sections[$table.attr("data-section")];
    let id = (Date.now() * Math.random() * 100000);
    let insertedRows = [];

    for (let row of info.rows) {
      let $row = $("<tr>")
        .attr("data-id", id);
      $("<td>", { class: "editorColumnVisible" })
        .append($("<input>", { type: "checkbox", checked: true }))
        .appendTo($row);
      
      for (let column of row) {
        console.log("append-column: %o", column);

        let $cell = $("<td>", { class: column.css } )
          .attr("colspan", column.colspan)
          .click(passClick);
  
        let $span = $("<span>", { class: "editorClickable" })
                    .attr("data-id", column.name)
                    .attr("data-edit", column.edit)
                    .attr("data-format", column.format)
                    .attr("data-locked", column.locked)
                    .addClass(column.locked ? "" : "editorModified")
                    .text(column.content)
                    .click(startEdit)
                    .appendTo($cell);

        column.format && doFormat($span);
        $cell.appendTo($row);
      }

      let $deleteCell = $("<td>", { class: "editorDelete" })
                          .appendTo($row);

      if (! insertedRows.length) {
        $deleteCell
        .append($("<img>", { src: "/images/badge_minus.png" }))
        .click(deleteRow);
      }

      insertedRows.push($row);
    }
    
    if (info.insert === "last") {
      for (let $insert of insertedRows) {
        $table.append($insert);
      }
    }
    else {
      for (let index = insertedRows.length - 1; index >= 0; --index) {
        $("tr:first", $table).after(insertedRows[index]);
      }
    }
  });

  $(".editorDelete").click(deleteRow);
});