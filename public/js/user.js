const { postForm } = document.forms;

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(postForm);
  const response = await fetch('/api/entries', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  console.log(data);
});
