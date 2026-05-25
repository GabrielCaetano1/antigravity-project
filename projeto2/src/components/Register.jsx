import { useState } from 'react';
import { userService } from '../services/userService';
import { 
  ArrowLeft, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  Biohazard,
  Flame,
  CheckCircle2
} from 'lucide-react';

function Register({ onNavigateBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [toxicity, setToxicity] = useState('Nula');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Por favor, preencha todos os campos biológicos obrigatórios!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    // Mapeamento de dados tolerante para qualquer schema de backend
    const payload = {
      name,
      email,
      password,
      role: isAdmin ? 'Anaconda (Master)' : 'Pythonist',
      isAdmin: isAdmin, // Envia tanto o role temático quanto o booleano isAdmin
      status: 'Ativo',
      toxicity: toxicity || (isAdmin ? 'Veneno Letal' : 'Nula')
    };

    try {
      await userService.createUser(payload);
      setSuccess(true);
      
      // Limpa formulário
      setName('');
      setEmail('');
      setPassword('');
      setIsAdmin(false);
      setToxicity('Nula');

      // Atraso de 1.5s antes de voltar para a Home para o usuário ver o feedback de sucesso
      setTimeout(() => {
        onNavigateBack(true); // avisa para recarregar a lista
      }, 1500);
    } catch (err) {
      setError(err.message || 'Falha ao registrar espécime no banco de dados local.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="register-page-container" 
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '40px 20px',
        position: 'relative'
      }}
    >
      <div 
        className="glass-panel animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '550px',
          padding: '40px 30px',
          border: '1px solid rgba(57, 255, 20, 0.25)',
          boxShadow: '0 10px 45px rgba(0,0,0,0.6), var(--shadow-neon)'
        }}
      >
        {/* BOTÃO VOLTAR */}
        <button 
          onClick={() => onNavigateBack(false)}
          className="btn-secondary"
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            padding: '6px 12px',
            fontSize: '0.8rem'
          }}
        >
          <ArrowLeft size={14} />
          Voltar para Home
        </button>

        {/* CABEÇALHO */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', marginBottom: '30px' }}>
          <div 
            style={{
              width: '60px',
              height: '60px',
              background: 'rgba(57, 255, 20, 0.05)',
              border: '1px solid var(--color-neon-green)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon)',
              marginBottom: '12px'
            }}
          >
            <UserPlus size={24} style={{ color: 'var(--color-neon-green)' }} />
          </div>
          <h2 className="font-title" style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Inocular Cadastro
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>
            Criar Novo Registro no Ecossistema Anaconda
          </p>
        </div>

        {/* FEEDBACK DE SUCESSO */}
        {success && (
          <div className="alert-success animate-scale-in">
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Inoculação Concluída!</strong> Registro salvo com sucesso. Redirecionando para o ninho...
            </div>
          </div>
        )}

        {/* FEEDBACK DE ERRO */}
        {error && (
          <div className="alert-hazard">
            <Biohazard size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Erro de Cadastro:</strong> {error}
            </div>
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* NOME */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Codinome / Nome do Espécime</label>
            <div className="input-wrapper">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Gabriel Silva" 
                className="input-field"
                disabled={loading || success}
              />
              <User size={18} className="input-icon" />
            </div>
          </div>

          {/* EMAIL */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">E-mail de Cadastro</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: gabriel@anaconda.dev" 
                className="input-field"
                disabled={loading || success}
              />
              <Mail size={18} className="input-icon" />
            </div>
          </div>

          {/* SENHA */}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Chave de Acesso (Senha)</label>
            <div className="input-wrapper">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Defina uma senha segura" 
                className="input-field"
                disabled={loading || success}
                autoComplete="new-password"
              />
              <Lock size={18} className="input-icon" />
            </div>
          </div>

          {/* DADOS DE TOXICIDADE */}
          <div>
            <label className="input-label">Nível de Toxicidade (Toxina)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
              {['Nula', 'Leve', 'Ácida', 'Veneno Letal'].map((level) => {
                const isActive = toxicity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setToxicity(level)}
                    disabled={loading || success}
                    style={{
                      padding: '8px 4px',
                      background: isActive ? 'rgba(57, 255, 20, 0.08)' : 'rgba(5, 10, 6, 0.4)',
                      border: `1px solid ${isActive ? 'var(--color-neon-green)' : 'rgba(57, 255, 20, 0.1)'}`,
                      color: isActive ? 'var(--color-neon-green)' : 'var(--color-text-secondary)',
                      fontSize: '0.75rem',
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textTransform: 'uppercase'
                    }}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHECKBOX ADMIN EXÓTICO */}
          <div 
            style={{
              background: isAdmin ? 'rgba(255, 212, 59, 0.04)' : 'rgba(255, 255, 255, 0.01)',
              border: `1px solid ${isAdmin ? 'rgba(255, 212, 59, 0.3)' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={() => !loading && !success && setIsAdmin(!isAdmin)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                style={{
                  background: isAdmin ? 'rgba(255, 212, 59, 0.15)' : 'rgba(255,255,255,0.03)',
                  padding: '8px',
                  borderRadius: '6px',
                  color: isAdmin ? 'var(--color-python-yellow)' : 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  border: `1px solid ${isAdmin ? 'var(--color-python-yellow)' : 'transparent'}`
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Nível Administrativo (Admin)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Concede privilégios administrativos master na colmeia</div>
              </div>
            </div>
            
            {/* Custom Switch Toggle */}
            <div 
              style={{
                width: '42px',
                height: '24px',
                background: isAdmin ? 'var(--color-python-yellow)' : '#1a241c',
                borderRadius: '12px',
                position: 'relative',
                transition: 'all 0.3s',
                boxShadow: isAdmin ? 'var(--shadow-yellow)' : 'none'
              }}
            >
              <div 
                style={{
                  width: '18px',
                  height: '18px',
                  background: isAdmin ? '#000' : 'var(--color-text-secondary)',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '3px',
                  left: isAdmin ? '21px' : '3px',
                  transition: 'all 0.3s'
                }}
              />
            </div>
          </div>

          {/* BOTÃO ENVIAR */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading || success}
            style={{ 
              marginTop: '10px',
              border: `1px solid ${isAdmin ? 'var(--color-python-yellow)' : 'var(--color-neon-green)'}`,
              color: isAdmin ? 'var(--color-python-yellow)' : 'var(--color-neon-green)',
              boxShadow: isAdmin ? 'var(--shadow-yellow)' : 'var(--shadow-neon)'
            }}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <>
                <UserPlus size={16} />
                Confirmar Cadastro
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
