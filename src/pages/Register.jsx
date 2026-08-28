import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      await register(form);
      navigate('/conta', { replace: true });
    } catch (err) {
      setError(err.message || 'Não foi possível criar sua conta.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-16">
      <img src={logo} alt="Blanger Arte Rústica" className="h-16 w-16 rounded-full object-cover" />
      <p className="eyebrow mt-4 text-moss">Faça parte da oficina</p>
      <h1 className="mt-1 font-display text-3xl text-ink">Criar conta</h1>

      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-5">
        <div>
          <label className="field-label" htmlFor="name">Nome completo</label>
          <input
            id="name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="field-input"
            placeholder="Seu nome"
          />
        </div>

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
          <label className="field-label" htmlFor="phone">Telefone (opcional)</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="field-input"
            placeholder="(00) 00000-0000"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="field-input"
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        {error && (
          <p className="rounded-sm border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-emberDark">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="mt-6 text-sm text-walnutLight">
        Já tem conta?{' '}
        <Link to="/entrar" className="font-semibold text-ember hover:text-emberDark">
          Entrar
        </Link>
      </p>
    </div>
  );
}
