'use strict';

var React = require('react');
var Immutable = require('immutable');
var colors = require('material-ui/lib/styles/colors');
var ListItem = require('material-ui/lib/lists/list-item');
var connect = require('react-redux').connect;

var polyglot = require('polyglot');
var facebookActions = require('Main/Facebook/actions');

var styles = {
  root: {
    minHeight: 32,
  },
  facebookEmail: {
    color: colors.grey600,
  },
};

var FacebookLogin = React.createClass({
  propTypes: {
    dispatch: React.PropTypes.func.isRequired,
    facebook: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  },
  mixins: [
    React.addons.PureRenderMixin,
  ],
  onTouchTapLogin: function() {
    this.props.dispatch(facebookActions.login());
  },
  render: function() {
    var facebook = this.props.facebook;

    if (facebook.get('status') === 'connected') {
      var email;

      if (facebook.get('me')) {
        email = <div style={styles.facebookEmail}>
            {'(' + facebook.getIn(['me', 'email']) + ')'}
          </div>;
      }

      return <ListItem disabled={true}>
          <div style={styles.root}>
            <div>{polyglot.t('facebook_you_are_logged')}</div>
            {email}
          </div>
        </ListItem>;
    } else {
      return <ListItem onTouchTap={this.onTouchTapLogin}>
          {polyglot.t('facebook_login')}
        </ListItem>;
    }
  },
});

module.exports = connect()(FacebookLogin);
