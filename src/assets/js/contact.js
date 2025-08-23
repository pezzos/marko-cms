document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        status.textContent = 'Thanks for your message!';
        form.reset();
      } else {
        status.textContent = 'Oops! There was a problem submitting your form.';
      }
    } catch {
      status.textContent = 'Oops! There was a problem submitting your form.';
    }
  });
});
