const { postForm, delegationForm, ourDelegatee } = document.forms;
const allEntries = document.querySelector('#allEntries');
const allowedUsers = document.querySelector('#allowedUsers');

function createCard(data) {
  return `
  <div data-id=${data.id} class="card">
    <div class="cardText row">
      <div class="img col-auto">
        <img src="${data.image}" class="img" alt="image">
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

ourDelegatee?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const id = e.target.querySelector('select').value;
    const res = await fetch('/api/delegations', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ delegateeId: id }),
    });
    console.log(res);
    if (res.ok) {
      const elem = e.target.querySelector(`option[value="${id}"]`);
      console.log(elem);
      elem.remove();
    } else {
      alert('Что то пошло не так, перезагрузите страницу!');
    }
  } catch (error) {
    console.log(error);
    alert('Что то пошло не так, перезагрузите страницу!');
  }
});

postForm?.addEventListener('submit', async (e) => {
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
  e.target.reset();
});

delegationForm?.addEventListener('submit', async (e) => {
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
  } catch (error) {
    console.log(error);
    alert('Что то пошло не так, перезагрузите страницу!');
  }
});

allowedUsers?.addEventListener('change', (e) => {
  const id = e.target.value;
  if (Number.isNaN(Number(id))) {
    window.location = `${window.location.origin}/user`;
  } else {
    window.location = `${window.location.origin}/user/${id}`;
  }
});
