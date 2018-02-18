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

  $("body").click(endEdit);

  $("div#cvPersonal .editorClickable").click(startEdit);

  $("td").click(passClick);

  $("span.editorAdd").click(function() {
    let $parent = $(this).parent();
    let $table = $("table", $parent).first();
    let columns = Number.parseInt($table.attr("data-columns"));
    console.log("add-record (columns=%d)", columns);

    let $row = $("tr", $table).last();
    let $new = $row
                .clone()
                .attr("data-id", "");

    $("td", $new).click(passClick);
    $("input", $new).attr("checked", true);
    $("span", $new)
      .addClass("editorClickable")
      .addClass("editorModified")
      .text("")
      .click(startEdit);

    $table.append($new);
  });
});