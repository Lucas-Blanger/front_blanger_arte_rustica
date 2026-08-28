import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPasswordRequest, resetPasswordRequest } from '../api/auth.api';
import logo from '../assets/logo.jpeg';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState('request'); // 'request' | 'reset' | 'success'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await forgotPasswordRequest({ email });
      setMessage(res.message || 'Se o e-mail estiver cadastrado, um código foi enviado.');
      setStep('reset');
    } catch (err) {
      setError(err.message || 'Não foi possível enviar o código de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await resetPasswordRequest({ email, code: code.trim(), newPassword });
      setMessage(res.message || 'Senha redefinida com sucesso!');
      setStep('success');
    } catch (err) {
      setError(err.message || 'Código inválido ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 py-16">
      <img src={logo} alt="Blanger Arte Rústica" className="h-16 w-16 rounded-full object-cover" />
      <p className="eyebrow mt-4 text-moss">Recuperação de Acesso</p>
      <h1 className="mt-1 font-display text-3xl text-ink">Recuperar Senha</h1>

      {step === 'request' && (
        <form onSubmit={handleRequestCode} className="mt-8 w-full space-y-5">
          <p className="text-sm text-walnutLight leading-relaxed">
            Informe o seu e-mail cadastrado. Enviaremos um código de verificação de 6 dígitos para você redefinir sua senha.
          </p>

          <div>
            <label className="field-label" htmlFor="email">E-mail cadastrado</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
              placeholder="voce@email.com"
            />
          </div>

          {error && (
            <p className="rounded-sm border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-emberDark">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Enviando código...' : 'Enviar Código de Recuperação'}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetPassword} className="mt-8 w-full space-y-5">
          {message && (
            <p className="rounded-sm border border-moss/30 bg-moss/10 px-3 py-2 text-sm text-mossDark">
              {message}
            </p>
          )}

          <div>
            <label className="field-label" htmlFor="reset-email">E-mail</label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field-input"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="code">Código de 6 dígitos</label>
            <input
              id="code"
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="field-input font-mono text-center text-lg tracking-widest uppercase"
              placeholder="123456"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="newPassword">Nova Senha</label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="field-input"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && (
            <p className="rounded-sm border border-ember/30 bg-ember/5 px-3 py-2 text-sm text-emberDark">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>
      )}

      {step === 'success' && (
        <div className="mt-8 w-full text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss/20 text-mossDark">
            ✓
          </div>
          <p className="font-display text-xl text-ink">Senha alterada com sucesso!</p>
          <p className="text-sm text-walnutLight">
            Sua nova senha já está ativa. Você já pode fazer login na sua conta.
          </p>
          <button onClick={() => navigate('/entrar')} className="btn-primary w-full mt-4">
            Ir para o Login
          </button>
        </div>
      )}

      <p className="mt-6 text-sm text-walnutLight">
        Lembrou a senha?{' '}
        <Link to="/entrar" className="font-semibold text-ember hover:text-emberDark">
          Voltar para o Login
        </Link>
      </p>
    </div>
  );
}
