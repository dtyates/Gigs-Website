import { LoginForm } from '../LoginForm';

export default function LoginFormExample() {
  return (
    <LoginForm
      onLogin={(method, data) => console.log('Login with:', method, data)}
    />
  );
}