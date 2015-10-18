'use strict';

const React = require('react');
const PureRenderMixin = require('react/lib/ReactComponentWithPureRenderMixin');
const colors = require('material-ui/src/styles/colors');

const styles = {
  root: {
    fontSize: 14,
    color: colors.lightBlack,
    margin: 16,
    fontWeight: 500,
  },
};

const ListSubheader = React.createClass({
  propTypes: {
    subheader: React.PropTypes.string.isRequired,
  },
  mixins: [
    PureRenderMixin,
  ],
  render() {
    return (
      <div style={styles.root} data-test="ListSubheader">
        {this.props.subheader}
      </div>
    );
  },
});

module.exports = ListSubheader;
