import React, { useState } from 'react'
import AuthLayouts from '../../components/Layout/AuthLayouts';
import { validateEmail } from '../../utils/apipath';

const SignUp = () => {
  const [profilePic, setProfilepic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState('');

  const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (!fullName) {
        setError("Please enter full name.");
        return
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return
      }
  
      if (!password) {
        setError("Please enter the password.");
        return
      }
      setError("");
    };

  return (
    <AuthLayouts>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Create an Account
        </h3>
        <p className="text-xs text-slate-7000 mt-[5px] mb-6">
          Join us today by entering your details below.
        </p>

        <form onSubmit={handleSignUp}>
          <Profile

        </form>
      </div>
    </AuthLayouts>
  )
}

export default SignUp
