/* global WEB_COMPONENT_API_ENDPOINT */

import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import React, { Component } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';
import logoInfomaniak from '../images/logo-infomaniak.svg';
import iconMenu from '../images/menu.svg';
import i18n from '../lib/i18n';
import StyledSelect from '../lib/Select';
import BootstrapInput from '../lib/Input';

/**
 * @extends Component
 */
class IkHeader extends Component<Props> {
  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);

    this.state = {
      session: null,
    };
  }

  /**
   * @inheritdoc
   */
  componentDidMount() {
    fetch(
      `${WEB_COMPONENT_API_ENDPOINT}/api/components/profile/me?with=current_group,user,groups,products`, {
        method: 'GET',
        credentials: 'include',
        // eslint-disable-next-line no-confusing-arrow
      },
    ).then((response) => (response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText))))
      .then((json) => {
        if (json.data.user) {
          if (json.data.user.locale) {
            window.CONST_LANG = json.data.user.locale.substr(0, 2);
            i18n.changeLanguage(json.data.user.locale.substr(0, 2));
          }

          this.setState({
            session: json.data,
          });
        }
      });
  }

  /**
   * @inheritdoc
   */
  static onHandleMenuItemClick(selectedItem) {
    window.CONST_LANG = selectedItem.target.value;
    i18n.changeLanguage(selectedItem.target.value);
  }

  /**
   * Redirect to the login page.
   *
   * @inheritdoc
   */
  static onLogin() {
    window.location = `${WEB_COMPONENT_API_ENDPOINT}/auth/login/paste`;
  }

  showHeaderTitle() {
    const { session } = this.state;

    return (
      <>
        {session && session.current_group && !session.current_group.logo
        && (
          <p
            className="group-name"
          >
            {session.current_group.organization_name}
          </p>
        )}
        {session && session.current_group && session.current_group.logo
        && (
          <img
            alt="logo"
            src={session.current_group.logo}
            width="70"
          />
        )}
        {session && session.user && session.user.length === 0
        && (
          <img
            alt="logo"
            src={logoInfomaniak}
            width="70"
          />
        )}
      </>
    );
  }

  showNotConnectedMenu() {
    const { session } = this.state;
    const { t } = this.props;
    const languages = [
      'fr',
      'en',
      'it',
      'de',
      'es',
    ];

    if (!session || !session.user || session.user.length !== 0) {
      return false;
    }

    return (
      <>
        <div className="select-wrapper" id="menu-lang-selector">
          <StyledSelect
            defaultValue={i18n.language.substr(0, 2)}
            input={<BootstrapInput />}
            onChange={IkHeader.onHandleMenuItemClick}
            variant="outlined"
          >
            {languages.map((option) => (
              <MenuItem
                key={option}
                value={option}
              >
                {option}
              </MenuItem>
            ))}
          </StyledSelect>
        </div>
        <div className="login">
          <Button
            id="menu-login-button"
            color="primary"
            disableElevation
            onClick={IkHeader.onLogin}
            variant="contained"
          >
            {t('menu.login')}
          </Button>
        </div>
      </>
    );
  }

  showConnectedUserMenu() {
    const { session } = this.state;

    if (!session || !session.user || !session.user.id) {
      return false;
    }

    return (
      <div
        className="relative header-icon-wrapper header-icon-wrapper--hide-overflow"
      >
        <module-menu-user>
          <span slot="trigger">
            <div className="user-avatar-wrapper">
              <img
                className="avatar"
                alt="avatar"
                src={session.user.avatar}
                style={{
                  fontSize: '20px',
                  height: '40px',
                  width: '40px',
                }}
              />
            </div>
          </span>
        </module-menu-user>
      </div>
    );
  }

  showProductMenuRight() {
    const { session } = this.state;

    if (!session || !session.user || !session.user.id) {
      return false;
    }

    return (
      <div className="relative header-icon-wrapper">
        <module-products-component position="left">
          <div
            className="header-icon"
            slot="trigger"
          >
            <img
              alt="menu"
              src={iconMenu}
              width="20"
            />
          </div>
        </module-products-component>
      </div>
    );
  }

  showProductMenuLeft() {
    const { session } = this.state;

    return (
      <>
        <module-products-component position="right">
          {(session && session.user && session.user.id) && (
            <span
              className="header-icon"
              slot="trigger"
            >
              <span>
                <KeyboardArrowDownIcon
                  label="expand"
                  size="large"
                />
              </span>
            </span>
          )}
        </module-products-component>
      </>
    );
  }

  /**
   * Implements React's {@link Component#render()}.
   *
   * @inheritdoc
   * @returns {ReactElement}
   */
  render() {
    return (
      <header className="ik-header">
        <div className="flex">
          <div className="header-title-wrapper">
            <Link to="/">
              <img
                className="product-icon"
                src={logo}
                alt="logo"
              />
            </Link>
            <div className="header-title">
              {this.showHeaderTitle()}
              <p className="product-name">kPaste</p>
            </div>
            <div className="relative">
              {this.showProductMenuLeft()}
            </div>
          </div>
        </div>
        <div className="flex flex--v-center flex--h-center">
          {this.showProductMenuRight()}
          {this.showConnectedUserMenu()}
          {this.showNotConnectedMenu()}
        </div>
      </header>
    );
  }
}

export default withTranslation()(IkHeader);
