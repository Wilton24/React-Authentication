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

  // if (!response.ok) {
  //   let errorResData;
  //   let errorMessage = 'Authentication failed!';

  //   try {
  //     errorResData = await response.json();
  //   } catch (err) {
  //   }

  //   if (errorResData && errorResData.error && errorResData.error.message) {
  //     errorMessage = errorResData.error.message;
  //   }

  //   console.log("HERE is the cause:", errorMessage);
  //   throw new Error(errorMessage);
  // }

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  // const resData = await response.json();
  // const expirationTime = new Date(
  //   new Date().getTime() + +resData.expiresIn * 1000
  // );

  // localStorage.setItem('token', resData.idToken);
  // localStorage.setItem('expirationTime', expirationTime.toISOString());
  if (!response.ok) {
    throw new Error('Authentication failed!');
  }

  return redirect('/');
}