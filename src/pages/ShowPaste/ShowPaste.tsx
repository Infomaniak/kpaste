import React, { useState, useEffect, useCallback, useMemo, FC } from 'react';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';
import { Paper } from '@mui/material';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResponseData } from '../../types/paste';
import { Background } from '../../types/background';

import HtmlTooltip from '../../components/HtmlTooltip/HtmlTooltip';
import i18n from '../../lib/i18n/i18n';
import CodeHighlight from '../../components/CodeHighlight/CodeHighlight';
import pasteExpiration from '../../data/PasteExpiration';
import Crypto from '../../lib/Crypto/Crypto';
import expandTextarea from '../../lib/ExpandPage/ExpandPage';
import Footer from '../../components/Footer/Footer';

type Props = {
  background: Background;
};

const initialState = {
  burn: false,
  expiratedAt: new Date(),
  destroy: false,
  message: '',
  vector: '',
  password: false,
  key: '',
  salt: '',
};

type TooltipContainerProps = {
  verboseDate: string;
  children: React.ReactElement;
};

function TooltipContainer({
  verboseDate,
  children,
}: TooltipContainerProps) {
  return (
    <HtmlTooltip placement="top" title={verboseDate}>
      {children}
    </HtmlTooltip>
  );
}

const ShowPaste: FC<Props> = ({ background }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation()

  const [response, setResponse] = useState<ResponseData>(initialState);
  const { burn, expiratedAt, key, destroy, vector, password, salt } = response;
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [newPaste, setNewPaste] = useState(false);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [period, setPeriod] = useState('');
  const [highlight, setHighlight] = useState(false);
  const periodLabel = useMemo(() => {
    const periodObject = pasteExpiration.find((p: { value: string }) => p.value === period);
    return periodObject ? t(periodObject.label) : '';
  }, [period, t]);

  const copyText = () => {
    const codeElement = document.getElementsByTagName('code')[0];
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent ?? '');
    }
  };

  const decrypt = async (datas: string, key: string, vector: string, salt: string, password: string) => {
    console.log('key', key)
    console.log('vector', vector)
    console.log('salt', salt)
    const crypt = new Crypto(
      key,
      atob(vector),
      atob(salt),
    );
    const decrypted = await crypt.decrypt(datas, password);
    return decrypted;
  };

  const getPaste = useCallback(async ({ pasteId, key, password }: { pasteId: string | undefined, key: string, password: string }) => {
    const paste = await fetch(`${import.meta.env.VITE_WEB_COMPONENT_API_ENDPOINT}/api/components/paste/${pasteId}`, {
      method: 'GET',
    }).then((response) => (response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText))));

      console.log('paste', paste)

    const state = {
      key,
      vector: paste.data.vector,
      salt: paste.data.salt,
      burn: paste.data.burn,
      expiratedAt: paste.data.expirated_at ? new Date(paste.data.expirated_at * 1000) : new Date(),
      password: paste.data.password,
    };

    let messageDecrypted;
    console.log('key', key)
    if (!paste.data.password) {
      messageDecrypted = await decrypt(
        paste.data.data,
        key,
        paste.data.vector,
        paste.data.salt,
        password,
      );
      console.log('messageDecrypted', messageDecrypted)
      setMessage(messageDecrypted);
    } else {
      messageDecrypted = paste.data.data;
      setMessage(messageDecrypted);
    }
    return state;
  }, []);


  useEffect(() => {
    if (location && location.state?.newPaste) {
      setNewPaste(true);
      const stateCopy = { ...location.state };
      delete stateCopy.newPaste;
      navigate(location, { replace: true, state: stateCopy });
    } else {
      try {
        const key = Crypto.getPasteKey();
        const passwordT = '';
        getPaste({ pasteId: id, key, password: passwordT }).then((data) => {
          setResponse((s) => ({ ...s, ...data }));
          if (data.expiratedAt) {
            setInterval(() => {
              if (new Date(data.expiratedAt) <= new Date()) {
                window.location.reload();
              }
            }, 1000);
          }
        }).catch(() => {
          setError(true);

        });

      } catch (e) {
        setError(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const submitPassword = async () => {
    try {
      const decrypted = await decrypt(
        message,
        key,
        vector,
        salt,
        passwordInput,
      );
      setMessage(decrypted);
      setResponse((s) => ({ ...s, password: false }));

    } catch (_) {
      setInvalidPassword(true);
      setResponse((s) => ({ ...s, password: true }));
    }
  };

  const onKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      submitPassword();
    }
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPasswordInput(event.target.value);
  };

  const copyLink = () => {
    setOpenTooltip(true);
    navigator.clipboard.writeText(window.location.href);
  };

  useEffect(() => {
    if (location?.state?.period) {
      setPeriod(location.state.period)
    }
  }, [location.state]);


  const showNew = () => {

    if (error || !newPaste) {
      return false;
    }

    return (
      console.log('period', period),
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
            {navigator.clipboard
              && (
                <ClickAwayListener onClickAway={async () => {
                  handleTooltipClose();
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
                        copyLink();
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
            {destroy
              && (
                <span className="burn_info">
                  <span className="icon icon-lock-unlock" />
                  &nbsp;
                  {t('show_paste.label.burn')}
                </span>
              )}
            {periodLabel
              && (
                <span className="expired_at">
                  <span
                    className="icon icon-time-clock-circle-alternate"
                  />
                  &nbsp;
                  {t('show_paste.label.validity')}
                  &nbsp;
                  {periodLabel}
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
  };

  const showError = () => {
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
        </Paper>
        <div className="button-section font-medium">
          <Link to="/new">
            {t('show_paste.link.new_paste')}
          </Link>
        </div>
        <div className="button-section after-button-section font-medium">
          <span>
            {t('show_paste.link.text')}
          </span>
        </div>
      </>
    );
  };

  const highlightCode = () => {
    setHighlight(!highlight);
  };

  const showPassword = () => {
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
            onChange={onChangePassword}
            onKeyDown={onKeyDown}
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
              await submitPassword();
            }}
          >
            {t('show_paste.button.password')}
          </Button>
        </div>
      </>
    );
  };

  const showMessage = () => {
    if (error || newPaste || password) {
      return false;
    }
    console.log('highlight', highlight);


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
                className="override-time"
                timeStyle="time"
                date={expiratedAt}
                locale={i18n.language.substring(0, 2)}
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
                    copyText();
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

              {!highlight
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
                      onClick={highlightCode}
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
            <CodeHighlight code={highlight}>
              {message}
            </CodeHighlight>
          </div>

          <span className="show_paste_post_message">
            {t('show_paste.label.post_message')}
            {' '}
            <a
              href="https://www.infomaniak.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              Infomaniak
            </a>
            {', '}
            {t('show_paste.label.post_message_after')}
          </span>
        </Paper>
        <div className="button-section font-medium">
          <Link to="/new">
            {t('show_paste.link.new_paste')}
          </Link>
        </div>
        <div className="button-section after-button-section font-medium">
          <span>
            {t('show_paste.link.text')}
          </span>
        </div>
      </>
    );
  };


  return (
    <div
      id="welcome-showpaste"
      className="welcome"
      style={{
        backgroundImage: `url(${background.image})`,
      }}
    >
      <div
        id="welcome-container-showpaste"
        className="welcome-container"
      >
        <div id="paste_container">
          {showNew()}
          {showError()}
          {showMessage()}
          {showPassword()}
        </div>
      </div>
      <Footer background={background} />
    </div>

  );
}

export default ShowPaste;
