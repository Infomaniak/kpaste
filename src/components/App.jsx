import '../scss/App.scss';

import React, { Suspense } from 'react';
import Helmet from 'react-helmet';
import { withTranslation } from 'react-i18next';
import {
  Redirect, Route, Switch, withRouter,
} from 'react-router-dom';

import PropTypes from 'prop-types';
import { KSuiteBridge } from '@infomaniak/ksuite-bridge';
import IkHeader from './Header';
import Home from './Home';
import Loader from './Loader';
import NewPaste from './NewPaste';
import ShowPaste from './ShowPaste';

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      background: {
        image: '',
      },
    };
  }

  componentDidMount() {
    App.getBackground().then((background) => {
      this.setState({ background });
    });

    this.bridge = new KSuiteBridge(KSUITE_API);
    this.bridge.sendMessage({ type: 'app-ready' });
  }

  render() {
    const { t, location } = this.props;
    const { background } = this.state;

    if (this.bridge) {
      this.bridge.sendMessage({ type: 'navigate', path: location.pathname });
    }

    return (
      <Suspense fallback={<Loader />}>
        <Helmet>
          <title>{t('meta.title')}</title>
          <meta property="og:title" content={t('meta.title')} />
          <meta property="og:image:alt" content={t('meta.title')} />
          <meta property="og:description" content={t('meta.description')} />
          <meta name="description" content={t('meta.description')} />
        </Helmet>
        <IkHeader />
        <Switch>
          <Route
            path="/new"
            render={() => (
              <NewPaste background={background} />
            )}
          />
          <Route
            exact
            path="/:id"
            render={(props) => (
              <ShowPaste
                background={background}
                id={props.match.params.id}
                match={props.match}
                location={props.location}
                history={props.history}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={() => (
              <Home background={background} />
            )}
          />
          <Route path="/">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Suspense>
    );
  }

  static async getBackground() {
    const background = await fetch(`${WEB_COMPONENT_API_ENDPOINT}/api/components/paste/promotion`, {
      method: 'GET',
    }).then((response) => (response.ok
      ? response.json()
      : Promise.reject(new Error(response.statusText))));

    return background.data;
  }
}

App.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withRouter(withTranslation()(App));
