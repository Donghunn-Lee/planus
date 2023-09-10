import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import NotificationList from '../components/NotificationList';
import './LoginPage.css'; // LoginPage.css 파일을 import

function LoginPage(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://3.35.22.206:8080/auth/login', {
        email: email,
        password: password,
      });
      console.log(response);
      localStorage.setItem('token',response.data.accessToken);
      localStorage.setItem('user',email);
      
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
    }

    try {
      const response = await axios.get('http://3.35.22.206:8080/member/me', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
      });
      props.setUserInfo(response.data)
      localStorage.setItem('userNickname',response.data.nickname);
      localStorage.setItem('userId',response.data.id);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Login success');
      
      props.setIsAuthenticated(true);
    }
  }, [isAuthenticated, props]);

  if (props.IsAuthenticated) {
    return <Navigate to="/mycalendar" />;
  }

  return (
    <div className="page-container">
      <img src='/planus-logo.png' alt='Planus Logo' className="logo-image" />
      <div className="login-form">
        <form id="login" onSubmit={handleSubmit}>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="login-input">
            Login
          </button>
        </form>
        <div className="register-text">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
