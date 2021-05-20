var React = require('react');
var reactRouterDOM = require('react-router-dom');
var unsavedInstance = require('./unsavedInstance');

var UnsavedProvider = function(props) {
  var children = props.children;
  var navigate = reactRouterDOM.useNavigate();

  var getChildrenClick = function () {
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
  };

  var onClick = function (event) {
    event.stopPropagation();
    event.preventDefault();

    var childrenClick = getChildrenClick();
    if (unsavedInstance.getUnsavedStatus()) {
      unsavedInstance.showModal();
      unsavedInstance.setAfterConfirmEvent(function() {
        childrenClick(event);
      });
      return;
    }
    childrenClick(event);
  };

  return (
    React.cloneElement(React.Children.only(children), {
      onClick: onClick,
    })
  );
};

module.exports = UnsavedProvider;
