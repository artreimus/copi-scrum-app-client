import { Routes, Route } from 'react-router-dom';
import DashLayout from './components/DashLayout';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import Public from './components/Public';
import Welcome from './features/auth/Welcome';
import BoardsList from './features/boards/BoardsList';
import UsersList from './features/users/UsersList';
import NotesList from './features/notes/NotesList';
import EditUser from './features/users/EditUser';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
import { ROLES } from './config/roles';
import RequireAuth from './features/auth/RequireAuth';
import useTitle from './hooks/useTitle';
import Missing from './components/Missing';
import BoardPage from './features/boards/BoardPage';
import NotePage from './features/notes/NotePage';

function App() {
  useTitle('Copi');
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />{' '}
        <Route path="register" element={<Register />} />
        {/* protected routes */}
        <Route element={<PersistLogin />}>
          {/* <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          > */}
          <Route element={<Prefetch />}>
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />

              {/* boards routes */}
              <Route path="boards">
                <Route index element={<BoardsList />} />
                <Route path=":id" element={<BoardPage />} />
              </Route>
              {/* user routes */}
              <Route path="users">
                <Route index element={<UsersList />} />
                <Route path=":id" element={<EditUser />} />
              </Route>

              {/* note routes */}
              <Route path="notes">
                <Route index element={<NotesList />} />
                <Route path=":id" element={<NotePage />} />
              </Route>
              {/*end dash*/}
            </Route>
            {/*end protected routes*/}
          </Route>
          {/* </Route> */}
        </Route>
        <Route path="*" element={<Missing />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
