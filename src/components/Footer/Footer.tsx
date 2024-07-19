import { Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Background } from '../../types/background';
import { FC } from 'react';

type Props = {
  background: Background;
};

const Footer: FC<Props> = ({ background }) => {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <Container className="footer-container" maxWidth="lg">
        <div className="footer-content">
          <div className="footer-about">
            <Link
              to={background.link}
              rel="noopener noreferrer"
              target="_blank"
            >
            </Link>
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
};

export default Footer;
