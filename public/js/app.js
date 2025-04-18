let token = '';
let selectedListId = null;
const apiBaseUrl = 'http://localhost/todo/public/api';

//#region Login
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
//#endregion Login

//#region Registro
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
//#endregion Registro

//#region Login
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
//#endregion Login

//#region Erros
// Função para formatar erros de validação
function formatErrors(errors) {
    if (!errors) return '';
    return Object.values(errors).map(err => `- ${err.join(', ')}`).join('\n');
}
//#endregion Erros

//#region Logout
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
//#endregion Logout

//#region Criar lista
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
//#endregion Criar lista

//#region Carregar listas
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
//#endregion Carregar listas

//#region Selecionar lista
function selectList(list) {
  selectedListId = list.id;
  document.getElementById('tasks-section').classList.remove('d-none');
  document.getElementById('list-title-view').textContent = `Tarefas de: ${list.title}`;
  loadTasks();

}
//#endregion Selecionar lista

//#region Criar tarefa
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
//#endregion Criar tarefa

//#region Carregar tarefas
function loadTasks() {
  if (!selectedListId) return;
  fetch(`${apiBaseUrl}/tasks?list_id=${selectedListId}`, {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(data => {
      const tasksContainer = document.getElementById('tasks');
      tasksContainer.innerHTML = '';
      data.forEach(task => {
        const li = document.createElement('li');
        li.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'mb-2');

        const leftSide = document.createElement('div');
        leftSide.classList.add('d-flex', 'align-items-center');

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
        icon.onclick = () => toggleTaskStatus(task);

        leftSide.appendChild(icon);
        leftSide.appendChild(description);

        // Botões de ações
        const actions = document.createElement('div');

        // Botão Editar
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.classList.add('btn', 'btn-sm', 'btn-primary', 'me-2');
        editBtn.onclick = () => editTask(task);

        // Botão Deletar
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Excluir';
        deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');
        deleteBtn.onclick = () => deleteTask(task.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(leftSide);
        li.appendChild(actions);
        tasksContainer.appendChild(li);
      });
    });
  }
//#endregion Carregar tarefas

//#region Editar tarefa
  function editTask(task) {
    const newDescription = prompt('Editar tarefa:', task.description);
    if (newDescription === null) return; // Cancelou o prompt
    if (newDescription.trim() === '') {
      alert('A descrição não pode ficar vazia!');
      return;
    }
    fetch(`${apiBaseUrl}/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ description: newDescription }) // <-- só o novo texto!
      })
      .then(res => res.json())
      .then(updatedTask => {
        loadTasks(); // recarrega a lista
      })
      .catch(error => console.error('Erro ao atualizar tarefa:', error));
  }
//#endregion Editar tarefa

//#region Excluir tarefa
  function deleteTask(taskId) {
    fetch(`${apiBaseUrl}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(async res => {
      if (!res.ok) {
        const data = await res.json();
        console.error('Erro ao deletar:', data);
        alert('Erro ao excluir tarefa!');
        return;
      }
      loadTasks();
    })
    .catch(error => {
      console.error('Erro inesperado ao excluir:', error);
      alert('Erro inesperado ao excluir tarefa!');
    });
  }
//#endregion Excluir tarefa

//#region Alternar status
function toggleTaskStatus(task) {
    fetch(`${apiBaseUrl}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ completed: !task.completed }) // <- inverte o valor atual!
    })
    .then(res => res.json())
    .then(updatedTask => {
      loadTasks(); // Recarrega a lista de tarefas atualizada
    })
    .catch(error => console.error('Erro ao alternar status da tarefa:', error));
  }
//#endregion Alternar status

//#region Listeners (Ouvintes)
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
//#endregion Listeners (Ouvintes)
