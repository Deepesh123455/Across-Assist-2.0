import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { ROUTES } from '../../constants/routes';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    console.log(data);
    // TODO: dispatch register action
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {(['name', 'email', 'password', 'confirmPassword'] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize">
              {field === 'confirmPassword' ? 'Confirm Password' : field}
            </label>
            <input
              type={field.toLowerCase().includes('password') ? 'password' : 'text'}
              {...register(field)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors[field] && (
              <p className="mt-1 text-sm text-red-500">{errors[field]?.message}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
