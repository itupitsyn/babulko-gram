const { postForm, delegationForm } = document.forms;
const allEntries = document.querySelector('#allEntries');

function createCard(data) {
  return `
  <div data-id=${data.id} class="card">
    <div class="cardText row">
      <div class="img col-auto">
        <img src="${data.image}" class="card-img-top" alt="image">
      </div>
      <div class="card-body col-auto">
      ${data.text}
      </div>
    </div>
    <div class="row">
      <audio controls>
        <source src="${data.sound}" type="audio/mp3">
      </audio>
    </div>
  </div>
  `;
}

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(postForm);
  const response = await fetch('/api/entries', {
    method: 'POST',
    body: formData,
  });
  if (response.ok) {
    const data = await response.json();
    allEntries.insertAdjacentHTML('afterbegin', createCard(data));
  } else {
    alert('Что то пошло не так, перезагрузите страницу!');
  }
});

delegationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const delegateeId = new FormData(document.forms.delegationForm).get(
      'delegatee',
    );
    const response = await fetch('/api/delegations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        delegateeId,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      e.target.querySelector(`[value="${delegateeId}"]`).remove();
    } else {
      console.log(data);
      alert('Что то пошло не так, перезагрузите страницу!');
    }
  } catch(error) {
    console.log(error);
    alert('Что то пошло не так, перезагрузите страницу!');
  }
});
