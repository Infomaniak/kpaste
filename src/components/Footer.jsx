import { Container } from '@material-ui/core';
import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

/**
 * @extends Component
 */
class Footer extends React.PureComponent {
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
      <div className="footer">
        <Container className="footer-container" maxWidth="lg">
          <div className="footer-content">
            <div className="footer-about">
              <a
                href={background.link}
                rel="noopener noreferrer"
                target="_blank"
              >
                Photo by
                {' '}
                {background.author}
              </a>
              &nbsp;
              -
              &nbsp;
              <a
                href="https://www.infomaniak.com/gtl/rgpd.documents"
                rel="noopener noreferrer"
                target="_blank"
              >
                <u>{t('footer.cgu')}</u>
              </a>
              &nbsp;
              -
              &nbsp;
              <a
                href="https://www.infomaniak.com"
                rel="noopener noreferrer"
                target="_blank"
              >
                {t('footer.know_more')}
                {' '}
                <u>Infomaniak</u>
              </a>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

Footer.propTypes = {
  t: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  background: PropTypes.object.isRequired,
};

export default withTranslation()(Footer);
