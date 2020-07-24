import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import unsavedInstance from './unsavedInstance';

class UnsavedProvider extends React.Component {
  getChildrenClick = () => {
    const {
      children,
      history,
    } = this.props;
    if (children.props.onClick) {
      return children.props.onClick;
    }
    if (children.props.to) {
      return () => {
        history.push(children.props.to);
      };
    }
    return () => {
      console.warn('Unsaved providers children should have props onClick');
    };
  };

  onClick = (event) => {
    event.stopPropagation();
    event.preventDefault();

    const childrenClick = this.getChildrenClick();
    if (unsavedInstance.getUnsavedStatus()) {
      unsavedInstance.showModal();
      unsavedInstance.setAfterConfirmEvent(() => {
        childrenClick(event);
      });
      return;
    }
    childrenClick(event);
  };

  render() {
    const {
      children,
    } = this.props;

    return (
      React.cloneElement(React.Children.only(children), {
        onClick: this.onClick,
      })
    );
  }
}

UnsavedProvider.defaultProps = {
  children: null,
  history: {
    push: () => {},
  }, // From withRouter()
};

UnsavedProvider.propTypes = {
  children: PropTypes.node,
  history: PropTypes.shape({
    push: PropTypes.func,
  }), // From withRouter()
};

export default withRouter(UnsavedProvider);
