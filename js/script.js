const searchInput = document.getElementById("search");
const produtosContainer = document.getElementById("produtos");
let listaProdutos = [];

// Função debounce para suavizar a busca
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Modal
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const modalNome = document.getElementById("modal-nome");
const modalDescricao = document.getElementById("modal-descricao");
const modalVolume = document.getElementById("modal-volume");
const modalUva = document.getElementById("modal-uva");
const modalTeor = document.getElementById("modal-teor");
const modalRegiao = document.getElementById("modal-regiao");
const closeModal = document.getElementById("close");

// Carregar produtos do JSON
async function carregarProdutos() {
  try {
    const resposta = await fetch("data/produto.json");
    listaProdutos = await resposta.json();
    exibirProdutos(listaProdutos);
  } catch (erro) {
    console.error("Erro ao carregar JSON:", erro);
    produtosContainer.innerHTML = "<p>Não foi possível carregar os produtos.</p>";
  }
}

// Exibir produtos no HTML
function exibirProdutos(produtos) {
  produtosContainer.innerHTML = "";
  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h2>${produto.nome}</h2>
      <p>${produto.descricao}</p>
    `;
    // Abrir modal ao clicar
    card.addEventListener("click", () => abrirModal(produto));
    produtosContainer.appendChild(card);
  });
}

// Abrir modal
function abrirModal(produto) {
  modal.classList.add("show");
  modalImg.src = produto.imagem;
  modalNome.textContent = produto.nome;
  modalDescricao.textContent = produto.descricao;
  modalVolume.textContent = produto.volume;
  modalUva.textContent = produto.uva;
  modalTeor.textContent = produto.teor_alcoolico;
  modalRegiao.textContent = produto.regiao;
}

// Fechar modal
closeModal.onclick = () => { modal.classList.remove("show"); }
window.onclick = (event) => { if(event.target == modal) modal.classList.remove("show"); }

// Busca em tempo real com debounce
const buscarProdutos = () => {
  const termo = searchInput.value.toLowerCase();
  const filtrados = listaProdutos.filter(produto =>
    produto.nome.toLowerCase().includes(termo) ||
    produto.descricao.toLowerCase().includes(termo)
  );
  exibirProdutos(filtrados);
};

// Listener com debounce (300ms)
searchInput.addEventListener("keyup", debounce(buscarProdutos, 600));

// Carregar produtos ao iniciar
carregarProdutos();
