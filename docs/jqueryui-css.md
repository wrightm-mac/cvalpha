# jQueryUI CSS Overrides

## accordion

* **ui-accordion** The outer container of the accordion.
    * **ui-accordion-header** The headers of the accordion. The active header will additionally have a *ui-accordion-header-active* class, the inactive headers will have a *ui-accordion-header-collapsed* class. The headers will also have a *ui-accordion-icons* class if they contain icons.
    * **ui-accordion-header-icon** Icon elements within each accordion header.
    * **ui-accordion-content** The content panels of the accordion. The active content panel will additionally have a *ui-accordion-content-active* class.


## button

* **ui-button** The DOM element that represents the button. This element will additionally have the *ui-button-icon-only* class, depending on the showLabel and icon options.
    * **ui-button-icon** The element used to display the button icon. This will only be present if an icon is provided in the icon option.
    * **ui-button-icon-space** A separator element between icon and text content of the button. This will only be present if an icon is provided in the icon option and the iconPosition option is set to "beginning" or "end".


## checkboxradio

* **ui-checkboxradio** The input of type radio or checkbox. Will be hidden, with its associated label positioned on top.
    * **ui-checkboxradio-label** The label associated with the input. If the input is checked, this will also get the *ui-checkboxradio-checked* class. If the input is of type radio, this will also get the *ui-checkboxradio-radio-label* class.
    * **ui-checkboxradio-icon** If the icon option is enabled, the generated icon has this class.
    * **ui-checkboxradio-icon-space** If the icon option is enabled, an extra element with this class as added between the text label and the icon.


## dialog

* **ui-dialog** The outer container of the dialog. If the draggable option is set, the *ui-dialog-dragging* class is added during a drag. If the resizable option is set, the *ui-dialog-resizing* class is added during a resize. If the buttons option is set, the *ui-dialog-buttons* class is added.
    * **ui-dialog-titlebar** The title bar containing the dialog's title and close button.
    *    * **ui-dialog-title** The container around the textual title of the dialog.
    *    * **ui-dialog-titlebar-close** The dialog's close button.
    * **ui-dialog-content** The container around the dialog's content. This is also the element the widget was instantiated with.
    * **ui-dialog-buttonpane** The pane that contains the dialog's buttons. This will only be present if the buttons option is set.
        * **ui-dialog-buttonset** The container around the buttons themselves.


## progressbar

* **ui-progressbar** The outer container of the progressbar. This element will additionally have a class of *ui-progressbar-indeterminate* for indeterminate progressbars. For determinate progressbars, the *ui-progressbar-complete* class is added once the maximum value is reached.
    * **ui-progressbar-value** The element that represents the filled portion of the progressbar.
        * **ui-progressbar-overlay** Overlay used to display an animation for indeterminate progressbars.

## slider

* **ui-slider** The track of the slider control. This element will additionally have a class name of *ui-slider-horizontal* or *ui-slider-vertical* depending on the orientation option of the slider.
    * **ui-slider-handle** One of the slider handles.
    * **ui-slider-range**: The selected range used when the range option is set. This element can additionally have a class of *ui-slider-range-min* or *ui-slider-range-max* if the range option is set to "min" or "max" respectively.


## spinner

* **ui-spinner** The outer container of the spinner.
    * **ui-spinner-input** The `<input>` element that the Spinner widget was instantiated with.
    * **ui-spinner-button** The button controls used to increment and decrement the spinner's value. The up button will additionally have a *ui-spinner-up* class and the down button will additionally have a *ui-spinner-down* class.


## tooltip

* **ui-tooltip** The outer container for the tooltip.
    * **ui-tooltip-content** The content of the tooltip.
