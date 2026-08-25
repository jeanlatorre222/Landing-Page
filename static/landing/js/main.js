// JS for JSON login and room selection
document.addEventListener('DOMContentLoaded', function () {
  // Login form handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const u = document.getElementById('login-username').value;
      const p = document.getElementById('login-password').value;
      try {
        const res = await fetch('/api/login/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: u, password: p})
        });
        const data = await res.json();
        const msg = document.getElementById('login-msg');
        if (data.success) {
          msg.textContent = 'Conectado como ' + data.username;
          msg.style.color = '#0369a1';
        } else {
          msg.textContent = data.error || 'Error';
          msg.style.color = 'crimson';
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Reserve login handler (standalone page)
  const reserveForm = document.getElementById('reserve-login-form');
  if (reserveForm) {
    const reserveSubmit = document.getElementById('reserve-submit');
    const reserveMsg = document.getElementById('reserve-login-msg');
    reserveForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const u = document.getElementById('reserve-username').value.trim();
      const p = document.getElementById('reserve-password').value;
      if (!u || !p) {
        reserveMsg.textContent = 'Por favor completa usuario y contraseña.';
        reserveMsg.style.color = 'crimson';
        return;
      }
      reserveSubmit.disabled = true;
      const originalText = reserveSubmit.textContent;
      reserveSubmit.textContent = 'Entrando...';
      try {
        const res = await fetch('/api/login/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username: u, password: p})
        });
        const data = await res.json();
        if (data.success) {
          window.location.href = '/reserve/';
        } else {
          reserveMsg.textContent = data.error || 'Usuario o contraseña incorrectos.';
          reserveMsg.style.color = 'crimson';
        }
      } catch (err) {
        console.error(err);
        reserveMsg.textContent = 'Error de conexión. Intenta de nuevo.';
        reserveMsg.style.color = 'crimson';
      } finally {
        reserveSubmit.disabled = false;
        reserveSubmit.textContent = originalText;
      }
    });

    // Password toggle
    const toggle = document.getElementById('toggle-password');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const pw = document.getElementById('reserve-password');
        if (pw.type === 'password') {
          pw.type = 'text';
          toggle.textContent = 'Ocultar';
        } else {
          pw.type = 'password';
          toggle.textContent = 'Mostrar';
        }
      });
    }

    // Back button: try history.back(), fallback to '/'
    const backBtn = document.getElementById('reserve-back');
    if (backBtn) {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (history.length > 1) {
          history.back();
        } else {
          window.location.href = this.getAttribute('href') || '/';
        }
      });
    }
  }

  // Room selection handlers
  document.querySelectorAll('.select-room-btn').forEach(btn => {
    btn.addEventListener('click', async function () {
      const room = this.dataset.room;
      try {
        const res = await fetch('/api/select-room/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({room_type: room})
        });
        const data = await res.json();
        if (data.success) {
          alert('Habitación seleccionada: ' + data.room_type + (data.user ? (' (usuario: ' + data.user + ')') : ''));
        } else {
          alert('Error: ' + (data.error || 'desconocido'));
        }
      } catch (err) {
        console.error(err);
      }
    });
  });

  // Dashboard: save edited room
  const saveRoomBtn = document.getElementById('save-room');
  if (saveRoomBtn) {
    saveRoomBtn.addEventListener('click', async function () {
      const sel = document.getElementById('edit-room');
      const room = sel.value;
      try {
        const res = await fetch('/api/select-room/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({room_type: room})
        });
        const data = await res.json();
        const cur = document.getElementById('current-room');
        if (data.success) {
          if (cur) cur.textContent = data.room_type;
          alert('Habitación actualizada: ' + data.room_type);
        } else {
          alert('Error: ' + (data.error || 'desconocido'));
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Submit review from dashboard
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const text = document.getElementById('review-text').value.trim();
      const room = document.getElementById('review-room').value;
      const msg = document.getElementById('review-msg');
      const submit = document.getElementById('submit-review');
      if (!text) {
        msg.textContent = 'Escribe un texto para la opinión.';
        return;
      }
      submit.disabled = true;
      submit.textContent = 'Enviando...';
      try {
        const res = await fetch('/api/add-review/', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({text: text, room_type: room})
        });
        const data = await res.json();
        if (data.success) {
          msg.style.color = 'green';
          msg.textContent = 'Opinión enviada.';
          document.getElementById('review-text').value = '';
          // Optionally reload reviews or append
          location.reload();
        } else {
          msg.style.color = 'crimson';
          msg.textContent = data.error || 'Error al enviar.';
        }
      } catch (err) {
        console.error(err);
        msg.style.color = 'crimson';
        msg.textContent = 'Error de conexión.';
      } finally {
        submit.disabled = false;
        submit.textContent = 'Enviar opinión';
      }
    });
  }
});
