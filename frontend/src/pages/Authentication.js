import { redirect } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;


export async function action({ request, params }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  if (mode !== 'login' && mode !== 'signup') {
    throw new Error('Unsupported authentication mode');
  };

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };


  let url = `http://localhost:8080/${mode}`;



  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authData),
  });


  if (response.status === 422 || response.status === 401) {
    return response;
  };

  if (!response.ok) {
    throw new Error('Authentication failed!');
  }

  const resData = await response.json();
  // const expirationTime = new Date(
  //   new Date().getTime() + +resData.expiresIn * 1000
  // );
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 1); // 1 hour expiration

  // Store token and expiration time in local storage

  localStorage.setItem('token', resData.token);
  localStorage.setItem('expirationTime', expirationTime.toISOString());

  return redirect('/');
}