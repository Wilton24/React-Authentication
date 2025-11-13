import AuthForm from '../components/AuthForm';

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;


export async function action({ request, params }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get('mode') || 'login';

  const data = await request.formData();
  const authData = {
    email: data.get('email'),
    password: data.get('password'),
  };

  let url;
  if (mode === 'login') {
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY';
  } else {
    url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: authData.email,
      password: authData.password,
      returnSecureToken: true,
    }),
  });

  if (!response.ok) {
    const errorResData = await response.json();
    let errorMessage = 'Authentication failed!';
    if (errorResData && errorResData.error && errorResData.error.message) {
      errorMessage = errorResData.error.message;
    }
    throw new Error(errorMessage);
  }

  const resData = await response.json();
  const expirationTime = new Date(
    new Date().getTime() + +resData.expiresIn * 1000
  );

  localStorage.setItem('token', resData.idToken);
  localStorage.setItem('expirationTime', expirationTime.toISOString());

  return null;
}