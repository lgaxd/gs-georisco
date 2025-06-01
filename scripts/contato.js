document.addEventListener('DOMContentLoaded', () => {
  const contatoForm = document.querySelector('.contact-form');
  const msgSucesso = document.getElementById('form-success');

  if (contatoForm && msgSucesso) {
    contatoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      msgSucesso.style.display = 'block';
      contatoForm.reset();
    });
  }
});