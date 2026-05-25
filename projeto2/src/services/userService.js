import api, { apiService } from './api';

// Banco de dados simulado inicial caso o backend local não esteja rodando
const INITIAL_SIMULATED_USERS = [
  { id: 1, name: 'Guido van Rossum', email: 'guido@python.org', role: 'Anaconda (Master)', toxicity: 'Veneno Letal', status: 'Ativo' },
  { id: 2, name: 'Anaconda Constrictor', email: 'constrictor@anaconda.bio', role: 'Constrictor', toxicity: 'Nula (Forte)', status: 'Ativo' },
  { id: 3, name: 'Pythonist Core', email: 'core@python.org', role: 'Pythonist', toxicity: 'Ácida', status: 'Hibernando' },
  { id: 4, name: 'Cascavel Silenciosa', email: 'cascavel@serpente.dev', role: 'Constrictor', toxicity: 'Veneno Letal', status: 'Inativo' }
];

if (!localStorage.getItem('anaconda_simulated_users')) {
  localStorage.setItem('anaconda_simulated_users', JSON.stringify(INITIAL_SIMULATED_USERS));
}

// Helpers do Simulador
const getSimulatedUsers = () => JSON.parse(localStorage.getItem('anaconda_simulated_users') || '[]');
const saveSimulatedUsers = (users) => localStorage.setItem('anaconda_simulated_users', JSON.stringify(users));

/**
 * Função utilitária para interceptar erros de rede e ativar o modo simulado.
 * Suporta tolerância a falhas de rede (ERR_NETWORK) e endpoints não implementados (status 404).
 */
async function handleRequest(requestPromise, mockCallback) {
  if (apiService.isSimulated()) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockCallback();
  }

  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    // 1. Detecta se o backend está desligado (Network Error / ERR_NETWORK)
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message.includes('Network Error'))) {
      console.warn('[ANACONDA SERVICE] Servidor local em http://localhost:8000 inacessível. Ativando simulador local.');
      apiService.setSimulated(true);
      window.dispatchEvent(new CustomEvent('anaconda-connection-change', { detail: { simulated: true } }));
      
      await new Promise(resolve => setTimeout(resolve, 400));
      return mockCallback();
    }

    // 2. Detecta se o endpoint não existe fisicamente no backend (status 404)
    // Isso evita que a listagem de usuários quebre caso o backend possua apenas register, login e /me
    if (error.response?.status === 404) {
      console.warn(`[ANACONDA SERVICE] Rota física não encontrada no backend (status 404). Utilizando dados de simulação local.`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCallback();
    }

    // Se o backend retornou outro erro (como 422 de validação ou 401 de não autorizado), propaga a mensagem do backend
    const errorMessage = error.response?.data?.message || error.response?.data?.detail || error.response?.data?.error || error.message;
    throw new Error(Array.isArray(errorMessage) ? JSON.stringify(errorMessage) : errorMessage);
  }
}

export const userService = {
  // Autenticação (Login) - Envia 'username_or_email' conforme documentado no backend-content.md
  async login(usernameOrEmail, password) {
    return handleRequest(
      api.post('/api/auth/login', { 
        username_or_email: usernameOrEmail, 
        password: password 
      }),
      () => {
        // Validação no modo simulado
        if (usernameOrEmail === 'admin' && password !== 'anaconda123') {
          throw new Error('Código biológico incorreto para administrador (Use admin/anaconda123).');
        }
        
        const token = 'mock-jwt-token-anaconda-cyber-scales-12345';
        
        return {
          access_token: token,
          user: {
            name: usernameOrEmail === 'admin' ? 'Administrador Superior' : usernameOrEmail,
            email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@anaconda.bio`,
            role: usernameOrEmail === 'admin' ? 'Anaconda (Master)' : 'Pythonist'
          }
        };
      }
    ).then(async (data) => {
      if (data.access_token) {
        apiService.setToken(data.access_token);
        
        // Se for conexão real, busca o perfil detalhado via /api/users/me
        if (!apiService.isSimulated()) {
          try {
            const profile = await this.getMe();
            return {
              token: data.access_token,
              user: profile
            };
          } catch (e) {
            console.error('Falha ao obter dados do usuário após login', e);
          }
        }
      }
      return {
        token: data.access_token,
        user: data.user || {
          name: usernameOrEmail,
          email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@anaconda.bio`,
          role: usernameOrEmail === 'admin' ? 'Anaconda (Master)' : 'Pythonist'
        }
      };
    });
  },

  // Obter Perfil do Usuário Logado (/api/users/me) - Mapeia os dados do FastAPI para a interface
  async getMe() {
    return handleRequest(
      api.get('/api/users/me'),
      () => {
        return {
          name: 'Administrador Superior',
          email: 'admin@anaconda.bio',
          role: 'Anaconda (Master)'
        };
      }
    ).then(data => {
      if (data) {
        return {
          name: data.username || 'Operador',
          email: data.email,
          role: data.username === 'admin' ? 'Anaconda (Master)' : 'Pythonist'
        };
      }
      return data;
    });
  },

  // Cadastro de Novo Usuário (/api/auth/register) - Padrão FastAPI estrito
  async createUser(userData) {
    // Para evitar o erro 422, enviamos APENAS os campos declarados no schema de registro
    // do backend (FastAPI Pydantic UserCreate): 'username', 'email' e 'password'
    const cleanUsername = userData.username || userData.name.toLowerCase().trim().replace(/\s+/g, '_');
    
    const backendPayload = {
      username: cleanUsername,
      email: userData.email,
      password: userData.password
    };

    return handleRequest(
      api.post('/api/auth/register', backendPayload),
      () => {
        return null;
      }
    ).then(apiResult => {
      // Persistimos localmente para que apareça de imediato na listagem da homepage pública
      const users = getSimulatedUsers();
      
      const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (!exists) {
        const newUser = {
          id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
          name: userData.name || cleanUsername,
          email: userData.email,
          role: userData.role || (userData.isAdmin ? 'Anaconda (Master)' : 'Pythonist'),
          toxicity: userData.toxicity || (userData.isAdmin ? 'Veneno Letal' : 'Nula'),
          status: 'Ativo'
        };
        users.push(newUser);
        saveSimulatedUsers(users);
        return newUser;
      }
      
      return apiResult || { name: userData.name || cleanUsername, email: userData.email };
    });
  },

  // Listagem de Usuários (/api/users)
  async getUsers() {
    return handleRequest(
      api.get('/api/users'),
      () => {
        return getSimulatedUsers();
      }
    );
  },

  // Edição de Usuário (/api/users/:id)
  async updateUser(id, userData) {
    return handleRequest(
      api.put(`/api/users/${id}`, userData),
      () => {
        const users = getSimulatedUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('Espécime não cadastrado no terrário.');
        
        users[index] = {
          ...users[index],
          name: userData.name || users[index].name,
          email: userData.email || users[index].email,
          role: userData.role || users[index].role,
          toxicity: userData.toxicity || users[index].toxicity,
          status: userData.status || users[index].status
        };
        saveSimulatedUsers(users);
        return users[index];
      }
    );
  },

  // Exclusão de Usuário (/api/users/:id)
  async deleteUser(id) {
    return handleRequest(
      api.delete(`/api/users/${id}`),
      () => {
        const users = getSimulatedUsers();
        const index = users.findIndex(u => u.id === id);
        if (index === -1) throw new Error('Espécime não localizado na base.');
        
        const deletedUser = users[index];
        const filtered = users.filter(u => u.id !== id);
        saveSimulatedUsers(filtered);
        return { success: true, user: deletedUser };
      }
    );
  },

  // Logout
  logout() {
    apiService.setToken(null);
  }
};
