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
    let rawDate = $span.attr("data-raw");
    if (rawDate) {
      let date = new Date(rawDate);
      $span.text(date[$span.attr("data-format")]());
    }
  }

  // Format dates for display...
  $(".cvSection span[data-format]").each(function() {
    doFormat($(this));
  });

  // Format block-text into list-items...
  $(".cvSection span[data-edit=large]").each(function() {
    let list = toDisplayList($(this));
    $(this).html(list);
  });

  function fromDisplayList($text) {
    let text = "";
    $("ul li", $text).each(function() {
      if (text > "") {
        text += "\n\n";
      }

      text += $(this).text();
    });

    return text;
  }

  function toDisplayList($edit) {
    let text = ($edit[0].type === "textarea") ? $edit.val() : $edit.text();
    let chunks = text.split("\n");

    let $list = $("<ul>").addClass("editorEmploymentList");
    for (const chunk of chunks) {
      let paragraph = chunk.trim();
      if (paragraph > "") {
        $("<li>")
          .addClass("editorEmploymentListItem")
          .text(chunk)
          .appendTo($list);
      }
    }

    return $list;
  }


  // Describes the structure of an individual item in each of the sections - used
  // when adding a new row to a section. The section's name is given in the
  // section's table's `data-section` attribute, so use:
  //     `let sectionInfo = `sections[$table.attr('data-section')]`
  const sections = {
    blurb: {
      insert: "last",
      rows: [[{
        name: "header",
        css: "editorColumnBlurbHeader"
      }], [{
        name: "content",
        css: "editorColumnBlurbContent",
        edit: "large"
      }]]
    },

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
        locked: true,
        content: ""
      }, {
        name: "title",
        css: "editorColumnEmploymentTitle"
      }], [{
        name: "from",
        css: "editorColumnEmploymentDateFrom",
        edit: "date",
        format: "longMonthYear"
      }, {
        locked: true,
        content: " - "
      }, {
        name: "to",
        css: "editorColumnEmploymentDateTo",
        edit: "date",
        format: "longMonthYear"
      }], [{
        name: "description",
        css: "editorColumnEmploymentDescription",
        colspan: 3,
        edit: "large"
      }]]
    }
  };

  var $text;
  var $edit;

  function startEdit($control) {
    endEdit();

    $text = $control || $(this);
    if ($text.attr && (! $text.attr("data-locked"))) {
      let $parent = $text.parent();

      $text.hide();

      let edit = $text.attr("data-edit");
      if (edit === "date") {
        let currentDate = new Date($text.attr("data-raw"));

        $edit = $.datechooser({
          date: currentDate,
          change: function(date) {
            $text.attr("data-raw", date.toDateString());
            let displayDate = date[$text.attr("data-format")]();
            $text.text(displayDate);
            $text.addClass("editorModified");
          }
        });
      }
      else if ($text.attr("data-edit") === "large") {
        $edit = $("<textarea>")
                  .attr("rows", 20)
                  .addClass("editorControl editorText");
      }
      else {
        $edit = $("<input>")
          .attr("type", "text")
          .addClass("editorControl editorText");
      }

      $edit
        .val(($edit[0].type === "textarea") ? fromDisplayList($text) : $text.text())
        .attr("data-id", $text.attr("data-id"))
        .appendTo($parent);

        $edit.focus();

      return false;
    }
  }

  function endEdit() {
    if ($edit && $text) {
      if ($text.attr("data-edit") !== "date") {

        let edit = ($edit[0].type === "textarea") ? toDisplayList($edit) : $edit.val();

        let text = $text.html();
        if (text !== edit) {
          $text.html(edit);
          $text.addClass("editorModified");

          setDirty();
        }
      }
      else {
        let date = new Date($text.attr("data-raw"));
        $text.html(date[$text.attr("data-format")]());

        setDirty();
      }

      $(".editorControl").remove();
      $edit.remove();
      $text.show();

      $edit = null;
      $text = null;
    }
  }

  // Passes a click on a `<td>` to the contained `<span>`, enabling it to handle
  // the editing...
  function passClick() {
    let $span = $("span.editorClickable", this).first();
    if ($span.exists()) {
      startEdit.call($span, $span);
      return false;
    }
  }

  function tabForward($this) {
    if ($this && $this.exists()) {
      function nextSpan($control) {
        return $("span.editorClickable", $control.parent().next("td:not(.editorDelete)"));
      }

      let $next = nextSpan($this);
      if ($next.attr("data-locked")) {
        $next = nextSpan($next);
      }

      endEdit();
      if ($next.exists()) {
        startEdit($next);
      }
    }
  }

  function tabBackward($this) {
    if ($this && $this.exists()) {
      function prevSpan($control) {
        return $("span.editorClickable", $control.parent().prev("td:not(.editorDelete)"));
      }

      let $prev = prevSpan($this);
      if ($prev.attr("data-locked")) {
        $prev = prevSpan($prev);
      }

      endEdit();
      if ($prev.exists()) {
        startEdit($prev);
      }
    }
  }

  function deleteSectionItem() {
    let $row = $(this).parent();
    let id = $row.attr("data-id");
    $(`[data-id='${id}']`, $row.parent()).remove();

    setDirty();
  }


  ///
  // Called when the '+' is clicked for a section...
  //
  function addSectionItem() {
    let $table = $(this).closest("table");

    let info = sections[$table.attr("data-section")];
    let id = (Date.now() * Math.random() * 100000);
    let insertedRows = [];

    for (let row of info.rows) {
      let $row = $("<tr>", { class: "editorTableRow" })
        .attr("data-id", id);
      $("<td>", { class: "editorColumnVisible" })
        .append($("<input>", { name: `visible_${id}`, type: "checkbox", checked: true }))
        .appendTo($row);

      for (let column of row) {
        let $cell = $("<td>", { class: column.css } )
          .addClass("editorColumn")
          .attr("colspan", column.colspan);

        let $span = $("<span>", { class: "editorClickable" })
                    .attr("data-id", column.name)
                    .attr("data-edit", column.edit)
                    .attr("data-format", column.format)
                    .attr("data-locked", column.locked)
                    .addClass(column.locked ? "" : "editorModified")
                    .text(column.content)
                    .appendTo($cell);

        column.format && doFormat($span);
        $cell.appendTo($row);
      }

      let $deleteCell = $("<td>", { class: "editorDelete" })
                          .appendTo($row);

      if (! insertedRows.length) {
        $deleteCell
        .append($("<img>", { src: "/images/badge_minus.png" }));
      }

      insertedRows.push($row);

      setDirty();
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
  }


  //
  // Save & settings...
  //

  function setDirty() {
    $("#editorSaveButton").removeClass("standardButtonDisabled");
  }

  function clearDirty() {
    $("#editorSaveButton").addClass("standardButtonDisabled");
  }

  function isDirty() {
    return ! $("#editorSaveButton").hasClass("standardButtonDisabled");
  }

  $.events.subscribe("setdirty.editor", function() {
    setDirty();
  });

  $.events.subscribe("cleardirty.editor", function() {
    clearDirty();
  });

  function getSectionContents(sectionName) {
    let $table = $(`table[data-section=${sectionName}]`);
    if ($table.exists()) {
      let section = {
        title: $("th.editorSectionTitle", $table).text(),
        items: []
      };

      let currentDataId;
      let currentItem;
      $("tr[data-id]", $table).each(function() {
        let $row = $(this);

        let dataId = $row.attr("data-id");
        if (dataId !== currentDataId) {
          currentDataId = dataId;

          if (currentItem) {
            section.items.push(currentItem);
          }

          currentItem = {
            _id: $row.attr("data-record"),
            visible: true
          };
        }

        $("span[data-id]", $row).each(function() {
          let $span = $(this);
          let text = ($span.attr("data-edit") === "large") ? fromDisplayList($span) : $span.text();

          if ($span.attr("data-raw")) {
            text = $span.attr("data-raw");
          }

          currentItem[$span.attr("data-id")] = text;
        });
      });

      if (currentItem) {
        section.items.push(currentItem);
      }

      return section;
    }
  }

  function save() {
    endEdit();

    let $cv = $("#cvPersonal");
    let id = $cv.attr("data-id");
    let email = $cv.attr("data-user");
    let hash = $cv.attr("data-hash");

    let styling = [];
    for (const [selector, styles] of $.dazzle.styling.entries()) {
      for (const [style, value] of styles.entries()) {
        styling.push(`${selector} { ${style}: ${value}; }`);
      }
    }

    let cv = {
      _id: id,
      email: email,
      hash: hash,
      blurb: getSectionContents("blurb"),
      personal: getSectionContents("personal"),
      education: getSectionContents("education"),
      employment: getSectionContents("employment"),
      styling: styling
    };

    $.ajax({
      url: `/${email}`,
      method: "PUT",
      data: cv
    }).done((data, status) => {
      console.log("editor-save [response-data=%o][status=%o]", data, status);

      $(".cvSection span").removeClass("editorModified");
      clearDirty();
    });
  }


  //
  // Hook up the events...
  //

  let $cv = $("div#cvPersonal");
  $cv.on("click", "td", passClick);
  $cv.on("click", ".editorAdd", addSectionItem);
  $cv.on("click", ".editorDelete", deleteSectionItem);
  $cv.on("keypress", "input", function(event) {
    if (event.which === 13) {
      endEdit();
      return false;
    }
  });
  $("body").click(endEdit);

  $(document).keyup(function(event) {
    if (event.keyCode === 27) {
      endEdit();
    }
    else if (event.keyCode === 9) {
      if (event.shiftKey) {
        tabBackward($edit);
      }
      else {
        tabForward($edit);
      }
      event.stopPropagation();
    }
  });

  $("#editorSaveButton").click(function() {
    if (isDirty()) {
      save();
    }
  });
});