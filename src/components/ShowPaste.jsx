import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

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
class ShowPaste extends Component<Props> {
  static displayRaw() {
    document.getElementsByTagName('html')[0].innerHTML = document.getElementsByClassName('pasteMessage')[0].textContent;
  }

  static copyText() {
    navigator.clipboard.writeText(document.getElementsByTagName('code')[0].textContent);
  }

  /**
   * @inheritdoc
   */
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      burn: false,
      expiratedAt: false,
      error: false,
      newPaste: false,
      openTooltip: false,
      highlightCode: false,
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
          this.setState({
            message: datas.message,
            burn: datas.burn,
            expiratedAt: datas.expiratedAt ? new Date(datas.expiratedAt.replace(/-/g, '/')) : false,
          });

          if (datas.expiratedAt) {
            setInterval(() => {
              if (new Date(datas.expiratedAt.replace(/-/g, '/')) <= new Date()) {
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
    const crypt = new Crypto(
      key,
      atob(paste.data.vector),
      atob(paste.data.salt),
    );

    const decrypted = await crypt.decrypt(
      paste.data.data,
      password,
    );

    return {
      message: decrypted,
      burn: paste.data.burn,
      expiratedAt: paste.data.expirated_at,
    };
  }

  copyLink() {
    this.setState({ openTooltip: true });
    navigator.clipboard.writeText(window.location.href);
  }

  handleTooltipClose() {
    this.setState({ openTooltip: false });
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
                {' '}
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

  showMessage() {
    const { t } = this.props;
    const {
      error, newPaste, expiratedAt, burn, message, highlightCode,
    } = this.state;

    if (error || newPaste) {
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
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withTranslation()(ShowPaste);
