import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import CodeHighlight from '../lib/CodeHighlight';
import Crypto from '../lib/Crypto';
import expandTextarea from '../lib/ExpandPage';
import i18n from '../lib/i18n';
import pasteExpiration from '../lib/PasteExpiration';
import HtmlTooltip from '../lib/Tooltip';
import Footer from './Footer';

/* global WEB_COMPONENT_API_ENDPOINT */
// eslint-disable-next-line react/prop-types
const TooltipContainer = ({ verboseDate, children }) => (
  <HtmlTooltip placement="top" title={verboseDate}>
    {children}
  </HtmlTooltip>
);

/**
 * @extends Component
 */
class ShowPaste extends React.PureComponent {
  static displayRaw() {
    document.getElementsByTagName('html')[0].innerHTML = document.getElementsByClassName('pasteMessage')[0].textContent;
  }

  static copyText() {
    navigator.clipboard.writeText(document.getElementsByTagName('code')[0].textContent);
  }

  static async decrypt(datas, key, vector, salt, password) {
    const crypt = new Crypto(
      key,
      atob(vector),
      atob(salt),
    );

    const decrypted = await crypt.decrypt(datas, password);

    return decrypted;
  }

  onChangePassword: (Object) => void;

  onKeyDown: (Object) => void;

  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);

    this.onChangePassword = this.onChangePassword.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      message: '',
      burn: false,
      expiratedAt: false,
      error: false,
      newPaste: false,
      openTooltip: false,
      highlightCode: false,
      invalidPassword: false,
      passwordInput: '',
      password: false,
    };
  }

  componentDidMount() {
    const { location, match } = this.props;
    const { state } = location;
    const { params } = match;

    if (state && state.newPaste) {
      this.setState({
        newPaste: true,
      });

      const stateCopy = { ...state };
      delete stateCopy.newPaste;
      // eslint-disable-next-line react/destructuring-assignment
      this.props.history.replace({ state: stateCopy });
    } else {
      try {
        const pasteId = params.id;
        const key = Crypto.getPasteKey();
        const password = '';
        ShowPaste.getPaste(pasteId, key, password).then((datas) => {
          this.setState(datas);

          if (datas.expiratedAt) {
            setInterval(() => {
              if (new Date(datas.expiratedAt) <= new Date()) {
                window.location.reload();
              }
            }, 1000);
          }
        }).catch(() => {
          this.setState({
            error: true,
          });
        });
      } catch (e) {
        this.setState({
          error: true,
        });
      }
    }
  }

  static async getPaste(pasteId, key, password) {
    const paste = await fetch(`${WEB_COMPONENT_API_ENDPOINT}/api/components/paste/${pasteId}`, {
      method: 'GET',
    }).then((response) => (response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText))));

    const state = {
      key,
      vector: paste.data.vector,
      salt: paste.data.salt,
      burn: paste.data.burn,
      expiratedAt: paste.data.expirated_at ? new Date(paste.data.expirated_at.replace(/-/g, '/'))
        : false,
      password: paste.data.password,
    };

    if (!paste.data.password) {
      state.message = await ShowPaste.decrypt(
        paste.data.data,
        key,
        paste.data.vector,
        paste.data.salt,
        password,
      );
    } else {
      state.message = paste.data.data;
    }

    return state;
  }

  handleTooltipClose() {
    this.setState({ openTooltip: false });
  }

  async onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      this.submitPassword();
    }
  }

  /**
   *
   * @param {object} event - Keyboard event.
   * @private
   * @returns {void}
   */
  onChangePassword(event) {
    this.setState({ passwordInput: event.target.value });
  }

  copyLink() {
    this.setState({ openTooltip: true });
    navigator.clipboard.writeText(window.location.href);
  }

  async submitPassword() {
    const {
      key, message, vector, salt, passwordInput,
    } = this.state;

    try {
      const decrypted = await ShowPaste.decrypt(
        message,
        key,
        vector,
        salt,
        passwordInput,
      );

      this.setState({
        message: decrypted,
        password: false,
      });
    } catch (_) {
      this.setState({
        invalidPassword: true,
        password: true,
      });
    }
  }

  showNew() {
    let i: number;
    const { t, location } = this.props;
    const { error, newPaste, openTooltip } = this.state;
    const { state } = location;

    if (error || !newPaste) {
      return false;
    }

    let { period } = state;

    if (period) {
      for (i = 0; i <= pasteExpiration.length; i += 1) {
        if (pasteExpiration[i].value === state.period) {
          period = t(pasteExpiration[i].label);
          break;
        }
      }
    }

    return (
      <>
        <h1 id="new_paste_title">{t('show_paste.new.title')}</h1>

        <Paper id="new_paste_box">
          <span className="new_paste_box_description">
            {t('show_paste.new.description')}
          </span>

          <div className="destroy-section paste_url_section">
            <div className="desc pasteContent">
              <pre className="font-medium">{window.location.href}</pre>
            </div>

            {document.queryCommandSupported('copy')
            && (
              <ClickAwayListener onClickAway={async () => {
                await this.handleTooltipClose();
              }}
              >
                <HtmlTooltip
                  placement="top"
                  open={openTooltip}
                  disableFocusListener
                  disableHoverListener
                  disableTouchListener
                  title={t('show_paste.title.copy_link')}
                >
                  <Button
                    className="copy-buton"
                    onClick={async () => {
                      await this.copyLink();
                    }}
                  >
                    <span
                      className="icon icon-common-file-double-2"
                    />
                  </Button>
                </HtmlTooltip>
              </ClickAwayListener>
            )}
          </div>
          <div className="destroy-section paste_url_option">
            {state.destroy
            && (
              <span className="burn_info">
                <span className="icon icon-lock-unlock" />
                &nbsp;
                {t('show_paste.label.burn')}
              </span>
            )}
            {state.period
            && (
              <span className="expired_at">
                <span
                  className="icon icon-time-clock-circle-alternate"
                />
                &nbsp;
                {t('show_paste.label.validity')}
                &nbsp;
                {period}
              </span>
            )}
          </div>
        </Paper>
        <div className="button-section font-medium">
          <Link to="/new">
            {t('show_paste.link.other_paste')}
          </Link>
        </div>
      </>
    );
  }

  showError() {
    const { t } = this.props;
    const { error } = this.state;

    if (!error) {
      return false;
    }

    return (
      <>
        <h1>
          {t('show_paste.title.error')}
        </h1>
        <Paper id="new_paste_box">
          <strong className="too_late_title">
            {t('show_paste.subtitle.error')}
          </strong>
          <p className="too_late_message">
            {t('show_paste.text.error')}
            &nbsp;
            <span role="img" aria-label="sunglass" className="emoji">😎</span>
          </p>
        </Paper>
        <div className="button-section font-medium">
          <Link to="/new">
            {t('show_paste.link.new_paste')}
          </Link>
        </div>
      </>
    );
  }

  highlightCode() {
    const { highlightCode } = this.state;
    this.setState({ highlightCode: !highlightCode });
  }

  showPassword() {
    const { t } = this.props;
    const {
      password, invalidPassword,
    } = this.state;

    if (!password) {
      return false;
    }

    return (
      <>
        <h1 id="new_paste_title">{t('show_paste.password.title')}</h1>

        <p className="group-name expiration_title">
          {t('show_paste.subtitle.password')}
        </p>

        <Paper id="new_paste_box">
          <div className="title-section">
            <div className="desc">
              <p className="settings-title">
                <strong>{t('paste.password.input')}</strong>
              </p>
            </div>
          </div>
          <TextField
            autoFocus
            id="standard-password-input"
            type="password"
            onChange={this.onChangePassword}
            onKeyDown={this.onKeyDown}
          />
          {invalidPassword && (
            <div className="password-info-section font-medium">
              <span className="icon icon-bubble-alert" />
              <span>{t('show_paste.info.wrong_password')}</span>
            </div>
          )}
        </Paper>
        <div className="button-section">
          <Button
            id="new_paste_submit_button"
            color="primary"
            disableElevation
            variant="contained"
            onClick={async () => {
              await this.submitPassword();
            }}
          >
            {t('show_paste.button.password')}
          </Button>
        </div>
      </>
    );
  }

  showMessage() {
    const { t } = this.props;
    const {
      error, newPaste, expiratedAt, burn, message, highlightCode, password,
    } = this.state;

    if (error || newPaste || password) {
      return false;
    }

    return (
      <>
        <h1>
          {t('show_paste.title.normal')}
        </h1>
        {expiratedAt
        && (
          <p className="group-name expiration_title">
            {t('show_paste.subtitle.destroy')}
            &nbsp;
            <ReactTimeAgo
              timeStyle="time"
              date={expiratedAt}
              locale={i18n.language.substr(0, 2)}
              container={TooltipContainer}
              tooltip={false}
            />
          </p>
        )}
        <Paper id="new_paste_box">

          <div className="paste--head">

            <strong className="show_paste_label">
              {t('show_paste.label.message')}
            </strong>

            <div className="paste--head__toolbelt">

              <HtmlTooltip
                placement="top"
                title={(
                  <>
                    {t('paste.input.copy')}
                  </>
                )}
              >
                <Button
                  className="expand_button"
                  onClick={async () => {
                    await ShowPaste.copyText();
                  }}
                >
                  <span
                    className="icon icon-common-file-double-2"
                  />
                </Button>
              </HtmlTooltip>

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

              {!highlightCode
              && (
                <HtmlTooltip
                  placement="top"
                  title={(
                    <>
                      {t('paste.input.code')}
                    </>
                  )}
                >
                  <Button
                    className="expand_button"
                    onClick={async () => {
                      await this.highlightCode();
                    }}
                  >
                    <span
                      className="icon icon-type-code"
                      id="expand_button"
                    />
                  </Button>
                </HtmlTooltip>
              )}

            </div>

          </div>

          {burn
          && (
            <p className="group-name message_will_burn">
              <span
                className="icon icon-warning"
              />
              &nbsp;
              {t('show_paste.label.destroy')}
            </p>
          )}

          <div className="pasteContent pasteMessage">
            <CodeHighlight code={highlightCode}>
              {message}
            </CodeHighlight>
          </div>
        </Paper>
        <div className="button-section font-medium">
          <Link to="/new">
            {t('show_paste.link.new_paste')}
          </Link>
        </div>
      </>
    );
  }

  /**
   * @inheritdoc
   * @returns {ReactElement}
   */
  render() {
    return (
      <div id="welcome-showpaste" className="welcome">
        <div id="welcome-container-showpaste" className="welcome-container">
          <div id="paste_container">
            {this.showNew()}
            {this.showError()}
            {this.showMessage()}
            {this.showPassword()}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

ShowPaste.propTypes = {
  t: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  match: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  history: PropTypes.object.isRequired,
};

export default withTranslation()(ShowPaste);
