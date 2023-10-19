import React from 'react';
import AuthForm from './AuthForm';

function RegistrationPage() {
  return (
    <div>
      <AuthForm registration={true} />
    </div>
  );
}

export default RegistrationPage;
