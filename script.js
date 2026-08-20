// Credenciais ADM
const EMAIL_ADM_CORRETO = "admin@email.com";

// Estado da Aplicação
let ehAdmin = false;
let categoriaAtiva = "Todas";
let buscaTexto = "";

// 10 Posts Padrão
const POSTS_INICIAIS = [
  {
    id: 1,
    titulo: "Como organizei meu primeiro código semântico",
    categoria: "HTML & CSS",
    data: "05 de Agosto de 2026",
    resumo: "Aprender a usar as tags corretas como header, main e footer mudou completamente a estrutura dos meus projetos web.",
    imagem: "https://picsum.photos/id/1/800/400",
    curtidas: 15
  },
  {
    id: 2,
    titulo: "Minha rotina de estudos em JavaScript",
    categoria: "JavaScript",
    data: "03 de Agosto de 2026",
    resumo: "Conciliar escola e programação não é fácil. Veja como divido meu tempo para praticar código todos os dias.",
    imagem: "https://picsum.photos/id/180/800/400",
    curtidas: 24
  },
  {
    id: 3,
    titulo: "Dominando o VS Code: Atalhos que salvam tempo",
    categoria: "Dicas de Estudo",
    data: "01 de Agosto de 2026",
    resumo: "Confira uma lista dos melhores atalhos e extensões para turbinar sua produtividade criando sites.",
    imagem: "https://picsum.photos/id/60/800/400",
    curtidas: 18
  },
  {
    id: 4,
    titulo: "Flexbox vs CSS Grid: Quando usar cada um?",
    categoria: "HTML & CSS",
    data: "28 de Julho de 2026",
    resumo: "Entenda de forma simples a diferença entre layouts unidimensionais e bidimensionais no CSS moderno.",
    imagem: "https://picsum.photos/id/119/800/400",
    curtidas: 30
  },
  {
    id: 5,
    titulo: "Entendendo Promises e Async/Await no JS",
    categoria: "JavaScript",
    data: "25 de Julho de 2026",
    resumo: "Aprenda a lidar com requisições assíncronas em JavaScript sem se perder no famoso Callback Hell.",
    imagem: "https://picsum.photos/id/96/800/400",
    curtidas: 42
  },
  {
    id: 6,
    titulo: "Como criar seu primeiro repositório no GitHub",
    categoria: "Dicas de Estudo",
    data: "20 de Julho de 2026",
    resumo: "Guia passo a passo para versionar seus projetos com Git e subir tudo para o seu perfil no GitHub.",
    imagem: "https://picsum.photos/id/3/800/400",
    curtidas: 19
  },
  {
    id: 7,
    titulo: "Criando temas Dark Mode com Variáveis CSS",
    categoria: "HTML & CSS",
    data: "15 de Julho de 2026",
    resumo: "Veja como alterar as cores de todo o seu site usando apenas variáveis nativas do CSS e poucas linhas de JS.",
    imagem: "https://picsum.photos/id/48/800/400",
    curtidas: 37
  },
  {
    id: 8,
    titulo: "Manipulação de DOM na prática sem Frameworks",
    categoria: "JavaScript",
    data: "10 de Julho de 2026",
    resumo: "Como selecionar elementos, criar tags e escutar eventos usando apenas JavaScript puro (Vanilla JS).",
    imagem: "https://picsum.photos/id/201/800/400",
    curtidas: 11
  },
  {
    id: 9,
    titulo: "Dicas para não desanimar aprendendo a programar",
    categoria: "Dicas de Estudo",
    data: "05 de Julho de 2026",
    resumo: "Lidar com erros no terminal faz parte da rotina. Veja estratégias para superar a síndrome do impostor.",
    imagem: "https://picsum.photos/id/367/800/400",
    curtidas: 50
  },
  {
    id: 10,
    titulo: "O que aprendi criando meu próprio blog do zero",
    categoria: "Geral",
    data: "01 de Julho de 2026",
    resumo: "Construir uma aplicação real ensina muito mais do que apenas assistir aulas teóricas. Confira minha experiência!",
    imagem: "https://picsum.photos/id/160/800/400",
    curtidas: 63
  }
];

// Memória temporária de segurança
let postsMemoria = [...POSTS_INICIAIS];

// Leitura Segura de Posts
function obterPosts() {
  try {
    const dados = localStorage.getItem('devblog_posts_v2');
    if (!dados) {
      localStorage.setItem('devblog_posts_v2', JSON.stringify(POSTS_INICIAIS));
      return POSTS_INICIAIS;
    }
    const posts = JSON.parse(dados);
    return (Array.isArray(posts) && posts.length > 0) ? posts : POSTS_INICIAIS;
  } catch (e) {
    console.warn("LocalStorage bloqueado ou indisponível. Usando posts em memória:", e);
    return postsMemoria;
  }
}

// Salvar Posts
function salvarPosts(posts) {
  postsMemoria = posts;
  try {
    localStorage.setItem('devblog_posts_v2', JSON.stringify(posts));
  } catch (e) {
    console.warn("Não foi possível salvar no LocalStorage:", e);
  }
}

// Inicialização da Página
document.addEventListener('DOMContentLoaded', () => {
  carregarTemaSalvo();
  configurarEventos();
  renderizarPosts();
});

// Renderizar Posts na Tela
function renderizarPosts() {
  const containerPosts = document.getElementById('container-posts');
  if (!containerPosts) return;

  const posts = obterPosts();
  containerPosts.innerHTML = "";

  const postsFiltrados = posts.filter(post => {
    const bateuCategoria = (categoriaAtiva === "Todas") || (post.categoria === categoriaAtiva);
    const bateuBusca = post.titulo.toLowerCase().includes(buscaTexto) || post.resumo.toLowerCase().includes(buscaTexto);
    return bateuCategoria && bateuBusca;
  });

  if (postsFiltrados.length === 0) {
    containerPosts.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 40px 0;">Nenhum artigo encontrado.</p>`;
    return;
  }

  postsFiltrados.forEach(post => {
    const postElement = document.createElement('article');
    postElement.classList.add('post');

    postElement.innerHTML = `
      <img src="${post.imagem}" alt="${post.titulo}" class="post-img">
      <div class="post-conteudo">
        <div class="post-header-meta">
          <span class="categoria">${post.categoria}</span>
          <span class="data">${post.data}</span>
        </div>
        <h2>${post.titulo}</h2>
        <p class="resumo">${post.resumo}</p>
        <div class="post-rodape-acoes">
          <button class="btn-curtir" onclick="curtirPost(${post.id})">
            ❤️ <span>${post.curtidas || 0}</span> Curtidas
          </button>
          ${ehAdmin ? `<button class="btn-excluir" onclick="excluirPost(${post.id})">🗑️ Excluir</button>` : ''}
        </div>
      </div>
    `;

    containerPosts.appendChild(postElement);
  });
}

// Configuração de Eventos
function configurarEventos() {
  const modalLogin = document.getElementById('modal-login');
  const modalPost = document.getElementById('modal-post');
  const areaAdm = document.getElementById('area-adm');
  const inputBusca = document.getElementById('input-busca');
  const btnTema = document.getElementById('btn-tema');

  document.getElementById('btn-login-modal')?.addEventListener('click', () => modalLogin?.classList.remove('escondido'));
  document.getElementById('btn-fechar-login')?.addEventListener('click', () => modalLogin?.classList.add('escondido'));
  document.getElementById('btn-abrir-postador')?.addEventListener('click', () => modalPost?.classList.remove('escondido'));
  document.getElementById('btn-fechar-post')?.addEventListener('click', () => modalPost?.classList.add('escondido'));

  document.getElementById('logo-home')?.addEventListener('click', resetarFiltros);
  document.getElementById('link-home')?.addEventListener('click', (e) => { e.preventDefault(); resetarFiltros(); });

  document.getElementById('form-login')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    if (email.toLowerCase() === EMAIL_ADM_CORRETO) {
      ehAdmin = true;
      areaAdm?.classList.remove('escondido');
      modalLogin?.classList.add('escondido');
      document.getElementById('item-login')?.classList.add('escondido');
      renderizarPosts();
      alert("Acesso liberado como Administrador!");
    } else {
      alert("E-mail incorreto! Use: admin@email.com");
    }
  });

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    ehAdmin = false;
    areaAdm?.classList.add('escondido');
    document.getElementById('item-login')?.classList.remove('escondido');
    renderizarPosts();
    alert("Você saiu do painel administrativo.");
  });

  document.getElementById('form-novo-post')?.addEventListener('submit', criarNovoPost);

  inputBusca?.addEventListener('input', (e) => {
    buscaTexto = e.target.value.toLowerCase();
    renderizarPosts();
  });

  document.querySelectorAll('.cat-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('ativa'));
      item.classList.add('ativa');
      categoriaAtiva = item.getAttribute('data-categoria') || "Todas";
      renderizarPosts();
    });
  });

  btnTema?.addEventListener('click', alternarTema);
}

function resetarFiltros() {
  buscaTexto = "";
  categoriaAtiva = "Todas";
  const inputBusca = document.getElementById('input-busca');
  if (inputBusca) inputBusca.value = "";
  document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('ativa'));
  document.querySelector('[data-categoria="Todas"]')?.classList.add('ativa');
  renderizarPosts();
}

function criarNovoPost(e) {
  e.preventDefault();
  const titulo = document.getElementById('post-titulo').value;
  const categoria = document.getElementById('post-categoria').value;
  const resumo = document.getElementById('post-resumo').value;
  const arquivoImagem = document.getElementById('post-imagem').files[0];
  const dataAtual = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const guardar = (urlImg) => {
    const posts = obterPosts();
    const novoPost = {
      id: Date.now(),
      titulo,
      categoria,
      resumo,
      data: `Postado em ${dataAtual}`,
      imagem: urlImg || `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/800/400`,
      curtidas: 0
    };
    posts.unshift(novoPost);
    salvarPosts(posts);
    renderizarPosts();
    document.getElementById('form-novo-post').reset();
    document.getElementById('modal-post').classList.add('escondido');
  };

  if (arquivoImagem) {
    const leitor = new FileReader();
    leitor.onload = (evento) => guardar(evento.target.result);
    leitor.readAsDataURL(arquivoImagem);
  } else {
    guardar(null);
  }
}

// Funções Globais para Botões da Tela
window.curtirPost = function(id) {
  const posts = obterPosts();
  const post = posts.find(p => p.id === id);
  if (post) {
    post.curtidas = (post.curtidas || 0) + 1;
    salvarPosts(posts);
    renderizarPosts();
  }
};

window.excluirPost = function(id) {
  if (confirm("Tem certeza que deseja excluir este artigo?")) {
    let posts = obterPosts();
    posts = posts.filter(p => p.id !== id);
    salvarPosts(posts);
    renderizarPosts();
  }
};

function alternarTema() {
  document.body.classList.toggle('dark-mode');
  const ehDark = document.body.classList.contains('dark-mode');
  const btnTema = document.getElementById('btn-tema');
  if (btnTema) btnTema.textContent = ehDark ? "☀️" : "🌙";
  try { localStorage.setItem('devblog_tema', ehDark ? 'dark' : 'light'); } catch(e){}
}

function carregarTemaSalvo() {
  try {
    const temaSalvo = localStorage.getItem('devblog_tema');
    if (temaSalvo === 'dark') {
      document.body.classList.add('dark-mode');
      const btnTema = document.getElementById('btn-tema');
      if (btnTema) btnTema.textContent = "☀️";
    }
  } catch(e){}
}