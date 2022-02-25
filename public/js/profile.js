const { profileForm } = document.forms;

 console.log(profileForm)
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = Object.fromEntries(new FormData(profileForm));
    console.log(formData);
    const response = await fetch('/profile', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(formData),
    });

})