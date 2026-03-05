// ─── STATE ───────────────────────────────────────────────
let books = [
  { id: 1, titulo: 'Dom Quixote',           autor: 'Cervantes',      ano: 1605, genero: 'Aventura', emprestado: false },
  { id: 2, titulo: 'Grande Sertão: Veredas', autor: 'Guimarães Rosa', ano: 1956, genero: 'Romance',  emprestado: true,  tomador: 'João Silva', devolucao: '2026-03-20' },
  { id: 3, titulo: 'O Alquimista',           autor: 'Paulo Coelho',   ano: 1988, genero: 'Ficção',   emprestado: false },
];
let nextId      = 4;
let selectedBook = null;

// ─── TABS ────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'emprestimos') renderLoans();
  });
});

// ─── TOAST ───────────────────────────────────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── MODALS ──────────────────────────────────────────────
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
});

// ─── ADICIONAR ───────────────────────────────────────────
document.getElementById('btn-adicionar').addEventListener('click', () => {
  document.getElementById('add-titulo').value = '';
  document.getElementById('add-autor').value  = '';
  document.getElementById('add-ano').value    = '';
  document.getElementById('add-genero').value = '';
  openModal('modal-adicionar');
});

document.getElementById('confirm-adicionar').addEventListener('click', () => {
  const titulo = document.getElementById('add-titulo').value.trim();
  const autor  = document.getElementById('add-autor').value.trim();
  const ano    = document.getElementById('add-ano').value.trim();
  const genero = document.getElementById('add-genero').value.trim();

  if (!titulo) {
    document.getElementById('add-titulo').focus();
    return;
  }

  books.push({ id: nextId++, titulo, autor, ano, genero, emprestado: false });
  closeModal('modal-adicionar');
  showToast('📚 Livro "' + titulo + '" adicionado!');
});

// ─── EDITAR (seleção) ─────────────────────────────────────
document.getElementById('btn-editar').addEventListener('click', () => {
  const list = document.getElementById('list-editar');
  list.innerHTML = '';

  if (!books.length) {
    list.innerHTML = '<p style="color:#9ca3af;font-size:14px">Nenhum livro no acervo.</p>';
  } else {
    books.forEach(b => {
      const item = createBookItem(b, () => {
        selectedBook = b;
        closeModal('modal-editar-lista');
        document.getElementById('edit-titulo').value = b.titulo;
        document.getElementById('edit-autor').value  = b.autor;
        document.getElementById('edit-ano').value    = b.ano;
        document.getElementById('edit-genero').value = b.genero;
        openModal('modal-editar-form');
      });
      list.appendChild(item);
    });
  }

  openModal('modal-editar-lista');
});

// ─── EDITAR (formulário) ──────────────────────────────────
document.getElementById('confirm-editar').addEventListener('click', () => {
  if (!selectedBook) return;

  selectedBook.titulo = document.getElementById('edit-titulo').value.trim() || selectedBook.titulo;
  selectedBook.autor  = document.getElementById('edit-autor').value.trim()  || selectedBook.autor;
  selectedBook.ano    = document.getElementById('edit-ano').value.trim()    || selectedBook.ano;
  selectedBook.genero = document.getElementById('edit-genero').value.trim() || selectedBook.genero;

  closeModal('modal-editar-form');
  showToast('✏️ Livro atualizado com sucesso!');
  selectedBook = null;
});

// ─── REMOVER ─────────────────────────────────────────────
document.getElementById('btn-remover').addEventListener('click', () => {
  selectedBook = null;
  const list = document.getElementById('list-remover');
  list.innerHTML = '';

  if (!books.length) {
    list.innerHTML = '<p style="color:#9ca3af;font-size:14px">Nenhum livro no acervo.</p>';
  } else {
    books.forEach(b => {
      const item = createBookItem(b, () => {
        document.querySelectorAll('#list-remover .book-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
        selectedBook = b;
      });
      list.appendChild(item);
    });
  }

  openModal('modal-remover');
});

document.getElementById('confirm-remover').addEventListener('click', () => {
  if (!selectedBook) return;

  const nome = selectedBook.titulo;
  books = books.filter(b => b.id !== selectedBook.id);
  closeModal('modal-remover');
  showToast('🗑️ Livro "' + nome + '" removido!');
  selectedBook = null;
});

// ─── EMPRÉSTIMOS ──────────────────────────────────────────
function renderLoans() {
  const container  = document.getElementById('loans-container');
  const emprestados = books.filter(b => b.emprestado);

  if (!emprestados.length) {
    container.innerHTML = '<div class="empty-state">Nenhum empréstimo ativo no momento.</div>';
    return;
  }

  const rows = emprestados.map(b => `
    <tr>
      <td>${b.titulo}</td>
      <td>${b.autor}</td>
      <td>${b.tomador  || '—'}</td>
      <td>${b.devolucao || '—'}</td>
      <td><span class="badge badge-yellow">Emprestado</span></td>
    </tr>
  `).join('');

  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Livro</th>
          <th>Autor</th>
          <th>Tomador</th>
          <th>Devolução</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ─── HELPERS ─────────────────────────────────────────────
function createBookItem(book, onClick) {
  const item = document.createElement('div');
  item.className = 'book-item';
  item.innerHTML = `
    <span><strong>${book.titulo}</strong> — ${book.autor}</span>
    <span class="book-item-year">${book.ano}</span>
  `;
  item.addEventListener('click', onClick);
  return item;
}