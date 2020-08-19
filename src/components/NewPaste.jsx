/* global WEB_COMPONENT_API_ENDPOINT */
import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Crypto from '../lib/Crypto';
import expandTextarea from '../lib/ExpandPage';
import pasteExpiration from '../lib/PasteExpiration';
import StyledSwitch from '../lib/Switch';
import HtmlTooltip from '../lib/Tooltip';
import Footer from './Footer';

/**
 * @extends Component
 */
class NewPaste extends Component<Props> {
  onChangeDestroy: () => void;

  onChangePassword: (Object) => void;

  onTogglePassword: () => void;

  onMessageChange: (Object) => void;

  onChangeValidityPeriod: (Object) => void;

  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);

    this.onChangeDestroy = this.onChangeDestroy.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onTogglePassword = this.onTogglePassword.bind(this);
    this.onChangeValidityPeriod = this.onChangeValidityPeriod.bind(this);
    this.onMessageChange = this.onMessageChange.bind(this);

    this.state = {
      message: '',
      destroy: false,
      period: '1w',
      key: null,
      password: false,
    };
  }

  /**
   * Change password input visibility.
   *
   * @param {Object} event - Switch event.
   * @returns {void}
   */
  onChangeDestroy() {
    const { destroy } = this.state;

    this.setState({
      destroy: !destroy,
    });
  }

  onTogglePassword() {
    const { password } = this.state;

    this.setState({
      password: !password,
    });
  }

  /**
   *
   * @param {object} event - Keyboard event.
   * @private
   * @returns {void}
   */
  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  /**
   *
   * @param {object} event - Keyboard event.
   * @private
   * @returns {void}
   */
  onMessageChange(event) {
    this.setState({ message: event.target.value });
  }

  /**
   *
   * @param {string} event - Keyboard event.
   * @private
   * @returns {void}
   */
  onChangeValidityPeriod(event) {
    this.setState({ period: event.target.value });
  }

  static getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) {
      return match[2];
    }

    return '';
  }

  async sendPaste() {
    const {
      message, destroy, period, password,
    } = this.state;
    const crypto = new Crypto();
    const datas = await crypto.crypt(message, password);
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': decodeURIComponent(NewPaste.getCookie('SHOP-XSRF-TOKEN')),
    };
    const paste = await fetch(`${WEB_COMPONENT_API_ENDPOINT}/api/components/paste`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        data: datas.message,
        vector: datas.vector,
        salt: datas.salt,
        burn: destroy,
        validity: period,
        password: password.length > 0,
      }),
    }).then((response) => (response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText))));

    this.setState({
      redirect: true,
      key: datas.key,
      pasteId: paste.data,
    });
  }

  /**
   * @inheritdoc
   * @returns {ReactElement}
   */
  render() {
    const { t } = this.props;
    const {
      message, redirect, key, pasteId, destroy, period, password,
    } = this.state;

    if (redirect) {
      return (
        <Redirect
          push
          to={{
            pathname: `/${pasteId}#${key}`,
            state: {
              newPaste: true,
              destroy,
              period,
            },
          }}
        />
      );
    }

    return (
      <div id="welcome-newpaste" className="welcome">
        <div id="welcome-container-newpaste" className="welcome-container">
          <div id="paste_container">
            <h1>
              {t('paste.title')}
            </h1>
            <div className="paste_container-main">
              <Paper id="new_paste_box">
                <div className="title-section">
                  <div className="desc">
                    <p className="settings-title">
                      <strong>{t('paste.label.input')}</strong>
                    </p>
                  </div>
                  <HtmlTooltip
                    placement="top"
                    title={(
                      <>
                        {t('paste.input.tooltip')}
                      </>
                    )}
                  >
                    <Button
                      className="expand_button"
                      onClick={expandTextarea}
                    >
                      <span
                        className="icon icon-expand-diagonal"
                        id="expand_button"
                      />
                    </Button>
                  </HtmlTooltip>
                </div>

                <TextareaAutosize
                  id="new_paste_textarea"
                  placeholder=""
                  rowsMin={6}
                  rowsMax={10}
                  value={message}
                  onChange={this.onMessageChange}
                  autoFocus
                />

                <div className="expand-continue-container">
                  <Button
                    className="expand-continue-button"
                    color="primary"
                    disableElevation
                    variant="contained"
                    onClick={expandTextarea}
                  >
                    {t('paste.button.continue')}
                  </Button>
                </div>
              </Paper>
              <Paper id="new_paste_option">
                <div className="validity-section">
                  <div className="desc">
                    <p className="settings-title">
                      <strong>
                        {t('paste.label.validity')}
                      </strong>
                    </p>
                    <p className="settings-text">
                      {t('paste.text.validity')}
                    </p>
                  </div>
                </div>
                <div className="validity-select">
                  <Select
                    defaultValue={period}
                    onChange={this.onChangeValidityPeriod}
                    variant="outlined"
                  >
                    {pasteExpiration.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.value}
                      >
                        {t(option.label)}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className="destroy-section">
                  <div className="desc">
                    <p className="settings-title">
                      <strong>
                        {t('paste.label.destroy')}
                      </strong>
                    </p>
                    <p className="settings-text">
                      {t('paste.text.destroy')}
                    </p>
                  </div>
                  <StyledSwitch
                    onChange={this.onChangeDestroy}
                    checked={destroy}
                  />
                </div>
                <div className="password-section">
                  <div className="desc">
                    <p className="settings-title">
                      <strong>
                        {t('paste.label.password')}
                      </strong>
                    </p>
                    <p className="settings-text">
                      {t('paste.text.password')}
                    </p>
                  </div>
                  <StyledSwitch
                    onChange={this.onTogglePassword}
                    checked={password}
                  />
                </div>
                {password
                && (
                  <>
                    <div className="password-section">
                      <TextField
                        id="standard-password-input"
                        label={t('paste.placeholder.password')}
                        type="password"
                        placeholder={t('paste.placeholder.password')}
                        onChange={this.onChangePassword}
                      />
                    </div>
                    <div className="password-info-section font-medium">
                      <span className="icon icon-bubble-alert" />
                      <span>{t('paste.info.password')}</span>
                    </div>
                  </>
                )}
              </Paper>
              <div className="button-section">
                <Button
                  id="new_paste_submit_button"
                  color="primary"
                  disableElevation
                  disabled={message.length === 0}
                  variant="contained"
                  onClick={async () => {
                    await this.sendPaste();
                  }}
                >
                  {t('paste.button.go')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withTranslation()(NewPaste);
