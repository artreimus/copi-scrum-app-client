import { store } from '../../app/store';
import { boardsApiSlice } from '../boards/boardsApiSlice';
import { usersApiSlice } from '../user/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
  useEffect(() => {
    store.dispatch(
      boardsApiSlice.util.prefetch('getBoards', 'boardsList', { force: true })
    );
    store.dispatch(
      usersApiSlice.util.prefetch('getUsers', 'updateBoardUsersModal', {
        force: true,
      })
    );
  }, []);

  return <Outlet />;
};

export default Prefetch;
