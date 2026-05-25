import { useState, useEffect } from 'react';
import Login from './components/Login';
import UserList from './components/UserList';
import Register from './components/Register';
import { apiService } from './services/api';
import { userService } from './services/userService';
import { ShieldAlert, RefreshCw } from 'lucide-react';

function App() {
  // O estado 'view' agora inicia em 'list' (Homepage com a listagem de usuários!)
  const [view, setView] = useState('list'); 
  const [token, setToken] = useState(apiService.getToken());
  const [user, setUser] = useState(null);
  const [simulated, setSimulated] = useState(apiService.isSimulated());

  // Escuta alteração para modo simulado se a conexão falhar
  useEffect(() => {
    const handleConnectionChange = (e) => {
      setSimulated(e.detail.simulated);
    };

    window.addEventListener('anaconda-connection-change', handleConnectionChange);
    return () => {
      window.removeEventListener('anaconda-connection-change', handleConnectionChange);
    };
  }, []);

  // Verificar se o usuário já tem token ativo e restaurar sessão do backend real (/api/users/me)
  useEffect(() => {
    if (token) {
      userService.getMe()
        .then(profile => {
          setUser(profile);
        })
        .catch(() => {
          // Se falhar ou token expirar, desloga
          handleLogout();
        });
    }
  }, [token]);

  const handleLoginSuccess = (loginData) => {
    setToken(loginData.token);
    setUser(loginData.user || {
      name: 'Administrador Superior',
      email: 'admin@anaconda.bio',
      role: 'Anaconda (Master)'
    });
    setView('list'); // Retorna para a homepage após login bem sucedido
  };

  const handleLogout = () => {
    userService.logout();
    setToken(null);
    setUser(null);
    setView('list');
  };

  const retryRealConnection = () => {
    apiService.setSimulated(false);
    setSimulated(false);
    window.location.reload();
  };

  return (
    <div className="app-container">
      {/* Grade tecnológica de fundo */}
      <div className="grid-lines"></div>

      {/* Banner Temático: Modo de Simulação Ativo */}
      {simulated && (
        <div 
          className="simulated-banner" 
          style={{
            background: 'linear-gradient(90deg, #1f1803 0%, #3d2f02 50%, #1f1803 100%)',
            borderBottom: '1px solid var(--color-python-yellow)',
            padding: '10px 20px',
            fontSize: '0.85rem',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 4px 15px rgba(255, 212, 59, 0.15)',
            zIndex: 1000,
            position: 'relative'
          }}
        >
          <ShieldAlert size={16} className="animate-float" style={{ color: 'var(--color-python-yellow)' }} />
          <span style={{ color: 'var(--color-text-primary)' }}>
            <strong>[MODO SIMULAÇÃO BIOLÓGICA]</strong> O backend local em <code>{import.meta.env.VITE_API_URL || 'localhost:8000'}</code> está inacessível. Sistema rodando no modo de contenção local (LocalStorage).
          </span>
          <button 
            onClick={retryRealConnection}
            style={{
              background: 'var(--color-python-yellow)',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
              fontWeight: 700,
              padding: '4px 10px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0 0 8px var(--color-python-yellow)'; }}
            onMouseOut={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
          >
            <RefreshCw size={12} />
            Reconectar Lab
          </button>
        </div>
      )}

      {/* Roteamento das Telas do Ecossistema Anaconda */}
      {view === 'list' && (
        <UserList 
          user={user} 
          onLogout={handleLogout} 
          onNavigateRegister={() => setView('register')}
          onNavigateLogin={() => setView('login')}
        />
      )}

      {view === 'register' && (
        <Register 
          onNavigateBack={(shouldRefresh) => {
            setView('list');
            if (shouldRefresh) {
              window.dispatchEvent(new CustomEvent('anaconda-refresh-list'));
            }
          }}
        />
      )}

      {view === 'login' && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onNavigateBack={() => setView('list')}
        />
      )}
    </div>
  );
}

export default App;
