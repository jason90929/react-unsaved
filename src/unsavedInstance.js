import UNSAVED_CONSTANTS from './unsavedConstants';
import observerInterface from './observerInterface';

let unsavedActive = false;
let confirmEvent = _.noop;

const unsavedInstance = {
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

  setAfterConfirmEvent(event = () => {}) {
    confirmEvent = event;
  },

  getAfterConfirmEvent() {
    return confirmEvent;
  },

  doAfterConfirmEvent() {
    return confirmEvent();
  },
};

export default unsavedInstance;
