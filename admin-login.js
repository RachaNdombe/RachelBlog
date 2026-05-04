document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('login-error');

  if (!loginForm || !usernameInput || !passwordInput || !errorMsg) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  if (params.get('error') === '1') {
    errorMsg.textContent = 'Identifiants incorrects.';
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMsg.textContent = '';

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      errorMsg.textContent = 'Veuillez remplir tous les champs.';
      return;
    }

    try {
      const response = await fetch('/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        window.location.href = '/admin.html';
        return;
      }

      errorMsg.textContent = 'Identifiants incorrects.';
    } catch (error) {
      errorMsg.textContent = 'Impossible de contacter le serveur.';
    }
  });
});
