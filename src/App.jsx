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
import RequireBoardAuth from './features/auth/RequireBoardAuth';
import useTitle from './hooks/useTitle';
import Missing from './components/Missing';
import NotePage from './features/notes/NotePage';
import UserProfile from './features/user/UserProfile';
import RequireBoardNonAuth from './features/auth/RequireBoardNonAuth';
import PrivateBoardAuth from './features/boards/PrivateBoardAuth';
import PublicBoardAuth from './features/boards/PublicBoardAuth';
import RequirePrivBoard from './features/auth/RequirePrivBoard';
import RequirePubBoard from './features/auth/RequirePubBoard';
import AuthLayout from './features/auth/AuthLayout';
import ResetPassword from './features/auth/ResetPassword';
import BoardPageNotes from './features/boards/BoardPageNotes';
import BoardPageAbout from './features/boards/BoardPageAbout';
import RequireUserAuth from './features/auth/RequireUserAuth';

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
          {/*end public routes */}
        </Route>
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            {/*start dash*/}
            <Route path="dash" element={<DashLayout />}>
              <Route index element={<Welcome />} />
              {/* protected routes */}
              {/* boards routes */}
              <Route element={<RequireUserAuth />}>
                <Route path="boards">
                  <Route index element={<BoardsList />} />
                  <Route element={<RequireBoardAuth />}>
                    <Route path=":id">
                      <Route index element={<BoardPageNotes />} />
                      <Route path="about" element={<BoardPageAbout />} />
                    </Route>
                  </Route>
                  <Route element={<RequireBoardNonAuth />}>
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
              </Route>
              {/*end protected routes*/}
              {/*end dash*/}
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Missing />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
