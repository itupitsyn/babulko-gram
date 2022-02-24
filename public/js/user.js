const { postForm } = document.forms;
const allEntries = document.querySelector('#allEntries');

function createCard(data) {
    const {entries} = data;

    return `<div class="card" style="width: 18rem;">
    <img src="${entries.image}" class="card-img-top" alt="image">
    <div class="card-body">
      <h5 class="card-title">${entries.userId}</h5>
      <h2 class="card-title">${entries.text}</h2>`
    
}

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(postForm);
    const response = await fetch('/user', {
        method: 'POST',
        body: formData,
    });
    
    if (response.ok) {
        const data = await entries.json();
        allEntries.insertAdjacentHTML('afterbegin', createCard(data));
    }else {
        alert('Что то пошло не так, перезагрузите страницу!');
    }

});