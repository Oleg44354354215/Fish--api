let formData = {
    email: '',
    message: '',
  };
  
  const form = document.querySelector('.feedback-form');
  const key = 'feedback-form-state';
  
  form.addEventListener('input', function cheсkInput(event) {
    const input = event.target.name;
    if (input === 'email' || input === 'message') {
      formData[input] = event.target.value.trim();
      localStorage.setItem(key, JSON.stringify(formData));
    }
  });
  
  const inpEmail = document.querySelector('input[name="email"]');
  const inpMassage = document.querySelector('textarea[name="message"]');
  
  const saveData = JSON.parse(localStorage.getItem(key));
  if (saveData) {
    inpEmail.value = saveData.email;
    formData.email = saveData.email;
    inpMassage.value = saveData.message;
    formData.message = saveData.message;
  }
  
  form.addEventListener('submit', cheсkFofm);
  function cheсkFofm(event) {
    event.preventDefault();
    if (formData.email === '' || formData.message === '') {
      alert('Fill please all fields');
    } else {
      console.log(formData);
      localStorage.removeItem(key);
      formData = {
        email: '',
        message: '',
      };
      (inpEmail.value = ''), (inpMassage.value = '');
    }
  }