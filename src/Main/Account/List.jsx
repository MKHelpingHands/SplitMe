'use strict';

var React = require('react');
var _ = require('underscore');
var AppCanvas = require('material-ui/lib/app-canvas');
var AppBar = require('material-ui/lib/app-bar');
var FloatingActionButton = require('material-ui/lib/floating-action-button');
var Paper = require('material-ui/lib/paper');
var DropDownIcon = require('material-ui/lib/drop-down-icon');

var polyglot = require('../../polyglot');
var List = require('../List/List');
var ListBalance = require('./ListBalance');
var Avatar = require('../Avatar/Avatar');
var pageAction = require('../pageAction');
var action = require('./action');

require('./list.less');

var AccountList = React.createClass({
  propTypes: {
    accounts: React.PropTypes.array.isRequired,
  },

  onTouchTapList: function(account, event) {
    event.preventDefault();
    action.tapList(account);
  },

  onTouchTapAddExpense: function(event) {
    event.preventDefault();
    action.tapAddExpense();
  },

  onChangeDropDownIcon: function(event, key, payload) {
    if (payload.payload === 'settings') {
      pageAction.navigateSettings();
    }
  },

  render: function () {
    var self = this;

    var appBarMenuItems = [
      { payload: 'settings', text: polyglot.t('settings') },
    ];

    return <AppCanvas predefinedLayout={1}>
      <AppBar title={polyglot.t('my_accounts')} showMenuIconButton={false}>
        <DropDownIcon className="app-bar-drop-down-icon" iconClassName="md-more-vert" menuItems={appBarMenuItems}
          onChange={self.onChangeDropDownIcon} />
      </AppBar>
      <div className="app-content-canvas account">
        <Paper zDepth={1} rounded={false}>
          {_.map(this.props.accounts, function (account) {
            var avatar = <Avatar contacts={account.members} />;
            var listBalance = <ListBalance account={account} />;

            return <List left={avatar} right={listBalance} className="mui-menu-item"
                    onTouchTap={self.onTouchTapList.bind(self, account)} key={account._id}>
                  {account.name}
                </List>;
          })}
        </Paper>
      </div>
      <div id="button-main">
        <FloatingActionButton
          iconClassName="md-add"
          secondary={true}
          onTouchTap={this.onTouchTapAddExpense} />
      </div>
    </AppCanvas>;
  }
});

module.exports = AccountList;
