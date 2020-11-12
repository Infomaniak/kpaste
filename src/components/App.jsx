import '../scss/App.scss';

import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { withTranslation } from 'react-i18next';
import { Redirect, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import bodyGuard from '../images/bodyguard.svg';
import IkHeader from './Header';
import Home from './Home';
import Loader from './Loader';
import NewPaste from './NewPaste';
import ShowPaste from './ShowPaste';

class App extends React.PureComponent {
  render() {
    const { t } = this.props;

    return (
      <Suspense fallback={<Loader />}>
        <Helmet>
          <title>{t('meta.title')}</title>
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

App.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation()(App);
