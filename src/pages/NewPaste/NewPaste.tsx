import { useTranslation } from 'react-i18next';

import { Paper } from '@mui/material';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import MyCrypto from '../../lib/Crypto/Crypto';
import expandTextarea from '../../lib/ExpandPage/ExpandPage';
import pasteExpiration from '../../data/PasteExpiration';
import StyledSwitch from '../../components/StyledSwitch/StyledSwitch';
import HtmlTooltip from '../../components/HtmlTooltip/HtmlTooltip';
import Footer from '../../components/Footer/Footer';
import { Background } from '../../types/background';
import { PasteData } from '../../types/paste';

type Props = {
  background: Background;
};

const initialState = {
  pasteId: '',
  key: '',
  destroy: false,
  period: '1d',
  message: '',
  enablePassword: false,
  password: '',
  showPassword: false,
}

const NewPaste: FC<Props> = ({ background }) => {
  const [data, setData] = useState<PasteData>(initialState);
  const [redirect, setRedirect] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { message, key, enablePassword, password, destroy, period, pasteId, showPassword } = data


  const getCookie = (name: string) => {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    if (match) {
      return match[2];
    }
    return '';
  }

  const handleClickShowPassword = () => {
    setData((state) => ({ ...state, showPassword: !showPassword }))
  }

  const onChangeDestroy = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((state) => ({ ...state, destroy: event.target.checked }))
  }

  const onTogglePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((state) => ({ ...state, enablePassword: event.target.checked }))
  }

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((state) => ({ ...state, password: event.target.value }))
  }

  const onMessageChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData((state) => ({ ...state, message: event.target.value }))
  }

  const onChangeValidityPeriod = (event: SelectChangeEvent<string>) => {
    setData((state) => ({ ...state, period: event.target.value }))
  }

  const sendPaste = async () => {
    const crypto = new MyCrypto();
    const datas = await crypto.crypt(message, enablePassword ? password : '');

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': decodeURIComponent(getCookie('SHOP-XSRF-TOKEN')),
    };
    const paste = await fetch(`${import.meta.env.VITE_WEB_COMPONENT_API_ENDPOINT}/api/components/paste`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        data: datas.message,
        vector: datas.vector,
        salt: datas.salt,
        burn: destroy,
        validity: period,
        password: !!(enablePassword && password.length),
      }),
    })

    const response = await paste.json();

    setData(data)
    setData((state) => ({ ...state, key: datas.key, pasteId: response.data }))
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect) {
      navigate(`/${pasteId}#${key}`, { replace: false, state: { newPaste: true, destroy, period, background } })
    }
  }, [redirect, pasteId, key, destroy, period, background, navigate])


  return (
    <>

      <div
        id="welcome-newpaste"
        className="welcome"
        style={{
          backgroundImage: `url(${background.image})`,
        }}
      >
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
                  data-testid="new_paste_textarea"
                  id="new_paste_textarea"
                  placeholder=""
                  minRows={6}
                  maxRows={10}
                  value={message}
                  onChange={onMessageChange}
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
                    onChange={onChangeValidityPeriod}
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
                  </div>
                  <StyledSwitch
                    onChange={onChangeDestroy}
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
                  </div>
                  <StyledSwitch
                    onChange={onTogglePassword}
                    checked={enablePassword}
                  />
                </div>
                {enablePassword
                  && (
                    <>
                      <div className="password-section">
                        <Input
                          autoFocus
                          id="standard-password-input"
                          placeholder={t('paste.placeholder.password') || ''}
                          type={showPassword ? 'text' : 'password'}
                          onChange={onChangePassword}
                          endAdornment={(
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                              >
                                {showPassword ? <span className="icon icon-view" />
                                  : <span className="icon icon-view-off" />}
                              </IconButton>
                            </InputAdornment>
                          )}
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
                    sendPaste();
                  }}
                >
                  {t('paste.button.go')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer background={background} />
      </div>
    </>
  );
}

export default NewPaste;
