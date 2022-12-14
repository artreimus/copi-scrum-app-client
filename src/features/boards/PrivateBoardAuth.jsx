import React from 'react';
import { useState } from 'react';
import { useAccessBoardMutation } from './boardsApiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PrivateBoardAuth = () => {
  const [password, setPassword] = useState('');
  const { id: boardId } = useParams();
  const { userId } = useAuth();

  const [accessBoard, { isSuccess, isLoading, isError, error }] =
    useAccessBoardMutation();

  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onFormSubmit = async (e) => {
    e.preventDefault();
    await accessBoard({ boardId, credentials: { userId, password } });
  };

  return (
    <div>
      <form onSubmit={onFormSubmit}>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
          required
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default PrivateBoardAuth;
