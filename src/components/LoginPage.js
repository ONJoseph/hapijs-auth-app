import React from 'react';
import AuthForm from './AuthForm';

function LoginPage() {
  return (
    <div>
      <AuthForm registration={false} />
    </div>
  );
}

export default LoginPage;
