
export function updater(original, prop, onEdit) {
  return e => onEdit({...original, [prop]: e.target.value });
}

export function selectUpdater(original, prop, onEdit) {
  return (e, k, value) => onEdit({...original, [prop]: value});
}

export function toggle(original, prop, onEdit) {
  return () => {
    const newObj = {...original, [prop]: !original[prop]};
    onEdit(newObj);
  };
}
