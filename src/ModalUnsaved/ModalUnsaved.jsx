var React = require('react');
var PropTypes = require('prop-types');
var reactRouter = require('react-router');
var UNSAVED_CONSTANTS = require('../unsavedConstants');
var unsavedInstance = require('../unsavedInstance');
var observerInterface = require('../observerInterface');
var BeforeUnloadHandler = require('./BeforeUnloadHandler');
var createReactClass = require('create-react-class');

var Prompt = reactRouter.Prompt;
var withRouter = reactRouter.withRouter;

var ModalUnsaved = createReactClass({
  getInitialState: function() {
    return {
      isConfirmLeaveActive: false, // 是否要出現確認離開
      isModalUnsavedActive: false, // 是否打開了確認離開 modal
    };
  },

  componentDidMount: function() {
    var self = this;
    observerInterface.subscribe(UNSAVED_CONSTANTS.ACTION.UNSAVED_ACTIVE, function(bool) {
      self.setState(function(prevState) {
        return {
          isConfirmLeaveActive: bool,
        };
      });
    });
    observerInterface.subscribe(UNSAVED_CONSTANTS.ACTION.MODAL_ACTIVE, function(bool) {
      self.setState(function(prevState) {
        return {
          isModalUnsavedActive: bool,
        };
      });
    });
    this.props.history.listen(function(location, action) {
      // For after <Prompt> event
      unsavedInstance.disable();
    });
  },

  componentDidUpdate: function(prevProps, prevState, snapshot) {
    if (this.state.isModalUnsavedActive === true) {
      this.props.modalShow();
    }
  },

  componentWillUnmount: function() {
    if (this.state.isConfirmLeaveActive
      && !this.state.isModalUnsavedActive) {
      this.onConfirm();
    }
    observerInterface.unsubscribe(UNSAVED_CONSTANTS.ACTION.UNSAVED_ACTIVE);
    observerInterface.unsubscribe(UNSAVED_CONSTANTS.ACTION.MODAL_ACTIVE);
  },

  onClose: function() {
    unsavedInstance.closeModal();
  },

  onConfirm: function() {
    if (unsavedInstance.doAfterConfirmEvent instanceof Function) {
      unsavedInstance.doAfterConfirmEvent();
      this.modalClose();
      unsavedInstance.disable();
      this.props.modalClose();
    }
  },

  render: function() {
    return React.createElement(React.Fragment, null,
      React.createElement(BeforeUnloadHandler, {
        active: this.state.isConfirmLeaveActive,
      }, null),
      React.createElement(Prompt, {
        when: this.state.isConfirmLeaveActive && !this.state.isModalUnsavedActive,
        message: this.props.message,
      }, null),
      this.props.children(
        this.onClose,
        this.onConfirm,
        this.props.message,
      ),
    );
  },

  getDefaultProps: function() {
    return {
      message: 'Are you sure you want to leave page without saving?',
      history: {
        listen: function() {},
      },
      modalShow: function() {},
      modalClose: function() {},
    };
  },

  propTypes: {
    children: PropTypes.func.isRequired,
    message: PropTypes.string,
    history: PropTypes.shape({
      listen: PropTypes.func,
    }),
    modalShow: PropTypes.func,
    modalClose: PropTypes.func,
  },
});

/*
Example usage:
<ModalUnsaved
  modalShow={() => modalRef.current.show()}
  modalClose={() => modalRef.current.close()}
  message={i18nResource.t('i18n_unsavedConfirmDesc')}
>
  {(message, onClose, onConfirm) => (
    <ModalConfirm
      ref={modalRef}
      className={styles['unsaved-modal']}
      onClose={onClose}
      onConfirm={onConfirm}
    >
      <h5>{message}</h5>
    </ModalConfirm>
  )}
</ModalUnsaved>
*/

module.exports = withRouter(ModalUnsaved);
