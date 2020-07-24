import React from 'react';
import PropTypes from 'prop-types';

class BeforeUnloadHandler extends React.Component {
  componentDidMount() {
    if (this.props.active) {
      window.addEventListener('beforeunload', this.confirmLeaveHandle);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.active) {
      window.addEventListener('beforeunload', this.confirmLeaveHandle);
    } else {
      window.removeEventListener('beforeunload', this.confirmLeaveHandle);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.confirmLeaveHandle);
  }

  confirmLeaveHandle = (event) => {
    const bindEvent = event || window.event;
    // For IE and Firefox
    if (bindEvent) {
      bindEvent.returnValue = this.props.message;
    }
    // For Safari
    return this.props.message;
  };

  render() {
    return null;
  }
}

BeforeUnloadHandler.defaultProps = {
  message: '',
  active: false,
};

BeforeUnloadHandler.propTypes = {
  message: PropTypes.string,
  active: PropTypes.bool,
};

BeforeUnloadHandler.whyDidYouRender = true;

export default BeforeUnloadHandler;
