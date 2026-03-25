import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { useForm } from 'react-hook-form';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await res.json();
      
      if (res.ok) {
        setAuth(result.token, result.user);
        navigate('/admin');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-ocean">
            Sign in to Dashboard
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-xl">{error}</div>}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="sr-only">Email address</label>
              <Input
                {...register('email', { required: true })}
                type="email"
                placeholder="Email address"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="sr-only">Password</label>
              <Input
                {...register('password', { required: true })}
                type="password"
                placeholder="Password"
                className="rounded-xl"
              />
            </div>
          </div>

          <div>
            <Button variant="secondary" type="submit" className="w-full rounded-xl py-6">
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
