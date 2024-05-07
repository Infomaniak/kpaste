import { Paper } from '@mui/material';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Background } from '../../types/background';
import Footer from '../Footer/Footer';
import logoInfomaniakWhite from '../../images/logo-infomaniak-white.svg';
import { FC } from 'react';

type Props = {
  background: Background;
};

const Home: FC<Props> = ({ background }) => {
  const {t} = useTranslation();

  return (
    <div
      id="welcome-homepage"
      className="welcome"
      style={{
        backgroundImage: `url(${background.image})`,
      }}
    >
      <div id="welcome-container-homepage" className="welcome-container">
        <div id="header_homepage" className="header">
          <h1>
            <img
              alt="logo"
              src={logoInfomaniakWhite}
              width="200"
            />
            <span>
              kPaste
            </span>
          </h1>
          <div id="homepage-container">
            <Paper id="enter_room">
              <div className="header-text">
                <h1 className="header-text-title">
                  {t('home.title')}
                </h1>
                <h2 className="header-text-description">
                  {t('home.subtitle')}
                </h2>
                <p className="header-text-sub">
                  <span className="icon icon-lock-2" />
                  {t('home.text')}
                    &nbsp;
                  <a
                    href="https://faq.infomaniak.com/2459"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {t('home.link')}
                  </a>
                </p>
              </div>
              <Link to="/new">
                <Button
                  id="new_paste_button"
                  color="primary"
                  disableElevation
                  variant="contained"
                >
                  {t('home.button')}
                </Button>
              </Link>
            </Paper>
          </div>
        </div>
      </div>
      <Footer background={background} />
    </div>
  );
}

export default Home;

