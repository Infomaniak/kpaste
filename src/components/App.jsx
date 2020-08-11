import '../scss/App.scss';

import React, { Component, Suspense } from 'react';
import Helmet from 'react-helmet';
import { withTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';

import bodyGuard from '../images/bodyguard.svg';
import IkHeader from './Header';
import Home from './Home';
import Loader from './Loader';
import NewPaste from './NewPaste';
import ShowPaste from './ShowPaste';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component<Props> {
  render() {
    const { t } = this.props;
    const baseUri = window.location;

    return (
      <Suspense fallback={<Loader />}>
        <Helmet>
          <title>{t('meta.title')}</title>
          <meta name="description" content={t('meta.description')} />
          <meta property="og:title" content={t('meta.title')} />
          <meta property="og:description" content={t('meta.description')} />
          <meta property="og:image" content={`${baseUri}paste-banner.jpg`} />
          <meta property="og:image:secure_url" content={`${baseUri}paste-banner.jpg`} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image:width" content="630" />
          <meta property="og:image:height" content="200" />
          <meta property="og:image:alt" content={t('meta.description')} />
        </Helmet>
        <IkHeader />
        <Switch>
          <Route path="/new" component={NewPaste} />
          <Route exact path="/:id" component={ShowPaste} />
          <Route exact path="/" component={Home} />
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>

        <div className="illus-container">
          <img src={bodyGuard} alt="bodyguard" />
        </div>
      </Suspense>
    );
  }
}

export default withTranslation()(App);
