// Each dialog owns its resources; callbacks from an old dialog cannot clear a new one.
export function createPlayerPanelSession(dialog,{onDispose=()=>{},onError=()=>{}}={}) {
  let disposed=false,guard=null;
  const cleanups=[];
  function own(cleanup) {
    if(typeof cleanup!=='function')return;
    if(disposed)cleanup();else cleanups.push(cleanup);
  }
  function close() {
    if(disposed)return;
    disposed=true;
    dialog.removeEventListener('cancel',onCancel);
    dialog.removeEventListener('click',onClick);
    dialog.removeEventListener('close',onClose);
    for(const cleanup of cleanups.splice(0).reverse()) {
      try{cleanup()}catch(error){onError(error)}
    }
    guard=null;
    try{if(dialog.open)dialog.close()}finally{dialog.remove();onDispose(api)}
  }
  async function prepareForUpdate() {
    if(disposed)return true;
    return guard?guard.confirm():true;
  }
  async function requestClose() {
    if(disposed)return true;
    if(!await prepareForUpdate())return false;
    if(!disposed)close();
    return true;
  }
  const onCancel=event=>{event.preventDefault();void requestClose()};
  const onClick=event=>{if(event.target===dialog)void requestClose()};
  const onClose=()=>close();
  dialog.addEventListener('cancel',onCancel);
  dialog.addEventListener('click',onClick);
  dialog.addEventListener('close',onClose);
  const api={dialog,own,close,requestClose,prepareForUpdate,
    get disposed(){return disposed},
    setGuard(value){if(guard)throw Error('弹窗已绑定草稿保护');guard=value;own(()=>value.close())},
    show(focusTarget){
      if(disposed)return false;
      try{dialog.showModal();focusTarget?.focus();return true}catch(error){close();throw error}
    },
  };
  return api;
}
