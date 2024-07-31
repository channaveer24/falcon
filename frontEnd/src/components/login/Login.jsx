import React from 'react';
import './login.css';

const Login = () => {
  return (
    <div className="App">
      <div className="login-container">
        <form className="login-form">
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="username">User Name</label>
            <input type="text" id="username" name="username" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <button className='submit' type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Login