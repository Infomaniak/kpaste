import { Container } from '@material-ui/core';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

import question from '../images/button-share.svg';

/**
 * @extends Component
 */
class Footer extends Component<Props> {
  /**
   * @param event
   * @private
   */
  static onTriggerSupportModuleEvent(event) {
    event.preventDefault();
    const supportTriggerEvent = new CustomEvent('openSupportModule', { detail: { opening: 'contact' } });

    document.dispatchEvent(supportTriggerEvent);
  }

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
        {/* eslint-disable-next-line max-len */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
        <img
          src={question}
          className="help"
          alt="help"
          onClick={Footer.onTriggerSupportModuleEvent}
        />
      </div>
    );
  }
}

export default withTranslation()(Footer);
