import { Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Footer from './Footer';
import logoInfomaniakWhite from '../images/logo-infomaniak-white.svg';

/**
 * @extends Component
 */
class Home extends React.PureComponent {
  /**
   * @inheritdoc
   * @returns {ReactElement}
   */
  render() {
    const {
      t,
      background,
    } = this.props;

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
              <span>kPaste</span>
            </h1>
            <div id="homepage-container">
              <Paper id="enter_room">
                <div className="header-text">
                  <h1 className="header-text-title">
                    {t('home.title')}
                  </h1>
                  <p className="header-text-description">
                    {t('home.subtitle')}
                  </p>
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
}

Home.propTypes = {
  t: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  background: PropTypes.object.isRequired,
};

export default withTranslation()(Home);
