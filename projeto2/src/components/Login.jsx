import { useState } from 'react';
import { userService } from '../services/userService';
import { Shield, Key, User, Flame, Biohazard, Eye, EyeOff, ArrowLeft } from 'lucide-react';

function Login({ onLoginSuccess, onNavigateBack }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor, informe suas credenciais biológicas!');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await userService.login(username, password);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message || 'Falha ao acessar o ninho Anaconda. Verifique as credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickAccess = () => {
    setUsername('admin');
    setPassword('anaconda123');
  };

  return (
    <div 
      className="login-container" 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        position: 'relative'
      }}
    >
      <div 
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '40px 30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 25px rgba(57, 255, 20, 0.05)',
          border: '1px solid rgba(57, 255, 20, 0.2)',
          position: 'relative'
        }}
      >
        {/* BOTÃO VOLTAR */}
        <button 
          onClick={onNavigateBack}
          className="btn-secondary"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            zIndex: 10
          }}
        >
          <ArrowLeft size={14} />
          Voltar
        </button>
        {/* LOGO DE SERPENTE EXÓTICO ANIMADO EM SVG */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
          <div 
            className="animate-slither"
            style={{
              width: '80px',
              height: '80px',
              background: 'radial-gradient(circle, rgba(13,36,16,0.6) 0%, rgba(3,7,3,0.9) 100%)',
              border: '2px solid var(--color-neon-green)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon), inset 0 0 15px rgba(57,255,20,0.3)',
              marginBottom: '15px'
            }}
          >
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Espirais de cobra anaconda estilizadas */}
              <path 
                d="M50,15 C69.33,15 85,30.67 85,50 C85,69.33 69.33,85 50,85 C30.67,85 15,69.33 15,50 C15,35 25,22 40,17.5" 
                stroke="url(#snakeGradientGreen)" 
                strokeWidth="8" 
                strokeLinecap="round" 
                fill="none" 
              />
              <path 
                d="M50,28 C62.15,28 72,37.85 72,50 C72,62.15 62.15,72 50,72 C37.85,72 28,62.15 28,50 C28,42 34,34.5 42,31" 
                stroke="url(#snakeGradientYellow)" 
                strokeWidth="6" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Olho brilhante central */}
              <circle cx="50" cy="50" r="6" fill="var(--color-neon-green)" />
              <circle cx="50" cy="50" r="1.5" fill="#ffffff" />

              <defs>
                <linearGradient id="snakeGradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-neon-green)" />
                  <stop offset="100%" stopColor="#143b17" />
                </linearGradient>
                <linearGradient id="snakeGradientYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-python-yellow)" />
                  <stop offset="100%" stopColor="#a37603" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h1 
            className="font-title" 
            style={{ 
              fontSize: '1.8rem', 
              color: 'var(--color-neon-green)',
              textShadow: '0 0 10px rgba(57,255,20,0.3)',
              textAlign: 'center',
              fontWeight: 800,
              textTransform: 'uppercase'
            }}
          >
            Anaconda SafeNest
          </h1>
          <p 
            style={{ 
              fontSize: '0.8rem', 
              color: 'var(--color-text-secondary)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              marginTop: '4px',
              textAlign: 'center'
            }}
          >
            Portal de Autenticação Biológica
          </p>
        </div>

        {/* FEEDBACK DE ERRO */}
        {error && (
          <div className="alert-hazard">
            <Biohazard size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Acesso Negado:</strong> {error}
            </div>
          </div>
        )}

        {/* FORMULÁRIO DE LOGIN */}
        <form onSubmit={handleSubmit}>
          {/* USERNAME */}
          <div className="input-group">
            <label className="input-label">Espécime / E-mail</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin ou e-mail" 
                className="input-field"
                disabled={loading}
                autoComplete="username"
              />
              <User size={18} className="input-icon" />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label className="input-label">Código Biológico (Senha)</label>
            <div className="input-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••" 
                className="input-field"
                style={{ paddingRight: '44px' }}
                disabled={loading}
                autoComplete="current-password"
              />
              <Key size={18} className="input-icon" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BOTÃO SUBMIT */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading}
            style={{ marginBottom: '20px' }}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <Shield size={16} />
                Inocular Acesso
              </>
            )}
          </button>
        </form>

        {/* HELP ACCORDION / CREDENTIAL HINT */}
        <div 
          style={{
            background: 'rgba(255, 212, 59, 0.04)',
            border: '1px dashed var(--color-border-yellow)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.8rem',
            color: 'var(--color-text-secondary)',
            textAlign: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-python-yellow)', fontWeight: 600, marginBottom: '4px' }}>
            <Flame size={14} />
            Módulo Administrativo
          </div>
          Se o seu backend local ainda não estiver rodando, use as credenciais de contenção:
          <div style={{ marginTop: '8px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span style={{ background: 'rgba(255, 212, 59, 0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-python-yellow)' }}><strong>admin</strong></span>
            e
            <span style={{ background: 'rgba(255, 212, 59, 0.1)', padding: '2px 6px', borderRadius: '4px', color: 'var(--color-python-yellow)' }}><strong>anaconda123</strong></span>
          </div>
          <button 
            onClick={fillQuickAccess}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-neon-green)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.75rem',
              marginTop: '10px'
            }}
          >
            Preenchimento Automático
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
