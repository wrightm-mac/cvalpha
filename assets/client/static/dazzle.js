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


function colorSelection(colors, selectedColor) {
  let $controls = $("<div>");

  let $table = $("<table>").appendTo($controls);
  let $row = $("<tr>").appendTo($controls);

  let $box = $("<td>", { class: "dazzleColorBox" }).appendTo($row);
  for (let color of colors) {
    $("<div>", { class: "dazzleColorDot" })
      .css("background-color", color.hex)
      .attr("title", color.name)
      .tooltip()
      .click(function() {
        let rgb = $(this).css("background-color");
        $("#dazzleColorSwatch").css("background-color", rgb);

        let colors = $.colors.fromCssRgb(rgb);
        $("#dazzleColorSliderRed").slider("value", colors[0]);
        $("#dazzleColorSliderGreen").slider("value", colors[1]);
        $("#dazzleColorSliderBlue").slider("value", colors[2]);
      })
      .appendTo($box);
  }

  let $sliders = $("<td>", { class: "dazzleColorSliderBox" }).appendTo($row);

  let sliderFn = (color, value) => {
    $("<div>", { id: `dazzleColorSlider${color}` })
      .slider({
        orientation: "vertical",
        animate: true,
        range: "min",
        min: 0,
        max: 255,
        value: value,
        change: function() {
          let hex = $.colors.hexFromRGB(
            $("#dazzleColorSliderRed").slider("value"),
            $("#dazzleColorSliderGreen").slider("value"),
            $("#dazzleColorSliderBlue").slider("value"),
          );
          $("#dazzleColorSwatch").css("background-color", "#" + hex);
        }
      })
      .appendTo($sliders);
  };

  let rgb = $.colors.fromCssRgb(selectedColor);
  sliderFn("Red", rgb[0]);
  sliderFn("Green", rgb[1]);
  sliderFn("Blue", rgb[2]);

  $("<div>", { id: "dazzleColorSwatch" })
    .css("background-color", selectedColor)
    .appendTo($sliders);

  return $controls;
}

function fontList(fonts) {
  let $fonts = $("<select>", { class: "dazzleFontList" })
    .change(function() {
      let $this = $(this);
      $this.css("font-family", $this.val());
    });

  for (let font of fonts) {
    let fontStyling = `${font.name}, ${font.family}, ${font.type}`;
    $("<option>", { class: "dazzleFontOption", attr: { value: fontStyling } })
      .css("font-family", fontStyling)
      .text(font.name)
      .appendTo($fonts);
  }

  return $fonts;
}

function selectOption($list, option) {
  for (let child of $list.children()) {
    if ($(child).val() === option) {
      $(child).attr("selected", true);
      break;
    }
  }
}

function translateMask(mask, value) {
  while (mask.includes("$")) {
    mask = mask.replace("$", value);
  }

  return mask;
}

function populateSections(config, colors, fonts) {
  let $accordion = $("<div>");

  for (let section of config.sections) {
      $("<h3>").text(section.title).appendTo($accordion);

      let $table = $("<table>", { id: "dazzleOptions" });
      for (let part of section.parts) {
          let $row = $("<tr>").appendTo($table);

          $("<td>", { class: "dazzleOptionName" })
              .text(part.name)
              .appendTo($row);

          let $type = $("<td>", { class: "dazzleOptionValue" })
              .text(part.type)
              .appendTo($row);

          let value = $.selectors.getCss(part.selectors, part.initial || part.style);

          switch (part.type) {
              case "color":
                  let $div = $("<div>")
                      .button()
                      .addClass("dazzleColorButton")
                      .css("background-color", value)
                      .click(function() {
                          colorSelection(colors, $div.css("background-color")).showModalDialog({
                              title: `Select Color for '${section.title} ${part.name}'`,
                              width: 555,
                              height: 420,
                              modal: true,
                              resizable: false,
                              buttons: {
                                  OK: function() {
                                      let color = $(this).find("#dazzleColorSwatch").css("background-color");
                                      $div.css("background-color", color);
                                      $.selectors.applyCss(part.selectors, part.style, color, section.container);

                                      $(this).hideModalDialog();
                                  },
                                  Cancel: function() {
                                      $(this).hideModalDialog();
                                  }
                              }
                          });
                      });
                  $type.html($div);
                  break;
              case "number":
              case "float":
                  let multiplier = part.multiplier || 1;
                  let currentValue = (part.type === "number") ? Number.parseInt(value) : parseFloat(value);
                  let $numDiv = $("<div>").slider({
                      value: currentValue * multiplier,
                      animate: "fast",
                      min: part.min * multiplier,
                      max: part.max * multiplier,
                      change: function(event, args) {
                          let value = args.value / multiplier;
                          let newValue = part.translate ? translateMask(part.translate, value) : value;
                          $.selectors.applyCss(part.selectors, part.style, newValue, section.container);
                      }
                  });
                  $type.html($numDiv);
                  break;
              case "font":
                  let $fontList = fontList(fonts);
                  selectOption($fontList, value);
                  $type.html($fontList);
                  $fontList.change(function() {
                      $.selectors.applyCss(part.selectors, part.style, $(this).val(), section.container);
                  });
                  break;
          }
      }

      $("<div>")
          .append($table)
          .appendTo($accordion);

      $table.append($("<tr>"));
  }

  $accordion.accordion({
      heightStyle: "fill"
  });

  return $accordion;
}


$(function() {
    console.log("dazzle: loaded");

    let $panel = $("#dazzlePanel");
    if (! $panel.exists()) {
      $panel = $("<div>", { id: "dazzlePanel" }).appendTo($("body"));
    }

  $("#editorSettingsIcon")
    .click(function() {
        if ($panel.hidden()) {
          $panel.fadeIn(50, function() {
            if ($panel.html() === "") {
              let $options = $("<div>", { id: "dazzleOptions" })
                .appendTo($panel);

              // Nasty promise stuff to load all config...
              $.getJSON("/data/dazzle.json")
                .then(config => {
                  return $.getJSON("/data/crayola.json")
                      .then(colors => {
                          return $.getJSON("/data/fonts.json")
                              .then(fonts => { return { config, colors, fonts } })
                      })
                })
                .then(({ config, colors, fonts }) => {
                  $options.append(populateSections(config, colors, fonts));
                });
            }

            $panel.resizable({
              handles: "n, w",
              animate: false,
              minWidth: 300,
              minHeight: 200,
              maxWidth: 750,
              maxHeight: 750
            });
          });
        } else {
            $panel.fadeOut(500);
        }
      });
});