const { postForm } = document.forms;

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(postForm);
    const response = await fetch('/user', {
        method: 'POST',
        body: formData,
    });
});