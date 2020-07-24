var UNSAVED_CONSTANTS = require('./unsavedConstants');
var observerInterface = require('./observerInterface');

var unsavedActive = false;
var confirmEvent = () => {};

var unsavedInstance = {
  enable() {
    unsavedActive = true;
    observerInterface.emit(UNSAVED_CONSTANTS.ACTION.UNSAVED_ACTIVE, true);
  },

  disable() {
    unsavedActive = false;
    observerInterface.emit(UNSAVED_CONSTANTS.ACTION.UNSAVED_ACTIVE, false);
  },

  getUnsavedStatus() {
    return unsavedActive;
  },

  showModal() {
    observerInterface.emit(UNSAVED_CONSTANTS.ACTION.MODAL_ACTIVE, true);
  },

  closeModal() {
    observerInterface.emit(UNSAVED_CONSTANTS.ACTION.MODAL_ACTIVE, false);
  },

  setAfterConfirmEvent(event) {
    if (!event) {
      event = function () {}
    }
    confirmEvent = event;
  },

  getAfterConfirmEvent() {
    return confirmEvent;
  },

  doAfterConfirmEvent() {
    return confirmEvent();
  },
};

module.exports = unsavedInstance;
