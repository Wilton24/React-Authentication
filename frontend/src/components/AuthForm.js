import { Form, Link, useSearchParams, useActionData, useNavigation } from 'react-router-dom';
import classes from './AuthForm.module.css';

function AuthForm() {
  const navigation = useNavigation();
  const data = useActionData();

  const [searchParams] = useSearchParams();
  const signup = searchParams.get("mode") === "login" ? "signup" : "login";
  const isSubmitting = navigation.state === 'submitting';

  console.log(data);


  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{signup === "login" ? "Log in" : "Create new user"}</h1>
        {data && data.errors && <ul>
          {Object.values(data.errors).map(err =>
            <li key={err}>{err}
            </li>)}</ul>}
        {data && data.message && <p>{data.message}</p>}
        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${signup}`}>
            {signup === "login" ? "Log in" : "Create new user"}
          </Link>
          <button disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
