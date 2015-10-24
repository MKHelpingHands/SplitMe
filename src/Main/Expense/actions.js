'use strict';

const actionTypes = require('redux/actionTypes');
const utils = require('utils');
const expenseUtils = require('Main/Expense/utils');
const modalActions = require('Main/Modal/actions');
const accountActions = require('Main/Account/actions');
const accountUtils = require('Main/Account/utils');
const screenActions = require('Main/Screen/actions');
const {pushState} = require('redux-router');
const API = require('API');

function isValideExpense(expense) {
  if (!utils.isNumber(expense.get('amount'))) {
    return {
      status: false,
      message: 'expense_add_error.amount_empty',
    };
  }

  if (expense.get('paidByContactId') === null) {
    return {
      status: false,
      message: 'expense_add_error.paid_for_empty',
    };
  }

  if (expenseUtils.getTransfersDueToAnExpense(expense).length === 0) {
    return {
      status: false,
      message: 'expense_add_error.paid_by_empty',
    };
  }

  return {
    status: true,
  };
}

function isValideContact(contact, state) {
  if (accountUtils.getAccountMember(state.get('accountCurrent'), contact.id)) {
    return {
      status: false,
      message: 'contact_add_error.already',
    };
  }

  if (contact.displayName == null) {
    return {
      status: false,
      message: 'contact_add_error.no_name',
    };
  }

  return {
    status: true,
  };
}

function getRouteBackExpense(router) {
  switch (router.routes[1].path) {
    case 'expense/add':
      return '/';

    case 'account/:id/expense/:expenseId/edit':
    case 'account/:id/expense/add':
      return '/account/' + router.params.id + '/expenses';

    default:
      console.error('called for nothings');
      return false;
  }
}

const actions = {
  close() {
    return (dispatch, getState) => {
      const state = getState();
      const router = state.get('router');

      dispatch(pushState(null, getRouteBackExpense(router)));
    };
  },
  tapSave() {
    return (dispatch, getState) => {
      const state = getState();
      const isExpenseValide = isValideExpense(state.get('expenseCurrent'));

      if (isExpenseValide.status) {
        const router = state.get('router');

        dispatch(pushState(null, getRouteBackExpense(router)));
        dispatch({
          type: actionTypes.EXPENSE_TAP_SAVE,
          payload: API.putExpense(state.get('expenseCurrent')),
          meta: {
            accountCurrent: state.get('accountCurrent'),
            expenseOpened: state.get('expenseOpened'),
          },
        }).then(() => {
          dispatch(accountActions.replaceAccount(
            getState().get('accountCurrent'),
            state.get('accountOpened'), true, true));
        });
      } else {
        dispatch(modalActions.show(
          [
            {textKey: 'ok'},
          ],
          isExpenseValide.message
        ));
      }
    };
  },
  navigateBack() {
    return (dispatch, getState) => {
      const state = getState();

      if (state.getIn(['screen', 'dialog']) === '') {
        if (state.get('expenseCurrent') !== state.get('expenseOpened')) {
          let description;

          if (state.get('router').routes[1].path === 'account/:id/expense/:expenseId/edit') {
            description = 'expense_confirm_delete_edit';
          } else {
            description = 'expense_confirm_delete';
          }

          dispatch(modalActions.show(
            [
              {textKey: 'cancel'},
              {textKey: 'delete', dispatchAction: actions.close},
            ],
            description
          ));
        } else {
          dispatch(actions.close());
        }
      } else {
        dispatch(screenActions.dismissDialog());
      }
    };
  },
  changePaidBy(paidByContactId) {
    return {
      type: actionTypes.EXPENSE_CHANGE_PAID_BY,
      paidByContactId: paidByContactId,
    };
  },
  changeRelatedAccount(relatedAccount) {
    return {
      type: actionTypes.EXPENSE_CHANGE_RELATED_ACCOUNT,
      relatedAccount: relatedAccount,
    };
  },
  pickContact(contact, useAsPaidBy) {
    return (dispatch, getState) => {
      const isValide = isValideContact(contact, getState());

      if (isValide.status) {
        dispatch({
          type: actionTypes.EXPENSE_PICK_CONTACT,
          contact: contact,
          useAsPaidBy: useAsPaidBy,
        });
      } else {
        dispatch(modalActions.show(
          [
            {textKey: 'ok'},
          ],
          isValide.message
        ));
      }
    };
  },
  changeCurrent(key, value) {
    return {
      type: actionTypes.EXPENSE_CHANGE_CURRENT,
      key: key,
      value: value,
    };
  },
  tapDelete() {
    return (dispatch, getState) => {
      const state = getState();
      const router = state.get('router');

      dispatch(pushState(null, '/account/' + router.params.id + '/expenses'));
      dispatch({
        type: actionTypes.EXPENSE_TAP_DELETE,
        payload: {
          expenseCurrent: state.get('expenseCurrent'),
        },
      });

      const newState = getState();
      dispatch(accountActions.replaceAccount(
        newState.get('accountCurrent'), newState.get('accountOpened'), true, true));

      API.removeExpense(state.get('expenseCurrent'));
    };
  },
};

module.exports = actions;
