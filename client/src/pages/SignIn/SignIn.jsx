import React, { useState } from 'react';
import IAMSignIn from './IAMSignIn';
import NFCSignIn from './NFCSignIn';

export default function SignIn() {
  const [signInMethod, setSignInMethod] = useState('iam');

  const handleSignInMethodChange = (method) => {
    setSignInMethod(method);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center mb-3">
        {signInMethod !== 'iam' && (
          <button
            className="btn btn-primary btn-lg mr-2"
            onClick={() => handleSignInMethodChange('iam')}
          >
            Sign in using IAM
          </button>
        )}
        {signInMethod !== 'nfc' && (
          <button
            className="btn btn-primary btn-lg"
            onClick={() => handleSignInMethodChange('nfc')}
          >
            Sign in using NFC
          </button>
        )}
      </div>

      {signInMethod === 'iam' ? <IAMSignIn /> : <NFCSignIn />}
    </div>
  );
}
