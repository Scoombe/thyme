// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import type { RouterHistory } from 'react-router';

import Button from 'semantic-ui-react/dist/commonjs/elements/Button';
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon';
import Popup from 'semantic-ui-react/dist/commonjs/modules/Popup';
import Menu from 'semantic-ui-react/dist/commonjs/collections/Menu';

import { logout } from '../../actions';

import { isLoggedIn, hasPremium, isLoaded } from '../../selectors';

import Status from '../Status';
import Login from '../Login';

import './MenuItem.css';

type AccountProps = {
  history: RouterHistory;
  onLogout: () => void;
  loggedIn: boolean;
  showPremium: boolean;
}

type AccountState = {
  isOpen: boolean;
}

class Account extends Component<AccountProps, AccountState> {
  state = {
    isOpen: false,
  };

  onLogout = () => {
    const { onLogout } = this.props;

    onLogout();
  };

  handleOpen = () => this.setState({ isOpen: true });

  handleClose = () => this.setState({ isOpen: false });

  goToSettings = () => {
    const { history } = this.props;

    history.push('/account');
    this.handleClose();
  };

  goToPremium = () => {
    const { history } = this.props;

    history.push('/premium');
    this.handleClose();
  };

  render() {
    const { loggedIn, showPremium } = this.props;
    const { isOpen } = this.state;

    return (
      <Popup
        className="Account-PopUp"
        trigger={(
          <Button
            secondary={loggedIn}
            inverted={!loggedIn}
          >
            { !loggedIn && <Icon name="unlock" /> }
            { loggedIn ? <Status closePopup={this.handleClose} /> : 'Login' }
          </Button>
        )}
        open={isOpen}
        position="bottom right"
        on="click"
        onClose={this.handleClose}
        onOpen={this.handleOpen}
      >
        { loggedIn ? (
          <Menu vertical>
            {showPremium && (
              <Menu.Item name="premium" className="Account-BackUp">
                Syncing is disabled without premium subscription.

                <Button primary fluid onClick={this.goToPremium}>
                  <Icon name="diamond" />
                  Buy Premium
                </Button>
              </Menu.Item>
            )}
            <Menu.Item
              name="settings"
              onClick={this.goToSettings}
            >
              Account settings
            </Menu.Item>
            <Menu.Item
              name="logout"
              onClick={this.onLogout}
            >
              Logout
            </Menu.Item>
          </Menu>
        ) : (
          <div className="Account-PopUp-Content">
            <Login goToRegister={this.goToPremium} />
          </div>
        )}
      </Popup>
    );
  }
}

function mapStateToProps(state) {
  return {
    loggedIn: isLoggedIn(state),
    showPremium: !hasPremium(state) && isLoaded(state),
  };
}

function mapDispatchToProps(dispatch: ThymeDispatch) {
  return {
    onLogout() {
      dispatch(logout());
    },
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRouter,
)(Account);
