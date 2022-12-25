import { Routes, Route } from 'react-router-dom';
import DashLayout from './components/DashLayout';
import Layout from './components/Layout';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import HomePage from './components/HomePage';
import Welcome from './features/auth/Welcome';
import BoardsList from './features/boards/BoardsList';
import NotesList from './features/notes/NotesList';
import EditUser from './features/user/EditUser';
import Prefetch from './features/auth/Prefetch';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import useTitle from './hooks/useTitle';
import Missing from './components/Missing';
import NotePage from './features/notes/NotePage';
import UserProfile from './features/user/UserProfile';
import RequireNonAuth from './features/auth/RequireNonAuth';
import PrivateBoardAuth from './features/boards/PrivateBoardAuth';
import PublicBoardAuth from './features/boards/PublicBoardAuth';
import RequirePrivBoard from './features/auth/RequirePrivBoard';
import RequirePubBoard from './features/auth/RequirePubBoard';
import AuthLayout from './features/auth/AuthLayout';
import ResetPassword from './features/auth/ResetPassword';
import BoardPageNotes from './features/boards/BoardPageNotes';
import BoardPageAbout from './features/boards/BoardPageAbout';

function App() {
  useTitle('Copi');
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<HomePage />} />
        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
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
                <Route element={<RequireAuth />}>
                  <Route path=":id">
                    <Route index element={<BoardPageNotes />} />{' '}
                    <Route path="about" element={<BoardPageAbout />} />
                  </Route>
                </Route>
                <Route element={<RequireNonAuth />}>
                  <Route element={<RequirePrivBoard />}>
                    <Route
                      path=":id/join-private"
                      element={<PrivateBoardAuth />}
                    />
                  </Route>
                  <Route element={<RequirePubBoard />}>
                    <Route
                      path=":id/join-public"
                      element={<PublicBoardAuth />}
                    />
                  </Route>
                </Route>
              </Route>
              {/* user routes */}
              <Route path="user">
                <Route index element={<UserProfile />} />
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
