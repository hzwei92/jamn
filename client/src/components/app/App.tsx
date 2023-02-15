import { IonRouterOutlet, setupIonicReact } from '@ionic/react';
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '../../theme/main.css';

/* Theme variables */
import '../../theme/variables.css';
import AppBarLeft from './AppBarLeft';
import AppBarTop from './AppBarTop';

import './App.css';
import useAppInitializer from '../../hooks/app/useAppInitializer';
import LoginModal from '../auth/LoginModal';
import Portal from '../portal/Portal';
import CreatePostModal from '../post/CreatePostModal';
import { Redirect, Route } from 'react-router';
import Map from '../map/Map';

setupIonicReact();

const App = () => {
  console.log('app');
  useAppInitializer();

  return (
  <div id='app'>
    <AppBarLeft />
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: 'calc(100% - 50px)',
      height: '100%',
    }}>
      <AppBarTop />
      <IonRouterOutlet style={{
        left: 50,
        top: 50,
      }}>
        <Route path='/portal' component={Portal} />
        <Route path='/map' component={Map} />
        <Redirect exact from='/' to='/portal' />
      </IonRouterOutlet>
      <LoginModal />
      <CreatePostModal />
    </div>
  </div>
  );
}

export default App;
