import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { 
  X, 
  Dna, 
  Mail, 
  UserPlus, 
  Save, 
  Trash2, 
  AlertTriangle, 
  Activity, 
  ShieldAlert,
  Skull
} from 'lucide-react';

function UserModal({ mode, user, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Pythonist');
  const [toxicity, setToxicity] = useState('Nula');
  const [status, setStatus] = useState('Ativo');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Carregar dados se for modo edição ou exclusão
  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'delete')) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'Pythonist');
      setToxicity(user.toxicity || 'Nula');
      setStatus(user.status || 'Ativo');
    }
  }, [user, mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validação local rápida
    if (mode !== 'delete' && (!name || !email)) {
      setError('Codinome do espécime e E-mail são campos obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'create') {
        const payload = { name, email, role, toxicity, status };
        await userService.createUser(payload);
      } else if (mode === 'edit') {
        const payload = { name, email, role, toxicity, status };
        await userService.updateUser(user.id, payload);
      } else if (mode === 'delete') {
        await userService.deleteUser(user.id);
      }
      
      // Fecha o modal e avisa para atualizar
      onClose(true);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao processar a operação no banco.');
    } finally {
      setLoading(false);
    }
  };

  // Cores de Borda e Destaques Dinâmicos Baseados no Modo
  const getThemeStyles = () => {
    switch (mode) {
      case 'edit':
        return {
          title: 'Mutação Genética (Editar)',
          icon: <Dna size={20} style={{ color: 'var(--color-python-yellow)' }} />,
          borderColor: 'var(--color-python-yellow)',
          btnClass: 'btn-yellow',
          shadow: 'var(--shadow-yellow)',
          submitText: 'Salvar Mutação'
        };
      case 'delete':
        return {
          title: 'Expurgo Biológico (Excluir)',
          icon: <Skull size={20} style={{ color: 'var(--color-warning-red)' }} />,
          borderColor: 'var(--color-warning-red)',
          btnClass: 'btn-danger',
          shadow: 'var(--shadow-red)',
          submitText: 'Expurgar Registro'
        };
      case 'create':
      default:
        return {
          title: 'Inocular Novo Espécime (Criar)',
          icon: <UserPlus size={20} style={{ color: 'var(--color-neon-green)' }} />,
          borderColor: 'var(--color-neon-green)',
          btnClass: 'btn-primary',
          shadow: 'var(--shadow-neon)',
          submitText: 'Inocular Espécime'
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div className="modal-overlay animate-scale-in">
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: mode === 'delete' ? '500px' : '550px',
          padding: '30px',
          border: `1px solid ${theme.borderColor}`,
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.7), ${theme.shadow}`,
          position: 'relative'
        }}
      >
        {/* BOTÃO FECHAR */}
        <button 
          onClick={() => onClose(false)}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = theme.borderColor; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; }}
        >
          <X size={20} />
        </button>

        {/* HEADER DO MODAL */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div 
            style={{
              background: 'rgba(57, 255, 20, 0.03)',
              border: `1px solid ${theme.borderColor}`,
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {theme.icon}
          </div>
          <h2 className="font-title" style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
            {theme.title}
          </h2>
        </div>

        {/* ALERTA DE ERRO */}
        {error && (
          <div className="alert-hazard">
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Falha de Biossegurança:</strong> {error}
            </div>
          </div>
        )}

        {/* EXCLUSÃO (TELA DE EXPURGO) */}
        {mode === 'delete' ? (
          <form onSubmit={handleSubmit}>
            <div 
              style={{
                background: 'rgba(255, 51, 51, 0.05)',
                border: '1px solid rgba(255, 51, 51, 0.2)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'center'
              }}
            >
              <div 
                className="animate-float"
                style={{
                  display: 'inline-flex',
                  background: 'rgba(255, 51, 51, 0.1)',
                  padding: '16px',
                  borderRadius: '50%',
                  border: '1px solid var(--color-warning-red)',
                  color: 'var(--color-warning-red)',
                  marginBottom: '16px',
                  boxShadow: '0 0 15px rgba(255, 51, 51, 0.2)'
                }}
              >
                <AlertTriangle size={36} />
              </div>
              <h3 
                className="font-title" 
                style={{ 
                  color: '#fff', 
                  fontSize: '1.05rem', 
                  marginBottom: '12px', 
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}
              >
                Confirmação de Destruição
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                Tem certeza absoluta de que deseja expurgar o espécime <strong style={{ color: 'var(--color-warning-red)' }}>{name}</strong> (#{user?.id}) da colmeia Anaconda?
              </p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', marginTop: '12px', fontStyle: 'italic' }}>
                Esta mutação destrutiva é permanente e limpará todos os códigos de acesso.
              </p>
            </div>

            {/* BOTÕES DE CONFIRMAÇÃO DE EXPURGO */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                onClick={() => onClose(false)} 
                className="btn-secondary"
                disabled={loading}
              >
                Manter Protegido
              </button>
              
              <button 
                type="submit" 
                className="btn-danger" 
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Confirmar Expurgo
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* FORMULÁRIO DE CADASTRO OU EDIÇÃO */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* NOME / CODINOME */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Codinome do Espécime</label>
              <div className="input-wrapper">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Guido van Rossum" 
                  className="input-field"
                  disabled={loading}
                  maxLength={50}
                />
                <Dna size={18} className="input-icon" />
              </div>
            </div>

            {/* E-MAIL DE CONTATO */}
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Código de E-mail</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ex: guido@python.org" 
                  className="input-field"
                  disabled={loading}
                />
                <Mail size={18} className="input-icon" />
              </div>
            </div>

            {/* CARGO (ROLE) & STATUS (LADO A LADO) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="input-label">Nível de Acesso (Cargo)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  className="input-field"
                  style={{ paddingLeft: '16px', background: 'rgba(10, 20, 12, 0.8)' }}
                >
                  <option value="Pythonist" style={{ background: '#0a140c' }}>Pythonist</option>
                  <option value="Constrictor" style={{ background: '#0a140c' }}>Constrictor</option>
                  <option value="Anaconda (Master)" style={{ background: '#0a140c' }}>Anaconda (Master)</option>
                </select>
              </div>

              <div>
                <label className="input-label">Status Vital</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={loading}
                  className="input-field"
                  style={{ paddingLeft: '16px', background: 'rgba(10, 20, 12, 0.8)' }}
                >
                  <option value="Ativo" style={{ background: '#0a140c' }}>Ativo</option>
                  <option value="Hibernando" style={{ background: '#0a140c' }}>Hibernando</option>
                  <option value="Inativo" style={{ background: '#0a140c' }}>Inativo</option>
                </select>
              </div>
            </div>

            {/* TOXICIDADE (SLIDER OU LISTA) */}
            <div>
              <label className="input-label">Nível de Toxicidade (Veneno)</label>
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(4, 1fr)', 
                  gap: '8px',
                  marginTop: '6px'
                }}
              >
                {['Nula', 'Leve', 'Ácida', 'Veneno Letal'].map((level) => {
                  const isActive = toxicity === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setToxicity(level)}
                      disabled={loading}
                      style={{
                        padding: '10px 4px',
                        background: isActive ? 'rgba(57, 255, 20, 0.08)' : 'rgba(5, 10, 6, 0.4)',
                        border: `1px solid ${isActive ? 'var(--color-neon-green)' : 'rgba(57, 255, 20, 0.1)'}`,
                        color: isActive ? 'var(--color-neon-green)' : 'var(--color-text-secondary)',
                        fontSize: '0.75rem',
                        fontWeight: isActive ? 700 : 500,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        textTransform: 'uppercase'
                      }}
                    >
                      {level}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTÕES DO FORMULÁRIO */}
            <div 
              style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end', 
                marginTop: '10px',
                borderTop: '1px solid rgba(57, 255, 20, 0.08)',
                paddingTop: '20px'
              }}
            >
              <button 
                type="button" 
                onClick={() => onClose(false)} 
                className="btn-secondary"
                disabled={loading}
              >
                Abortar
              </button>

              <button 
                type="submit" 
                className={theme.btnClass}
                disabled={loading}
                style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <Save size={16} />
                    {theme.submitText}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserModal;
