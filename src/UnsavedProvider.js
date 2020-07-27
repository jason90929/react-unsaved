var React = require('react');
var PropTypes = require('prop-types');
var reactRouterDOM = require('react-router-dom');
var unsavedInstance = require('./unsavedInstance');
var createReactClass = require('create-react-class');

var UnsavedProvider = createReactClass({
  getChildrenClick: function () {
    var children = this.props.children;
    var navigate = reactRouterDOM.useNavigate();
    if (children.props.onClick) {
      return children.props.onClick;
    }
    if (children.props.to) {
      return function() {
        navigate(children.props.to);
      };
    }
    return function () {
      console.warn('Unsaved providers children should have props onClick');
    };
  },

  onClick: function (event) {
    event.stopPropagation();
    event.preventDefault();

    var childrenClick = this.getChildrenClick();
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
      navigate: function() {},
    };
  },

  propTypes: {
    children: PropTypes.node,
    navigate: PropTypes.func,
  },
});

module.exports = UnsavedProvider;
