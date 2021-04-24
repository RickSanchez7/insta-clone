import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ReactLoader from './components/loader';

import * as ROUTES from './constants/routes';
import { useAuth } from './context/logged-in-user';
import ProtectedRoute from './helpers/protected-route';
import useUser from './hooks/use-user';
import { UserContext } from './context/user';
import Header from './components/header';

const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/signup'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));
const NotFound = lazy(() => import('./pages/not-found'));
const EditPost = lazy(() => import('./pages/editPost'));

function App() {
  const { user: loggedInUser } = useAuth();
  const { user, setActiveUser } = useUser(loggedInUser?.uid);

  return (
    <UserContext.Provider value={{ user, setActiveUser }}>
      <Router>
        <Header />
        <Suspense fallback={<ReactLoader />}>
          <Switch>
            <Route path={ROUTES.LOGIN} component={Login} />
            <Route path={ROUTES.SIGN_UP} component={SignUp} />
            <Route path={ROUTES.PROFILE} component={Profile} />
            <ProtectedRoute path={ROUTES.DASHBOARD} exact>
              <Dashboard />
            </ProtectedRoute>
            <ProtectedRoute path={ROUTES.EDIT_POST} exact>
              <EditPost />
            </ProtectedRoute>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
