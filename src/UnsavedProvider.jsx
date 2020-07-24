var React = require('react');
var PropTypes = require('prop-types');
var reactRouter = require('react-router-dom');
var unsavedInstance = require('./unsavedInstance');

var withRouter = reactRouter.withRouter;

var UnsavedProvider = React.createClass({
  getChildrenClick: function () {
    const {
      children,
      history,
    } = this.props;
    if (children.props.onClick) {
      return children.props.onClick;
    }
    if (children.props.to) {
      return function() {
        history.push(children.props.to);
      };
    }
    return function () {
      console.warn('Unsaved providers children should have props onClick');
    };
  },

  onClick: function (event) {
    event.stopPropagation();
    event.preventDefault();

    const childrenClick = this.getChildrenClick();
    if (unsavedInstance.getUnsavedStatus()) {
      unsavedInstance.showModal();
      unsavedInstance.setAfterConfirmEvent(function() {
        childrenClick(event);
      });
      return;
    }
    childrenClick(event);
  },

  render() {
    var children = this.props.children;

    return (
      React.cloneElement(React.Children.only(children), {
        onClick: this.onClick,
      })
    );
  },

  getDefaultProps: function() {
    return {
      children: null,
      history: {
        push: function() {},
      }, // From withRouter()
    };
  },

  propTypes: {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func,
    }), // From withRouter()
  },
});

export default withRouter(UnsavedProvider);
