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

    if ($text.attr("data-edit") === "large") {
      $edit = $("<textarea>").attr("rows", 20);
    }
    else {
      $edit = $("<input>").attr("type", "text")  
    }
    
    $edit
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
    let id = $row.attr("data-id");
    console.log("delete (id=%s)", id);
    $(`[data-id='${id}']`, $row.parent()).remove();
  }

  $("body").click(endEdit);

  $("div#cvPersonal .editorClickable").click(startEdit);

  $("td").click(passClick);


  function getAppendInfo($table) {
    let rawcolumns = $table.attr("data-append");
    let mode = $table.attr("data-mode");
    
    let rows = [];
    let row = [];
    for (let column of rawcolumns.split(",")) {
      let [name, type] = column.split(":");

      if (name.startsWith("*")) {
        rows.push(row);
        row = [];
        name = name.slice(1);
      }

      var colspan;
      if ((name[0] >= '0') && (name[0] <= '9')) {
        colspan = Number.parseInt(name.slice(0, 1));
        name = name.slice(1);
      }
      else {
        colspan = 1;
      }

      var edit;
      if (type.startsWith("!")) {
        var edit = "large";
        type = type.slice(1);
      }
      else {
        edit = "small";
      }

      row.push({
        name: name,
        colspan: colspan,
        type: type,
        edit: edit
      });
    }

    rows.push(row);

    return {
      id: Date.now(),
      mode: $table.attr("data-mode") || "last",
      rows: rows
    };
  }

  ///
  // Called when the '+' is clicked for a section...
  //
  $(".editorAdd").click(function() {
    let $table = $(this).parent().parent().parent();

    let info = getAppendInfo($table);
    let insertedRows = [];

    for (let row of info.rows) {
      let $row = $("<tr>")
        .attr("data-id", info.id);
      $("<td>", { class: "editorColumnVisible" })
        .append($("<input>", { type: "checkbox", checked: true }))
        .appendTo($row);
      
      for (let column of row) {
        console.log("append-column: %o", column);

        let $cell = $("<td>", { class: column.type } )
          .attr("colspan", column.colspan)
          .click(passClick);
  
        $("<span>", { class: "editorClickable editorModified" })
          .attr("data-id", column.name)
          .attr("data-edit", column.edit)
          .click(startEdit)
          .appendTo($cell);

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
    
    if (info.mode === "last") {
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