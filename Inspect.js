const t = document.createElement('div');
Object.assign(t.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  background: 'rgba(0,0,0,0.7)',
  color: '#0f0',
  padding: '2px 6px',
  zIndex: '99999',
  font: '12px monospace'
});
document.body.append(t);
function m(e) {
  const x = document.elementFromPoint(e.clientX, e.clientY);
  if (!x) return;
  t.textContent = `<${x.tagName.toLowerCase()} class="${x.className}" id="${x.id}">`;
  t.style.top = e.clientY + 5 + 'px';
  t.style.left = e.clientX + 5 + 'px';
}
document.addEventListener('mousemove', m);
