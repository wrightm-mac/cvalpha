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

  $("body").click(endEdit);

  $("div#cvPersonal .editorClickable").click(startEdit);
});