import React from 'react';
import PropTypes from 'prop-types';
import { Prompt, withRouter } from 'react-router';
import UNSAVED_CONSTANTS from '../unsavedConstants';
import unsavedInstance from '../unsavedInstance';
import observerInterface from '../observerInterface';
import BeforeUnloadHandler from './BeforeUnloadHandler';

class ModalUnsaved extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isConfirmLeaveActive: false, // 是否要出現確認離開
      isModalUnsavedActive: false, // 是否打開了確認離開 modal
    };
  }

  componentDidMount() {
    observerInterface.subscribe(UNSAVED_CONSTANTS.ACTION.UNSAVED_ACTIVE, (bool) => {
      this.setState((prevState) => ({
        isConfirmLeaveActive: bool,
      }));
    });
    observerInterface.subscribe(UNSAVED_CONSTANTS.ACTION.MODAL_ACTIVE, (bool) => {
      this.setState((prevState) => ({
        isModalUnsavedActive: bool,
      }));
    });
    this.props.history.listen((location, action) => {
      // For after <Prompt> event
      unsavedInstance.disable();
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.isModalUnsavedActive === true) {
      this.props.modalShow();
    }
  }

  componentWillUnmount() {
    if (this.state.isConfirmLeaveActive
      && !this.state.isModalUnsavedActive) {
      this.confirmLeave();
    }
    observerInterface.unsubscribe(UNSAVED_CONSTANTS.ACTION.UNSAVED_ACTIVE);
    observerInterface.unsubscribe(UNSAVED_CONSTANTS.ACTION.MODAL_ACTIVE);
  }

  modalClose = () => {
    unsavedInstance.closeModal();
  };

  confirmLeave = () => {
    if (_.isFunction(unsavedInstance.doAfterConfirmEvent)) {
      unsavedInstance.doAfterConfirmEvent();
      this.modalClose();
      unsavedInstance.disable();
      this.props.modalClose();
    }
  };

  render() {
    return (
      <>
        {/* For page reload */}
        <BeforeUnloadHandler active={this.state.isConfirmLeaveActive} />
        {/* For router change */}
        <Prompt
          when={this.state.isConfirmLeaveActive && !this.state.isModalUnsavedActive}
          message={this.props.message}
        />
        {/* For triggered by buttons */}
        {this.props.children(
          this.modalClose,
          this.confirmLeave,
          this.props.message
        )}
      </>
    );
  }
}

ModalUnsaved.defaultProps = {
  message: 'Are you sure you want to leave page without saving?',
  history: {
    listen: () => {},
  },
  modalShow: () => {},
  modalClose: () => {},
};

ModalUnsaved.propTypes = {
  message: PropTypes.string,
  history: PropTypes.shape({
    listen: PropTypes.func,
  }),
  modalShow: PropTypes.func,
  modalClose: PropTypes.func,
};

export default withRouter(ModalUnsaved);
