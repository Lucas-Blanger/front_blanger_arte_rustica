import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/conta';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Não foi possível entrar. Confira seus dados.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-16">
      <img src={logo} alt="Blanger Arte Rústica" className="h-16 w-16 rounded-full object-cover" />
      <p className="eyebrow mt-4 text-moss">Bem-vindo de volta</p>
      <h1 className="mt-1 font-display text-3xl text-ink">Entrar na conta</h1>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-5">
        <div>
          <label className="field-label" htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="field-input"
            placeholder="voce@email.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="password">Senha</label>
            <Link to="/esquecer-senha" className="text-xs text-ember hover:text-emberDark">
              Esqueceu a senha?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="field-input"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-sm border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-emberDark">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-sm text-walnutLight">
        Ainda não tem conta?{' '}
        <Link to="/registrar" className="font-semibold text-ember hover:text-emberDark">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
