(function(){
  const PANEL_PATH = 'panel.html';

  function setLoginButtonState(button, user){
    if(!button) return;
    const label = button.querySelector('span');
    if(label){
      label.textContent = user ? 'Panel' : 'Zaloguj';
    }
    button.setAttribute('aria-label', user ? 'Panel użytkownika' : 'Zaloguj');
  }

  function redirectToPanel(){
    window.location.href = PANEL_PATH;
  }

  function ensureFirebaseAvailable(){
    if(!window.firebase || !window.firebase.auth){
      return { ok: false, reason: 'sdk' };
    }
    if(!window.VLAN_FIREBASE_CONFIG){
      return { ok: false, reason: 'config' };
    }
    return { ok: true };
  }

  function initFirebaseApp(){
    if(!firebase.apps.length){
      firebase.initializeApp(window.VLAN_FIREBASE_CONFIG);
    }
    return firebase.auth();
  }

  function fillUserProfile(user){
    const nameEl = document.getElementById('authUserName');
    const emailEl = document.getElementById('authUserEmail');
    const avatarEl = document.getElementById('authUserAvatar');

    if(nameEl){
      nameEl.textContent = user?.displayName || 'Użytkownik Google';
    }
    if(emailEl){
      emailEl.textContent = user?.email || 'Brak adresu e-mail';
    }
    if(avatarEl && user?.photoURL){
      avatarEl.src = user.photoURL;
      avatarEl.alt = user.displayName ? `Avatar: ${user.displayName}` : 'Avatar użytkownika';
    }
  }

  async function runFirebaseAuthFlow(){
    const availability = ensureFirebaseAvailable();
    if(!availability.ok){
      if(availability.reason === 'sdk'){
        alert('Brak biblioteki Firebase SDK. Odśwież stronę i spróbuj ponownie.');
      }else{
        alert('Brak konfiguracji Firebase. Uzupełnij VLAN_FIREBASE_CONFIG w auth-config.js.');
      }
      return;
    }

    const auth = initFirebaseApp();
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const loginButton = document.getElementById('loginBtn');
    if(loginButton){
      loginButton.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const currentUser = auth.currentUser;
        if(currentUser){
          redirectToPanel();
          return;
        }

        try{
          await auth.signInWithPopup(provider);
          redirectToPanel();
        }catch(err){
          alert('Logowanie Firebase/Google nie powiodło się. Sprawdź konfigurację Authentication w Firebase.');
        }
      });
    }

    auth.onAuthStateChanged((user) => {
      setLoginButtonState(loginButton, user);

      const pageType = document.body ? document.body.getAttribute('data-auth-page') : '';
      if(pageType === 'panel'){
        if(!user){
          window.location.href = 'index.html?auth=required';
          return;
        }
        fillUserProfile(user);
      }
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn){
      logoutBtn.addEventListener('click', async () => {
        try{
          await auth.signOut();
        }finally{
          window.location.href = 'index.html';
        }
      });
    }

    const searchParams = new URLSearchParams(window.location.search || '');
    if(searchParams.get('auth') === 'required'){
      alert('Aby przejść dalej, zaloguj się kontem Google.');
    }
  }

  runFirebaseAuthFlow();
})();
