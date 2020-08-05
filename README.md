# react-unsaved
React use browser previous page, button click, refresh page or close window, trigger confirm message

![Leave with button event](https://jason-tseng.s3-ap-northeast-1.amazonaws.com/leave-with-button-event.gif)
![Leave with router change](https://jason-tseng.s3-ap-northeast-1.amazonaws.com/leave-with-router-change.gif)

If your react-router is version 5, just use master branch directly; If it's v6, you can checkout branch into feature/v6

```
import { ModalUnsaved } from 'react-unsaved';

<ModalUnsaved
  modalShow={() => modalRef.current.show()} // How to open your modal
  modalClose={() => modalRef.current.close()} // How to close your modal
  message="Are you sure you want to leave page without saving?"
>
  {(message, onClose, onConfirm) => (
    // your modal with my methods
    <ModalConfirm
      ref={modalRef}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <h5>{message}</h5>
    </ModalConfirm>
  )}
</ModalUnsaved>
```

And this is my example of component ModalConfirm.jsx

```
import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

class ModalUnsavedConfirm extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  hideModal = () => {
    this.setState({
      visible: false,
    });
  };

  onClose = (event) => {
    this.hideModal();
    this.props.onClose(event);
  };

  render() {
    return (
      <Modal
        title="Confirm leave?"
        visible={this.state.visible}
        onOk={this.props.onConfirm}
        onCancel={this.onClose}
        okText="Confirm"
        cancelText="Close"
        zIndex="1005" // Should higher than all other modals
      >
        {this.props.children}
      </Modal>
    );
  }
}

ModalUnsavedConfirm.defaultProps = {
  children: null,
};

ModalUnsavedConfirm.propTypes = {
  children: PropTypes.node,
}

export default ModalUnsavedConfirm;
```

How to activate confirm leave event:
```
import { unsavedInstance } from 'react-unsaved';

// After you modified your form data or state, you can enable event after setState
unsavedInstance.enable();

// If you call API that saving your form, you can disable event after success callback
unsavedInstance.disable();
```

If your button doesn't change route, like close modal, you can set your button onClick event like this:
```
import { unsavedInstance } from 'react-unsaved';

const closeModal = () => {
  if (unsavedInstance.getUnsavedStatus()) {
    unsavedInstance.showModal();
    unsavedInstance.setAfterConfirmEvent(() => {
      toggleVisible(false);
    });
  } else {
    toggleVisible(false);
  }
};
```
So after that setting your event would bind on confirm leave modal's button event.
