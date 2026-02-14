(function(){
    // ===== DEBUG LOGGING =====
    function debugLog(msg) {
      const el = document.getElementById('debugLogOutput');
      if (el) {
        el.textContent += `[${new Date().toLocaleTimeString()}] ${msg}\n`;
        el.scrollTop = el.scrollHeight;
      }
    }
    window.onerror = function(message, source, lineno, colno, error) {
      debugLog(`JS ERROR: ${message} (${source}:${lineno})`);
    };
  const statusEl = document.getElementById('v1OpsStatus');
  const contractsBtn = document.getElementById('v1FetchContracts');
  const inboxBtn = document.getElementById('v1FetchInbox');
  const refreshBtn = document.getElementById('v1RefreshEmails');
  const folderBtns = Array.from(document.querySelectorAll('[data-v1-folder]'));
  const listEl = document.getElementById('v1EmailList');
  const folderLabelEl = document.getElementById('v1FolderLabel');
  const selectedMetaEl = document.getElementById('v1SelectedMeta');
  const selectedBodyEl = document.getElementById('v1SelectedBody');
  const postponeInput = document.getElementById('v1PostponeUntil');

  const actionArchive = document.getElementById('v1ActionArchive');
  const actionTrash = document.getElementById('v1ActionTrash');
  const actionRestore = document.getElementById('v1ActionRestore');
  const actionForwardService = document.getElementById('v1ActionForwardService');
  const actionAutomation = document.getElementById('v1ActionAutomation');
  const actionPostpone = document.getElementById('v1ActionPostpone');

  const newSubjectEl = document.getElementById('v1NewSubject');
  const newSenderEl = document.getElementById('v1NewSender');
  const newZgEl = document.getElementById('v1NewZg');
  const newBodyEl = document.getElementById('v1NewBody');
  const createBtn = document.getElementById('v1CreateEmail');

  const serviceTasksEl = document.getElementById('v1ServiceTasks');
  const refreshServiceBtn = document.getElementById('v1RefreshServiceTasks');
  const serviceFilterBtns = Array.from(document.querySelectorAll('[data-v1-service-filter]'));

  const adminStatusEl = document.getElementById('adminOpsStatus');
  const adminRefreshBtn = document.getElementById('adminRefreshUsers');
  const adminUsersListEl = document.getElementById('adminUsersList');
  const adminSaveBtn = document.getElementById('adminSaveAccess');
  const adminClearBtn = document.getElementById('adminClearForm');
  const adminEmailEl = document.getElementById('adminUserEmail');
  const adminRoleEl = document.getElementById('adminUserRole');

  const permTicketsEl = document.getElementById('permTickets');
  const permServiceEl = document.getElementById('permService');
  const permActivationsEl = document.getElementById('permActivations');
  const permPanelOkEl = document.getElementById('permPanelOk');
  const permOfficeEl = document.getElementById('permOffice');
  const permAdminEl = document.getElementById('permAdmin');

  const testRoleStatusEl = document.getElementById('testRoleStatus');
  const testRoleResetBtn = document.getElementById('testRoleReset');
  const testRoleBtns = Array.from(document.querySelectorAll('[data-test-role]'));

  const moduleGeneralEl = document.getElementById('panelModuleGeneral');
  const moduleTicketsEl = document.getElementById('panelModuleTickets');
  const moduleAdminEl = document.getElementById('panelModuleAdmin');
  const moduleRoleTestEl = document.getElementById('panelModuleRoleTest');

  const folderNames = {
    inbox: 'Odbiorcza',
    archive: 'Archiwum',
    sent: 'Nadawcza',
    trash: 'Kosz',
    postponed: 'Odłożone'
  };

  const state = {
    folder: 'inbox',
    emails: [],
    selectedId: null,
    serviceFilter: 'ALL',
    adminUsers: [],
    currentSessionRole: 'USER',
    currentSessionEmail: '',
    realSessionRole: 'USER',
    isRoleTestMode: false,
    testRole: 'SUPERADMIN'
  };

  function isAdminRole(role){
    const normalized = String(role || '').toUpperCase();
    return normalized === 'ADMIN' || normalized === 'SUPERADMIN';
  }

  function getDefaultPermissionsByRole(role){
    const normalized = String(role || '').toUpperCase();
    if(normalized === 'SUPERADMIN' || normalized === 'ADMIN'){
      return { tickets:true, service:true, activations:true, panelOk:true, office:true, admin:true };
    }
    if(normalized === 'SERVICE'){
      return { tickets:true, service:true, activations:false, panelOk:false, office:false, admin:false };
    }
    if(normalized === 'READ'){
      return { tickets:true, service:false, activations:false, panelOk:false, office:false, admin:false };
    }
    if(normalized === 'PROVIDER_OK'){
      return { tickets:true, service:false, activations:false, panelOk:true, office:false, admin:false };
    }
    if(normalized === 'USER'){
      return { tickets:true, service:false, activations:false, panelOk:false, office:false, admin:false };
    }
    return { tickets:false, service:false, activations:false, panelOk:false, office:false, admin:false };
  }

  function setStatus(text, isError){
    if(!statusEl) return;
    statusEl.textContent = text;
    statusEl.style.color = isError ? '#ff6b6b' : '';
  }

  function setAdminStatus(text, isError){
    if(!adminStatusEl) return;
    adminStatusEl.textContent = text;
    adminStatusEl.style.color = isError ? '#ff6b6b' : '';
  }

  function getEffectivePermissions(){
    const role = state.isRoleTestMode ? state.testRole : state.realSessionRole;
    return getDefaultPermissionsByRole(role);
  }

  function setModuleVisibility(el, visible){
    if(!el) return;
    el.classList.toggle('panel-module-hidden', !visible);
    el.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  function updateRoleTestUi(){
    if(!testRoleStatusEl) return;

    const effectiveRole = state.isRoleTestMode ? state.testRole : state.realSessionRole;
    const modeLabel = state.isRoleTestMode ? `TRYB TESTOWY (${effectiveRole})` : `TRYB REALNY (${effectiveRole})`;
    testRoleStatusEl.textContent = `Tryb podglądu: ${modeLabel}`;

    testRoleBtns.forEach((btn) => {
      const role = String(btn.dataset.testRole || '').toUpperCase();
      const active = state.isRoleTestMode && role === state.testRole;
      btn.classList.toggle('is-active', active);
      btn.style.borderColor = active ? '#1a7cff' : '';
    });
  }

  function applyPanelVisibilityByPermissions(){
    const permissions = getEffectivePermissions();

    setModuleVisibility(moduleGeneralEl, true);
    setModuleVisibility(moduleTicketsEl, Boolean(permissions.tickets));
    setModuleVisibility(moduleAdminEl, Boolean(permissions.admin));
    setModuleVisibility(moduleRoleTestEl, isAdminRole(state.realSessionRole));

    updateRoleTestUi();
  }

  function getCurrentAuthEmail(){
    const fromDom = document.getElementById('authUserEmail');
    const val = String(fromDom && fromDom.textContent || '').trim().toLowerCase();
    return val.includes('@') ? val : '';
  }

  function getPermissionPayloadFromForm(){
    return {
      tickets: Boolean(permTicketsEl && permTicketsEl.checked),
      service: Boolean(permServiceEl && permServiceEl.checked),
      activations: Boolean(permActivationsEl && permActivationsEl.checked),
      panelOk: Boolean(permPanelOkEl && permPanelOkEl.checked),
      office: Boolean(permOfficeEl && permOfficeEl.checked),
      admin: Boolean(permAdminEl && permAdminEl.checked)
    };
  }

  function fillAdminFormFromUser(user){
    if(!user) return;
    if(adminEmailEl) adminEmailEl.value = String(user.email || '');
    if(adminRoleEl) adminRoleEl.value = String(user.role || 'USER');

    const p = user.permissions || {};
    if(permTicketsEl) permTicketsEl.checked = Boolean(p.tickets);
    if(permServiceEl) permServiceEl.checked = Boolean(p.service);
    if(permActivationsEl) permActivationsEl.checked = Boolean(p.activations);
    if(permPanelOkEl) permPanelOkEl.checked = Boolean(p.panelOk);
    if(permOfficeEl) permOfficeEl.checked = Boolean(p.office);
    if(permAdminEl) permAdminEl.checked = Boolean(p.admin);
  }

  function clearAdminForm(){
    if(adminEmailEl) adminEmailEl.value = '';
    if(adminRoleEl) adminRoleEl.value = 'USER';
    if(permTicketsEl) permTicketsEl.checked = true;
    if(permServiceEl) permServiceEl.checked = false;
    if(permActivationsEl) permActivationsEl.checked = false;
    if(permPanelOkEl) permPanelOkEl.checked = false;
    if(permOfficeEl) permOfficeEl.checked = false;
    if(permAdminEl) permAdminEl.checked = false;
  }

  function renderAdminUsers(){
    if(!adminUsersListEl) return;
    if(!state.adminUsers.length){
      adminUsersListEl.innerHTML = '<li class="muted">Brak użytkowników z przypisanymi rolami.</li>';
      return;
    }

    adminUsersListEl.innerHTML = state.adminUsers.map((user) => {
      const p = user.permissions || {};
      const activePerms = ['tickets','service','activations','panelOk','office','admin']
        .filter((k) => Boolean(p[k]))
        .join(', ');

      return (
        `<li><button type="button" class="v1-list-item" data-admin-email="${String(user.email || '')}">` +
        `<strong>${String(user.email || '')}</strong><br><span>Rola: ${String(user.role || 'USER')}</span>` +
        `<span class="admin-user-meta">Uprawnienia: ${activePerms || 'brak'}</span>` +
        `</button></li>`
      );
    }).join('');

    adminUsersListEl.querySelectorAll('[data-admin-email]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const email = String(btn.dataset.adminEmail || '').toLowerCase();
        const user = state.adminUsers.find((x) => String(x.email || '').toLowerCase() === email);
        fillAdminFormFromUser(user);
      });
    });
  }

  function getSelectedEmail(){
    return state.emails.find((item) => Number(item.id) === Number(state.selectedId)) || null;
  }

  function updateFolderUi(){
    if(folderLabelEl) folderLabelEl.textContent = `Folder: ${folderNames[state.folder] || state.folder}`;
    folderBtns.forEach((btn) => {
      const isActive = String(btn.dataset.v1Folder) === state.folder;
      btn.classList.toggle('is-active', isActive);
      if(isActive){
        btn.style.borderColor = '#1a7cff';
      } else {
        btn.style.borderColor = '';
      }
    });
  }

  function renderSelected(){
    const selected = getSelectedEmail();
    if(!selected){
      if(selectedMetaEl) selectedMetaEl.textContent = 'Wybierz zgłoszenie z listy.';
      if(selectedBodyEl) selectedBodyEl.value = '';
      return;
    }

    if(selectedMetaEl){
      selectedMetaEl.textContent = `ZG: ${selected.zgNumber || 'Brak'} | Nadawca: ${selected.sender || '-'} | Status: ${selected.waitingStatus || 'NORMAL'}`;
    }
    if(selectedBodyEl) selectedBodyEl.value = String(selected.body || '');
  }

  function renderEmails(){
    if(!listEl) return;
    if(!state.emails.length){
      listEl.innerHTML = '<li class="muted">Brak zgłoszeń w tym folderze.</li>';
      renderSelected();
      return;
    }

    listEl.innerHTML = state.emails.map((item) => {
      const activeClass = Number(item.id) === Number(state.selectedId) ? 'is-active' : '';
      return `
        <li>
          <button type="button" class="v1-list-item ${activeClass}" data-email-id="${item.id}">
            <strong>${item.zgNumber || 'Bez numeru ZG'}</strong><br>
            <span>${item.subject || '(brak tematu)'}</span>
          </button>
        </li>
      `;
    }).join('');

    listEl.querySelectorAll('[data-email-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.selectedId = Number(btn.dataset.emailId);
        renderEmails();
      });
    });

    renderSelected();
  }

  async function callApi(path, options){
    const merged = Object.assign({ cache: 'no-store' }, options || {});
    const headers = Object.assign({}, merged.headers || {});

    const currentEmail = state.currentSessionEmail || getCurrentAuthEmail();
    if(currentEmail && !headers['x-user-email']) headers['x-user-email'] = currentEmail;
    if(state.currentSessionRole && !headers['x-user-role']) headers['x-user-role'] = state.currentSessionRole;

    merged.headers = headers;

    const res = await fetch(path, merged);
    const json = await res.json();
    if(!res.ok || !json.ok){
      throw new Error((json && json.error) || 'Błąd API');
    }
    return json;
  }

  async function loadContracts(){
    try{
      setStatus('Ładowanie kontraktów V1...', false);
      const data = await callApi('/api/v1/contracts');
      const keys = Object.keys((data && data.contracts) || {});
      setStatus(`Kontrakty gotowe: ${keys.join(', ')}`, false);
    }catch(err){
      setStatus(`Błąd kontraktów: ${err.message}`, true);
    }
  }

  async function loadInbox(){
    try{
      await loadEmails('inbox');
    }catch(err){
      setStatus(`Błąd Odbiorczej: ${err.message}`, true);
    }
  }

  async function loadEmails(folder){
    const nextFolder = folder || state.folder;
    state.folder = nextFolder;
    updateFolderUi();

    try{
      setStatus(`Ładowanie folderu ${folderNames[nextFolder] || nextFolder}...`, false);
      const data = await callApi(`/api/v1/emails?folder=${encodeURIComponent(nextFolder)}`);
      state.emails = Array.isArray(data.data) ? data.data : [];

      const stillExists = state.emails.some((x) => Number(x.id) === Number(state.selectedId));
      if(!stillExists){
        state.selectedId = state.emails[0] ? Number(state.emails[0].id) : null;
      }

      renderEmails();
      setStatus(`Załadowano ${state.emails.length} zgłoszeń (${folderNames[nextFolder] || nextFolder}).`, false);
    }catch(err){
      setStatus(`Błąd ładowania zgłoszeń: ${err.message}`, true);
    }
  }

  async function applyAction(action, extraBody){
    const selected = getSelectedEmail();
    if(!selected){
      setStatus('Najpierw wybierz zgłoszenie.', true);
      return;
    }

    try{
      const payload = Object.assign({ action }, extraBody || {});
      await callApi(`/api/v1/emails/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      await loadEmails(state.folder);
    }catch(err){
      setStatus(`Błąd akcji ${action}: ${err.message}`, true);
    }
  }

  async function forwardToService(){
    const selected = getSelectedEmail();
    if(!selected){
      setStatus('Najpierw wybierz zgłoszenie.', true);
      return;
    }

    try{
      await callApi('/api/v1/service/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailId: selected.id })
      });
      await loadServiceTasks();
      setStatus('Utworzono zlecenie serwisowe.', false);
    }catch(err){
      setStatus(`Błąd przekazania do serwisu: ${err.message}`, true);
    }
  }

  async function runAutomation(){
    const selected = getSelectedEmail();
    if(!selected){
      setStatus('Najpierw wybierz zgłoszenie.', true);
      return;
    }
    if(!selected.zgNumber){
      setStatus('Wybrane zgłoszenie nie ma numeru ZG.', true);
      return;
    }

    try{
      await callApi('/api/v1/automation/perform-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monterEmailId: selected.id,
          targetZgNumber: selected.zgNumber,
          sourceBody: selected.body || ''
        })
      });
      await loadEmails('archive');
      setStatus(`Automatyka OPL wykonana dla ${selected.zgNumber}.`, false);
    }catch(err){
      setStatus(`Błąd automatyki OPL: ${err.message}`, true);
    }
  }

  async function createEmail(){
    const subject = String(newSubjectEl && newSubjectEl.value || '').trim();
    const sender = String(newSenderEl && newSenderEl.value || '').trim();
    const body = String(newBodyEl && newBodyEl.value || '').trim();
    const zgNumber = String(newZgEl && newZgEl.value || '').trim();

    if(!subject || !sender || !body){
      setStatus('Uzupełnij: temat, nadawca i treść.', true);
      return;
    }

    try{
      await callApi('/api/v1/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, sender, body, zgNumber, folder: 'inbox' })
      });

      if(newSubjectEl) newSubjectEl.value = '';
      if(newSenderEl) newSenderEl.value = '';
      if(newBodyEl) newBodyEl.value = '';
      if(newZgEl) newZgEl.value = '';

      await loadEmails('inbox');
      setStatus('Utworzono nowe zgłoszenie.', false);
    }catch(err){
      setStatus(`Błąd tworzenia zgłoszenia: ${err.message}`, true);
    }
  }

  async function loadServiceTasks(){
    if(!serviceTasksEl) return;
    try{
      const query = state.serviceFilter && state.serviceFilter !== 'ALL'
        ? `?status=${encodeURIComponent(state.serviceFilter)}`
        : '';
      const data = await callApi(`/api/v1/service/tasks${query}`);
      const rows = Array.isArray(data.data) ? data.data : [];
      if(!rows.length){
        serviceTasksEl.innerHTML = '<li class="muted">Brak zadań serwisowych.</li>';
        return;
      }
      serviceTasksEl.innerHTML = rows.map((task) => (
        `<li><div class="v1-list-item">` +
        `<strong>${task.zgNumber || 'Brak ZG'}</strong><br><span>Status: ${task.status}</span>` +
        `<div class="v1-list-actions">` +
        `<button type="button" class="v1-mini-btn ${task.status === 'NEW' ? 'is-active' : ''}" data-task-id="${task.id}" data-task-status="NEW">NEW</button>` +
        `<button type="button" class="v1-mini-btn ${task.status === 'IN_PROGRESS' ? 'is-active' : ''}" data-task-id="${task.id}" data-task-status="IN_PROGRESS">IN_PROGRESS</button>` +
        `<button type="button" class="v1-mini-btn ${task.status === 'DONE' ? 'is-active' : ''}" data-task-id="${task.id}" data-task-status="DONE">DONE</button>` +
        `</div></div></li>`
      )).join('');

      serviceTasksEl.querySelectorAll('[data-task-id][data-task-status]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const id = Number(btn.dataset.taskId);
          const status = String(btn.dataset.taskStatus || '').toUpperCase();
          if(!id || !status) return;
          try{
            await callApi(`/api/v1/service/tasks/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status })
            });
            setStatus(`Zmieniono status zadania #${id} na ${status}.`, false);
            await loadServiceTasks();
          }catch(err){
            setStatus(`Błąd zmiany statusu zadania: ${err.message}`, true);
          }
        });
      });
    }catch(err){
      serviceTasksEl.innerHTML = `<li class="muted">Błąd kolejki: ${err.message}</li>`;
    }
  }

  async function loadAdminUsers(){
    if(!adminUsersListEl) return;
    try{
      setAdminStatus('Ładowanie listy ról i uprawnień...', false);
      const data = await callApi('/api/v1/admin/access-users');
      state.adminUsers = Array.isArray(data.data) ? data.data : [];

      const currentEmail = (state.currentSessionEmail || getCurrentAuthEmail() || '').toLowerCase();
      const me = state.adminUsers.find((u) => String(u.email || '').toLowerCase() === currentEmail);
      if(me && me.role){
        state.realSessionRole = String(me.role).toUpperCase();
        if(!state.isRoleTestMode){
          state.currentSessionRole = state.realSessionRole;
        }
      }

      renderAdminUsers();
      applyPanelVisibilityByPermissions();
      setAdminStatus(`Załadowano ${state.adminUsers.length} użytkowników.`, false);
    }catch(err){
      setAdminStatus(`Błąd listy admin: ${err.message}`, true);
      if(adminUsersListEl){
        adminUsersListEl.innerHTML = '<li class="muted">Brak dostępu do listy administracyjnej.</li>';
      }
    }
  }

  async function saveAdminAccess(){
    const email = String(adminEmailEl && adminEmailEl.value || '').trim().toLowerCase();
    const role = String(adminRoleEl && adminRoleEl.value || '').trim().toUpperCase();
    if(!email){
      setAdminStatus('Podaj email użytkownika.', true);
      return;
    }

    try{
      await callApi('/api/v1/admin/access-users/upsert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, permissions: getPermissionPayloadFromForm() })
      });
      setAdminStatus(`Zapisano role/uprawnienia dla ${email}.`, false);
      await loadAdminUsers();
    }catch(err){
      setAdminStatus(`Błąd zapisu uprawnień: ${err.message}`, true);
    }
  }

  if(contractsBtn) contractsBtn.addEventListener('click', loadContracts);
  if(inboxBtn) inboxBtn.addEventListener('click', loadInbox);

  if(refreshBtn) refreshBtn.addEventListener('click', () => loadEmails(state.folder));
  folderBtns.forEach((btn) => {
    btn.addEventListener('click', () => loadEmails(String(btn.dataset.v1Folder || 'inbox')));
  });

  if(actionArchive) actionArchive.addEventListener('click', () => applyAction('archive'));
  if(actionTrash) actionTrash.addEventListener('click', () => applyAction('trash'));
  if(actionRestore) actionRestore.addEventListener('click', () => applyAction('restore'));
  if(actionForwardService) actionForwardService.addEventListener('click', forwardToService);
  if(actionAutomation) actionAutomation.addEventListener('click', runAutomation);
  if(actionPostpone) actionPostpone.addEventListener('click', () => applyAction('postpone', { postponedUntil: postponeInput && postponeInput.value ? postponeInput.value : null }));

  if(createBtn) createBtn.addEventListener('click', createEmail);
  if(refreshServiceBtn) refreshServiceBtn.addEventListener('click', loadServiceTasks);
  serviceFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      state.serviceFilter = String(btn.dataset.v1ServiceFilter || 'ALL').toUpperCase();
      serviceFilterBtns.forEach((other) => {
        const isActive = other === btn;
        other.classList.toggle('is-active', isActive);
        if(isActive){
          other.style.borderColor = '#1a7cff';
        } else {
          other.style.borderColor = '';
        }
      });
      loadServiceTasks();
    });
  });

  if(adminRefreshBtn) adminRefreshBtn.addEventListener('click', loadAdminUsers);
  if(adminSaveBtn) adminSaveBtn.addEventListener('click', saveAdminAccess);
  if(adminClearBtn) adminClearBtn.addEventListener('click', clearAdminForm);

  testRoleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const role = String(btn.dataset.testRole || '').toUpperCase();
      if(!role) return;
      state.isRoleTestMode = true;
      state.testRole = role;
      state.currentSessionRole = role;
      applyPanelVisibilityByPermissions();
      setStatus(`Tryb testowy aktywny: ${role}`, false);
    });
  });

  if(testRoleResetBtn){
    testRoleResetBtn.addEventListener('click', () => {
      state.isRoleTestMode = false;
      state.testRole = 'SUPERADMIN';
      state.currentSessionRole = 'SUPERADMIN';
      state.realSessionRole = 'SUPERADMIN';
      applyPanelVisibilityByPermissions();
      setStatus('Powrót do podglądu SUPERADMIN.', false);
    });
  }

  state.currentSessionEmail = getCurrentAuthEmail();
  state.currentSessionRole = 'SUPERADMIN';
  state.realSessionRole = 'SUPERADMIN';

  updateFolderUi();
  clearAdminForm();
  applyPanelVisibilityByPermissions();
  loadEmails('inbox');
  loadServiceTasks();
  loadAdminUsers();
})();
