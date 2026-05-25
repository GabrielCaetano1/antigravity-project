import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { userService } from '../services/userService';
import UserModal from './UserModal';
import { 
  Users, 
  Search, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Filter, 
  Flame, 
  Activity, 
  ShieldCheck, 
  HeartCrack,
  AlertCircle
} from 'lucide-react';

function UserList({ user, onLogout, onNavigateRegister, onNavigateLogin }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para Filtros e Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Controle de Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);

  // Carregar usuários
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Erro ao carregar a colmeia de usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    const handleRefresh = () => {
      fetchUsers();
    };

    window.addEventListener('anaconda-refresh-list', handleRefresh);
    return () => {
      window.removeEventListener('anaconda-refresh-list', handleRefresh);
    };
  }, []);

  // Fechar modal e recarregar
  const handleModalClose = (shouldRefresh) => {
    setModalOpen(false);
    setSelectedUser(null);
    if (shouldRefresh) {
      fetchUsers();
    }
  };

  // Abrir Modal Criar
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedUser(null);
    setModalOpen(true);
  };

  // Abrir Modal Editar
  const handleOpenEdit = (targetUser) => {
    setModalMode('edit');
    setSelectedUser(targetUser);
    setModalOpen(true);
  };

  // Abrir Modal Deletar
  const handleOpenDelete = (targetUser) => {
    setModalMode('delete');
    setSelectedUser(targetUser);
    setModalOpen(true);
  };

  // Filtros aplicados em memória (reativo e imediato)
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'Todos' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'Todos' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Métricas do Serpentário
  const totalSpecimens = users.length;
  const activeSpecimens = users.filter(u => u.status === 'Ativo').length;
  const highlyToxic = users.filter(u => u.toxicity === 'Veneno Letal' || u.toxicity === 'Ácida').length;

  return (
    <div 
      className="dashboard-container" 
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* HEADER PRINCIPAL */}
      <header 
        className="glass-panel" 
        style={{
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          borderBottom: '2px solid rgba(57, 255, 20, 0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              background: 'rgba(57, 255, 20, 0.1)',
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid var(--color-neon-green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-neon)'
            }}
          >
            <Users size={24} style={{ color: 'var(--color-neon-green)' }} />
          </div>
          <div>
            <h1 className="font-title" style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Painel Serpentário
              <span className="font-mono" style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(57, 255, 20, 0.1)', border: '1px solid var(--color-neon-green)', borderRadius: '4px', color: 'var(--color-neon-green)' }}>
                LAB V1.0
              </span>
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              {user ? (
                <>Operador Autenticado: <strong style={{ color: 'var(--color-neon-green)' }}>{user.name}</strong> ({user.role})</>
              ) : (
                <span style={{ color: 'var(--color-python-yellow)' }}>Modo de Acesso Livre (Sem operador logado)</span>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={fetchUsers} 
            className="btn-secondary" 
            style={{ fontSize: '0.85rem', padding: '8px 16px' }}
          >
            Sincronizar Banco
          </button>
          
          {user ? (
            <button 
              onClick={onLogout} 
              className="btn-danger"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <LogOut size={16} />
              Desconectar
            </button>
          ) : (
            <button 
              onClick={onNavigateLogin} 
              className="btn-yellow"
              style={{ fontSize: '0.85rem', padding: '8px 16px' }}
            >
              <LogOut size={16} style={{ transform: 'rotate(180deg)' }} />
              Acessar SafeNest (Login)
            </button>
          )}
        </div>
      </header>

      {/* CARDS DE MÉTRICAS */}
      <section 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}
      >
        {/* Total */}
        <div 
          className="glass-panel animate-float" 
          style={{ 
            padding: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            background: 'linear-gradient(135deg, rgba(14,26,17,0.85) 0%, rgba(5,10,6,0.9) 100%)'
          }}
        >
          <div style={{ background: 'rgba(48, 105, 152, 0.1)', border: '1px solid #306998', padding: '12px', borderRadius: '12px', color: '#6fbaff' }}>
            <Users size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total de Espécimes</div>
            <div className="font-title" style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>
              {loading ? '...' : totalSpecimens}
            </div>
          </div>
        </div>

        {/* Ativos */}
        <div 
          className="glass-panel animate-float" 
          style={{ 
            padding: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            animationDelay: '1s',
            background: 'linear-gradient(135deg, rgba(14,26,17,0.85) 0%, rgba(5,10,6,0.9) 100%)'
          }}
        >
          <div style={{ background: 'rgba(57, 255, 20, 0.08)', border: '1px solid var(--color-neon-green)', padding: '12px', borderRadius: '12px', color: 'var(--color-neon-green)' }}>
            <Activity size={28} className="animate-slither" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Espécimes Ativos</div>
            <div className="font-title" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-neon-green)' }}>
              {loading ? '...' : activeSpecimens}
            </div>
          </div>
        </div>

        {/* Nível de Toxicidade */}
        <div 
          className="glass-panel animate-float" 
          style={{ 
            padding: '24px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            animationDelay: '2s',
            background: 'linear-gradient(135deg, rgba(14,26,17,0.85) 0%, rgba(5,10,6,0.9) 100%)'
          }}
        >
          <div style={{ background: 'rgba(255, 212, 59, 0.08)', border: '1px solid var(--color-python-yellow)', padding: '12px', borderRadius: '12px', color: 'var(--color-python-yellow)' }}>
            <Flame size={28} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Toxicidade Crítica</div>
            <div className="font-title" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-python-yellow)' }}>
              {loading ? '...' : highlyToxic}
            </div>
          </div>
        </div>
      </section>

      {/* FILTROS E BUSCA */}
      <section 
        className="glass-panel" 
        style={{
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div 
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Barra de Busca */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <input 
              type="text" 
              placeholder="Buscar espécime pelo nome ou e-mail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '44px', background: 'rgba(5, 10, 6, 0.7)' }}
            />
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '13px', color: 'var(--color-text-secondary)' }} />
          </div>

          {/* Botão de Cadastro */}
          <button 
            onClick={onNavigateRegister} 
            className="btn-primary" 
            style={{ width: 'auto', padding: '12px 24px' }}
          >
            <Plus size={18} />
            Inocular Espécime
          </button>
        </div>

        {/* Linha de filtros adicionais */}
        <div 
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            alignItems: 'center',
            fontSize: '0.85rem',
            borderTop: '1px solid rgba(57, 255, 20, 0.08)',
            paddingTop: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            <Filter size={14} />
            Filtrar Terrário:
          </div>

          {/* Filtro de Cargo (Role) */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Todos', 'Anaconda (Master)', 'Constrictor', 'Pythonist'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{
                  background: roleFilter === role ? 'rgba(57, 255, 20, 0.12)' : 'transparent',
                  border: `1px solid ${roleFilter === role ? 'var(--color-neon-green)' : 'rgba(57, 255, 20, 0.1)'}`,
                  color: roleFilter === role ? 'var(--color-neon-green)' : 'var(--color-text-secondary)',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s'
                }}
              >
                {role}
              </button>
            ))}
          </div>

          <div style={{ width: '1px', height: '20px', background: 'rgba(57, 255, 20, 0.15)', margin: '0 8px' }}></div>

          {/* Filtro de Status */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Todos', 'Ativo', 'Hibernando', 'Inativo'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  background: statusFilter === status ? 'rgba(255, 212, 59, 0.12)' : 'transparent',
                  border: `1px solid ${statusFilter === status ? 'var(--color-python-yellow)' : 'rgba(255, 212, 59, 0.1)'}`,
                  color: statusFilter === status ? 'var(--color-python-yellow)' : 'var(--color-text-secondary)',
                  borderRadius: '6px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  transition: 'all 0.2s'
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TABELA DE USUÁRIOS EXÓTICA */}
      <section className="glass-panel" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '16px' }}>
            <span className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }}></span>
            <p className="font-mono" style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>Sincronizando sensores do serpentário...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={40} style={{ color: 'var(--color-warning-red)' }} />
            <p style={{ color: '#ffb3b3' }}>{error}</p>
            <button onClick={fetchUsers} className="btn-secondary" style={{ marginTop: '12px' }}>Tentar Novamente</button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            Nenhum espécime biológico atende aos filtros definidos.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table 
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.9rem'
              }}
            >
              <thead>
                <tr 
                  style={{
                    background: 'rgba(5, 10, 6, 0.9)',
                    borderBottom: '1px solid rgba(57, 255, 20, 0.15)'
                  }}
                >
                  <th className="font-title" style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', width: '80px' }}>ID</th>
                  <th className="font-title" style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Espécime</th>
                  <th className="font-title" style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>E-mail</th>
                  <th className="font-title" style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Cargo / Nível</th>
                  <th className="font-title" style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Status</th>
                  <th className="font-title" style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Toxina</th>
                  <th className="font-title" style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr 
                    key={u.id}
                    style={{
                      borderBottom: '1px solid rgba(57, 255, 20, 0.05)',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(57, 255, 20, 0.03)';
                      e.currentTarget.style.boxShadow = 'inset 3px 0 0 var(--color-neon-green)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* ID */}
                    <td className="font-mono" style={{ padding: '18px 20px', color: 'var(--color-neon-green)', fontWeight: 'bold' }}>
                      #{u.id}
                    </td>

                    {/* Espécime / Nome */}
                    <td style={{ padding: '18px 20px', fontWeight: 600, color: '#fff' }}>
                      {u.name}
                    </td>

                    {/* E-mail */}
                    <td className="font-mono" style={{ padding: '18px 20px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      {u.email}
                    </td>

                    {/* Cargo / Nível */}
                    <td style={{ padding: '18px 20px' }}>
                      <span className={`badge ${
                        u.role === 'Anaconda (Master)' ? 'badge-red' : 
                        u.role === 'Constrictor' ? 'badge-yellow' : 'badge-blue'
                      }`}>
                        {u.role === 'Anaconda (Master)' && <ShieldCheck size={12} />}
                        {u.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '18px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span 
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 
                              u.status === 'Ativo' ? 'var(--color-neon-green)' : 
                              u.status === 'Hibernando' ? 'var(--color-python-yellow)' : 'var(--color-warning-red)',
                            boxShadow: 
                              u.status === 'Ativo' ? '0 0 8px var(--color-neon-green)' : 
                              u.status === 'Hibernando' ? '0 0 8px var(--color-python-yellow)' : '0 0 8px var(--color-warning-red)'
                          }}
                        ></span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                          {u.status}
                        </span>
                      </div>
                    </td>

                    {/* Toxina */}
                    <td style={{ padding: '18px 20px' }}>
                      <span 
                        style={{
                          fontSize: '0.85rem',
                          color: 
                            u.toxicity === 'Veneno Letal' ? 'var(--color-warning-red)' :
                            u.toxicity === 'Ácida' ? 'var(--color-python-yellow)' : 'var(--color-text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {u.toxicity === 'Veneno Letal' && <HeartCrack size={12} />}
                        {u.toxicity}
                      </span>
                    </td>

                    {/* Ações */}
                    <td style={{ padding: '18px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        {/* Editar */}
                        <button 
                          onClick={() => handleOpenEdit(u)}
                          className="btn-secondary"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 212, 59, 0.25)',
                            color: 'var(--color-python-yellow)'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 212, 59, 0.1)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          title="Modificar Espécime"
                        >
                          <Edit3 size={14} />
                        </button>

                        {/* Excluir */}
                        <button 
                          onClick={() => handleOpenDelete(u)}
                          className="btn-secondary"
                          style={{
                            padding: '6px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 51, 51, 0.25)',
                            color: 'var(--color-warning-red)'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 51, 51, 0.1)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                          title="Expurgar Registro"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FOOTER DO DOCK */}
      <footer style={{ textAlign: 'center', padding: '20px 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <Flame size={12} className="animate-slither" style={{ color: 'var(--color-neon-green)' }} />
        <span>Matriz de Gerenciamento Anaconda • Conectado à API local • Baseado em Python</span>
      </footer>

      {/* CONTROLE DO MODAL MULTIUSO */}
      {modalOpen && (
        <UserModal 
          mode={modalMode}
          user={selectedUser}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}

export default UserList;
