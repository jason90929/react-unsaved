var React = require('react');
var PropTypes = require('prop-types');

var BeforeUnloadHandler = React.createClass({
  componentDidMount: function() {
    if (this.props.active) {
      window.addEventListener('beforeunload', this.confirmLeaveHandle);
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.active) {
      window.addEventListener('beforeunload', this.confirmLeaveHandle);
    } else {
      window.removeEventListener('beforeunload', this.confirmLeaveHandle);
    }
  },

  componentWillUnmount: function() {
    window.removeEventListener('beforeunload', this.confirmLeaveHandle);
  },

  confirmLeaveHandle: function(event) {
    const bindEvent = event || window.event;
    // For IE and Firefox
    if (bindEvent) {
      bindEvent.returnValue = this.props.message;
    }
    // For Safari
    return this.props.message;
  },

  render() {
    return null;
  },

  getDefaultProps: function() {
    return {
      message: '',
      active: false,
    };
  },

  propTypes: {
    message: PropTypes.string,
    active: PropTypes.bool,
  },
});

module.exports = BeforeUnloadHandler;
