import { CloseSidePanelMessageKey, KSuiteBridge } from '@infomaniak/ksuite-bridge';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import iconMenu from '../../images/menu.svg';
import i18n from '../../lib/i18n/i18n';
import StyledSelect from '../StyledSelect/StyledSelect';
import { InputBase, SelectChangeEvent } from '@mui/material';
import { Session } from '../../types/user';

type Props =  {
  bridge: KSuiteBridge;
};

const IkHeader: FC<Props> = ({ bridge }) => {
  const [session, setSession] = useState<Session>();
  const {t} = useTranslation();

  useEffect(() => {
    fetch(`${window.WEB_COMPONENT_API_ENDPOINT}/api/components/profile/me?with=current_group,user,groups,products`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => (response.ok ? response.json() : Promise.reject(
        new Error(response.statusText),
      )))
      .then((json) => {
        if (json.data.user) {
          if (json.data.user.locale) {
            window.CONST_LANG = json.data.user.locale.substr(0, 2);
            i18n.changeLanguage(json.data.user.locale.substr(0, 2));
          }
          setSession(json.data);
        }
      });
  }, []);

  const onHandleMenuItemClick = (selectedItem: SelectChangeEvent<unknown>) => {
    const value = selectedItem.target.value as string;
    window.CONST_LANG = value;
    i18n.changeLanguage(value);
  };

  const onLogin = () => {
    window.location.href = `${window.WEB_COMPONENT_API_ENDPOINT}/auth/login/paste?uri=${window.location.pathname}`;
  };

  const onCloseSidepanel = () => {
    bridge.sendMessage({ type: CloseSidePanelMessageKey });
  };

  const showNotConnectedMenu = () => {
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
            defaultValue={i18n.language.substring(0, 2)}
            input={<InputBase/>}
            onChange={onHandleMenuItemClick}
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
            onClick={onLogin}
            variant="contained"
          >
            {t('menu.login')}
          </Button>
        </div>
      </>
    );
  };

  const showConnectedUserMenu = () => {
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
              <module-avatar-component
                firstname={session.user.firstname}
                lastname={session.user.lastname}
                size={40}
                logo={session.user.avatar}
                fontsize={20}
                accountid={session.current_group.id}
              />
            </div>
          </span>
        </module-menu-user>
      </div>
    );
  };

  const showProductMenuRight = () => {

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
  };

  if (window.location.search.includes('ksuite-mode=side') && bridge && bridge.isConnected) {
    return (
      <header className="ik-header bridge-header">
        <div className="flex flex--v-center">
          <Typography
            style={{
              marginLeft: 32,
              fontSize: 16,
              color: 'black',
            }}
          >
            <strong>kPaste</strong>
          </Typography>
        </div>
        <div className="flex flex--v-center flex--h-center">
          <div
            className="header-icon"
            onClick={onCloseSidepanel}
            onKeyDown={onCloseSidepanel}
            role="button"
            tabIndex={0}
            aria-labelledby="closeButton"
          >
            <SvgIcon style={{ color: '#666' }}>
              <CloseIcon />
            </SvgIcon>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="ik-header">
      <div className="flex">
        <div className="header-title-wrapper">
          <module-header-title-component />
        </div>
      </div>
      <div className="flex flex--v-center flex--h-center">
        {showProductMenuRight()}
        {showConnectedUserMenu()}
        {showNotConnectedMenu()}
      </div>
    </header>
  );
}

export default IkHeader;
