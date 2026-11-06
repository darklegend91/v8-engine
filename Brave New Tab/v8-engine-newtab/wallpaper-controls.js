(() => {
  const viewButton = document.getElementById('wallpaper-controls');
  const holdButton = document.getElementById('wallpaper-hold');
  const rail = document.getElementById('shortcut-rail');
  const panel = document.getElementById('utility-panel');
  const searchInput = document.getElementById('web-search');
  const shortcuts = document.querySelectorAll('.shortcut');
  const editor = document.getElementById('shortcut-editor');
  const clockTime = document.getElementById('clock-time');
  const clockDate = document.getElementById('clock-date');
  const panelDate = document.getElementById('panel-date');
  const saveStatus = document.getElementById('save-status');
  const STORAGE_KEY = 'v8-newtab-shortcuts-v1';
  const DEFAULTS = [
    {id:'authentic',name:'Authentic…',url:''},
    {id:'internal',name:'500 Inter…',url:''},
    {id:'chatgpt',name:'ChatGPT',url:'https://chatgpt.com/'},
    {id:'chat',name:'Chat',url:'https://chat.google.com/'},
    {id:'linear',name:'Linear',url:'https://linear.app/'},
    {id:'github',name:'GitHub',url:'https://github.com/'},
    {id:'youtube',name:'YouTube',url:'https://www.youtube.com/'}
  ];
  let held = false;
  let items = loadItems();
  function loadItems(){
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (Array.isArray(saved) && saved.length === DEFAULTS.length) return DEFAULTS.map((item) => ({...item,...saved.find((entry) => entry.id === item.id)}));
    } catch {}
    return DEFAULTS.map((item) => ({...item}));
  }
  const saveItems = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  const syncView = () => {
    const clean = document.body.classList.contains('wallpaper-mode');
    viewButton.textContent = clean ? 'SHOW ENGINE CONTROLS' : 'RETURN TO WALLPAPER';
    viewButton.setAttribute('aria-pressed', String(!clean));
  };
  const syncHold = () => {
    holdButton.textContent = held ? 'RESUME CAMERA' : 'HOLD VIEW';
    holdButton.setAttribute('aria-pressed', String(held));
  };
  const updateClock = () => {
    const now = new Date();
    clockTime.textContent = new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit'}).format(now);
    const date = new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric'}).format(now);
    clockDate.textContent = date;
    panelDate.textContent = new Intl.DateTimeFormat(undefined,{weekday:'long',month:'long',day:'numeric',year:'numeric'}).format(now);
  };
  const openPanel = (focus='search', itemId='') => {
    panel.hidden = false;
    document.getElementById('utility-title').textContent = focus === 'edit' ? 'Your shortcuts' : 'Search the web';
    if (focus === 'edit' && itemId) requestAnimationFrame(() => editor.querySelector(`[data-row="${itemId}"] input[name="url"]`)?.focus());
    else if (focus === 'search') requestAnimationFrame(() => searchInput.focus());
  };
  const normalizeUrl = (value) => {
    let text = value.trim();
    if (!text) return '';
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(text)) text = `https://${text}`;
    try { const url = new URL(text); return ['https:','http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };
  const launch = (item) => {
    if (!item.url) { openPanel('edit', item.id); return; }
    const url = normalizeUrl(item.url);
    if (url) window.open(url, '_blank', 'noopener');
  };
  function renderShortcuts(){
    for (const link of shortcuts) {
      const item = items.find((entry) => entry.id === link.dataset.id);
      if (!item) continue;
      link.setAttribute('aria-label', item.name);
      link.title = item.url ? `Open ${item.name}` : `Set a link for ${item.name}`;
      link.classList.toggle('needs-url', !item.url);
      link.onclick = (event) => { event.preventDefault(); launch(item); };
    }
  }
  function renderEditor(){
    editor.replaceChildren();
    for (const item of items) {
      const row = document.createElement('div');
      row.className = 'editor-row';
      row.dataset.row = item.id;
      const name = document.createElement('input');
      name.name = 'name'; name.value = item.name; name.setAttribute('aria-label', `${item.name} shortcut name`); name.maxLength = 28;
      const url = document.createElement('input');
      url.name = 'url'; url.value = item.url; url.type = 'url'; url.placeholder = 'https://…'; url.setAttribute('aria-label', `${item.name} shortcut URL`);
      row.append(name,url); editor.append(row);
    }
  }
  const closePanel = () => { panel.hidden = true; };
  const stopBubble = (event) => event.stopPropagation();
  for (const button of [viewButton,holdButton,...rail.querySelectorAll('button'),document.getElementById('utility-clock'),document.getElementById('close-utility'),document.getElementById('save-shortcuts'),document.getElementById('edit-shortcuts')]) button.addEventListener('pointerdown',stopBubble);
  panel.addEventListener('pointerdown',stopBubble);
  viewButton.addEventListener('click',(event)=>{event.stopPropagation();document.body.classList.toggle('wallpaper-mode');syncView();});
  holdButton.addEventListener('click',(event)=>{event.stopPropagation();held=!held;window.__V8_WALLPAPER_HELD=held;window.dispatchEvent(new CustomEvent('v8-wallpaper-hold',{detail:{held}}));syncHold();});
  window.addEventListener('v8-wallpaper-hold-state',(event)=>{held=!!event.detail?.held;window.__V8_WALLPAPER_HELD=held;syncHold();});
  document.getElementById('open-search').addEventListener('click',()=>openPanel('search'));
  document.getElementById('open-manager').addEventListener('click',()=>openPanel('edit'));
  document.getElementById('utility-clock').addEventListener('click',()=>openPanel('search'));
  document.getElementById('close-utility').addEventListener('click',closePanel);
  document.getElementById('edit-shortcuts').addEventListener('click',()=>openPanel('edit'));
  document.getElementById('search-form').addEventListener('submit',(event)=>{
    event.preventDefault();
    const query=searchInput.value.trim();
    if (!query) return;
    const direct=normalizeUrl(query);
    const looksLikeDomain=/^[^\s.]+(?:\.[^\s.]+)+(?:\/.*)?$/.test(query);
    const target=direct && (/^https?:\/\//i.test(query) || looksLikeDomain) ? direct : `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    window.open(target,'_blank','noopener');
    searchInput.value=''; closePanel();
  });
  document.getElementById('save-shortcuts').addEventListener('click',()=>{
    const next=[];
    for(const item of items){
      const row=editor.querySelector(`[data-row="${item.id}"]`);
      const name=row.querySelector('[name="name"]').value.trim() || item.name;
      const raw=row.querySelector('[name="url"]').value.trim();
      const url=normalizeUrl(raw);
      if(raw && !url){saveStatus.textContent=`Check the URL for ${name}.`;return;}
      next.push({...item,name,url});
    }
    items=next; saveItems(); renderShortcuts(); renderEditor(); saveStatus.textContent='Saved on this device.';
  });
  window.addEventListener('keydown',(event)=>{
    if(event.key==='Escape' && !panel.hidden){closePanel();return;}
    if(event.key==='/' && !(event.target instanceof HTMLElement && event.target.matches('input,textarea,select,[contenteditable="true"]'))){event.preventDefault();openPanel('search');}
  });
  updateClock(); setInterval(updateClock,15000);
  renderShortcuts(); renderEditor(); syncView(); syncHold();
})();
