import { useState } from 'react';

const BoardAccessModal = () => {
  const [password, setPassword] = useState('');

  const onPasswordChanged = (e) => setPassword(e.target.value);

  return (
    <form>
      <label htmlFor="password">Board Password</label>
      <input
        id="password"
        name="password"
        type="password"
        value={password}
        onChange={onPasswordChanged}
      />
    </form>
  );
};

export default BoardAccessModal;
