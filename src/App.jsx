import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactLoader from './components/loader';

import * as ROUTES from './constants/routes';
import { useAuth } from './context/logged-in-user';
import ProtectedRoute from './helpers/protected-route';
import { UserContext } from './context/user';
import Header from './components/header';
import { getUserByUserId } from './services/firebase';

const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/signup'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));
const NotFound = lazy(() => import('./pages/not-found'));
const EditPost = lazy(() => import('./pages/edit-post'));
const ProfilePost = lazy(() => import('./pages/edit-profile'));

function App() {
  const [activeUser, setActiveUser] = useState(null);

  const { user } = useAuth();
  useEffect(() => {
    const getUserObjByUserId = async (id) => {
      const profile = await getUserByUserId(id);
      if (profile[0]) {
        setActiveUser(profile[0]);
      }
    };

    if (user) {
      setTimeout(() => {
        getUserObjByUserId(user.uid);
      }, 500);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user: activeUser, setActiveUser }}>
      <Router>
        <Header />
        <Suspense fallback={<ReactLoader />}>
          <Switch>
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.PROFILE} component={Profile} exact />
            <ProtectedRoute path={ROUTES.DASHBOARD} exact>
              <Dashboard user={user} activeUser={activeUser} />
            </ProtectedRoute>
            <ProtectedRoute path={ROUTES.EDIT_POST} exact>
              <EditPost />
            </ProtectedRoute>
            <ProtectedRoute path={ROUTES.EDIT_PROFILE} exact>
              <ProfilePost />
            </ProtectedRoute>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
