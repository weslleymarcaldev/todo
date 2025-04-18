let token = '';
let selectedListId = null;
const apiBaseUrl = 'http://localhost/todo/public/api';

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  fetch(`${apiBaseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(async res => {
    const data = await res.json();
    if (!res.ok) {
      console.error('Erro no login:', data);
      alert('Login falhou: ' + (data.error || 'Erro desconhecido.'));
      return;
    }
    token = data.access_token;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-section').classList.remove('d-none');
    loadLists();
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
    alert('Erro ao conectar com o servidor!');
  });
}

function register() {
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  fetch(`${apiBaseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  })
  .then(async res => {
    const data = await res.json();
    if (!res.ok) {
      console.error('Erro no registro:', data);
      alert('Registro falhou: ' + (data.error || 'Erro desconhecido.'));
      return;
    }
    token = data.access_token;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-section').classList.remove('d-none');
    loadLists();
  })
  .catch(error => {
    console.error('Erro na requisição:', error);
    alert('Erro ao conectar com o servidor!');
  });
}

// Função para registrar um novo usuário
async function registerUser(name, email, password) {
    try {
        const response = await fetch('http://localhost/todo/public/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`🎉 Bem-vindo, ${data.user.name}! Cadastro realizado com sucesso.`);
            localStorage.setItem('access_token', data.access_token);
        } else {
            alert(`❌ Erro no cadastro: ${data.message}\n${formatErrors(data.errors)}`);
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
        alert('❌ Erro inesperado ao tentar registrar.');
    }
}

// Função para logar
async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost/todo/public/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`🎉 Bem-vindo de volta, ${data.user.name}!`);
            localStorage.setItem('access_token', data.access_token);
        } else {
            alert(`❌ Erro no login: ${data.message}`);
        }
    } catch (error) {
        console.error('Erro ao logar:', error);
        alert('❌ Erro inesperado ao tentar logar.');
    }
}

// Função para formatar erros de validação
function formatErrors(errors) {
    if (!errors) return '';
    return Object.values(errors).map(err => `- ${err.join(', ')}`).join('\n');
}

// Função para fazer logout
function logout() {
  fetch(`${apiBaseUrl}/logout`, {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  }).finally(() => {
    token = '';
    selectedListId = null;
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('app-section').classList.add('d-none');
  });
}

function createList() {
  const title = document.getElementById('list-title').value;
  if (!title) return alert('Título da lista é obrigatório.');

  fetch(`${apiBaseUrl}/lists`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById('list-title').value = '';
    loadLists();
  });
}

function loadLists() {
  fetch(`${apiBaseUrl}/lists`, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
    const listContainer = document.getElementById('lists');
    listContainer.innerHTML = '';
    data.forEach(list => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = list.title;
      li.onclick = () => selectList(list);
      listContainer.appendChild(li);
    });
  });
}

function selectList(list) {
  selectedListId = list.id;
  document.getElementById('tasks-section').classList.remove('d-none');
  document.getElementById('list-title-view').textContent = `Tarefas de: ${list.title}`;
  loadTasks();
}

function createTask() {
  const description = document.getElementById('task-title').value;
  if (!description) return alert('Descrição da tarefa é obrigatória.');

  fetch(`${apiBaseUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ list_id: selectedListId, description })
  })
  .then(res => res.json())
  .then(() => {
    document.getElementById('task-title').value = '';
    loadTasks();
  });
}

function loadTasks() {
  fetch(`${apiBaseUrl}/tasks?list_id=${selectedListId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
    const tasksContainer = document.getElementById('tasks');
    tasksContainer.innerHTML = '';
    data.forEach(task => {
        const li = document.createElement('li');

        // Ícone dinâmico
        const icon = document.createElement('span');
        icon.textContent = task.completed ? '✅' : '❌';
        icon.style.cursor = 'pointer';
        icon.style.marginRight = '8px';

        // Texto da tarefa
        const description = document.createElement('span');
        description.textContent = task.description;
        if (task.completed) {
          description.style.textDecoration = 'line-through';
          description.style.color = '#6c757d'; // Cinza claro para concluídas
        }

        // Clique no ícone para alternar o status
        icon.onclick = () => toggleTaskStatus(task.id);

        li.appendChild(icon);
        li.appendChild(description);
        tasksContainer.appendChild(li);
      });

  });
}

function deleteTask(taskId) {
  fetch(`${apiBaseUrl}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(() => loadTasks());
}

function toggleTaskStatus(taskId) {
    fetch(`${apiBaseUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error('Falha ao atualizar a tarefa');
      }
      loadTasks(); // Recarrega as tarefas para atualizar o status e ícone
    })
    .catch(error => {
      console.error('Erro ao alterar status da tarefa:', error);
      alert('Erro ao alterar status da tarefa!');
    });
  }

// Listeners
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  login();
});

document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  register();
});

document.getElementById('list-form').addEventListener('submit', e => {
  e.preventDefault();
  createList();
});

document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  createTask();
});

document.getElementById('logout-btn').addEventListener('click', logout);
