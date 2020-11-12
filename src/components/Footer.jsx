import { Container } from '@material-ui/core';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

/**
 * @extends Component
 */
class Footer extends Component<Props> {
  /**
   * @inheritdoc
   * @returns {ReactElement}
   */
  render() {
    const { t } = this.props;

    return (
      <div className="footer">
        <Container className="footer-container" maxWidth="lg">
          <div className="footer-content">
            <div className="footer-about">
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

export default withTranslation()(Footer);
