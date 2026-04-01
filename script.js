// Aguarda o DOM estar completamente carregado antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 1. SELEÇÃO DE ELEMENTOS (HTML) ==========
    
    // Elementos do formulário (entrada de dados)
    const formPost = document.getElementById('form-create-post');
    const inputTitulo = document.getElementById('input-titulo');
    const inputConteudo = document.getElementById('input-conteudo');

    // Elementos de renderização (saída do post criado)
    const renderizadorTitulo = document.getElementById('renderizador-titulo');
    const renderizadorConteudo = document.getElementById('renderizador-conteudo');

    // Elementos para os posts existentes (API GET)
    const postsContainer = document.getElementById('postsContainer');

    // ========== 2. FUNÇÃO PARA RENDERIZAR OS POSTS EXISTENTES (GET) ==========
    async function fetchExistingPosts() {
        try {
            // Mostra loader enquanto carrega
            postsContainer.innerHTML = `
                <div class="loader">
                    <div class="spinner"></div>
                    <span>Carregando artigos da API...</span>
                </div>
            `;

            // Faz a requisição GET para a API
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Formato inválido');
            }

            // Mostra apenas os primeiros 10 posts
            const postsToShow = data.slice(0, 10);
            
            // Gera o HTML dos posts
            const postsHTML = postsToShow.map(post => `
                <article class="post-card">
                    <h2 class="post-title">${escapeHtml(post.title || 'Sem título')}</h2>
                    <div class="post-body">${escapeHtml(post.body || 'Conteúdo não disponível')}</div>
                    <div class="post-meta">
                        <span>👤 Autor ID: ${post.userId}</span>
                        <span>📌 Post #${post.id}</span>
                        <span class="badge-api">🔌 via API REST</span>
                    </div>
                </article>             
            `).join('');

            postsContainer.innerHTML = postsHTML;
            
        } catch (error) {
            console.error('Erro ao carregar posts:', error);
            postsContainer.innerHTML = `<div class="error-message">⚠️ Erro ao carregar posts: ${error.message}</div>`;
        }
    }

    // ========== FUNÇÃO AUXILIAR PARA ESCAPAR HTML ==========
    function escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\n/g, '<br>');
    }

    // ========== 3. EVENTO DE SUBMIT PARA CRIAR NOVO POST (POST) ==========
    if (formPost) {
        formPost.addEventListener('submit', async function(event) {
            // Previne o comportamento padrão do formulário (recarregar página)
            event.preventDefault();

            // Captura os valores dos inputs
            const tituloValue = inputTitulo.value.trim();
            const conteudoValue = inputConteudo.value.trim();  
            
            // Validação simples
            if (!tituloValue) {
                alert('Por favor, preencha o título do post.');
                inputTitulo.focus();
                return;
            }

            if (!conteudoValue) {
                alert('Por favor, preencha o conteúdo do post.');
                inputConteudo.focus(); 
                return;
            }

            // Monta o objeto conforme especificação
            const data = {
                title: tituloValue,
                body: conteudoValue,
                userId: 1
            };

            // Botão de submit para feedback visual
            const submitBtn = document.getElementById('btn-submit-post');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ Enviando...';
            submitBtn.disabled = true;

            try {
                // Faz a requisição POST para a API
                const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }

                const respostaAPI = await response.json();

                // Renderiza o post criado na área de saída
                if (renderizadorTitulo) {
                    renderizadorTitulo.innerHTML = escapeHtml(respostaAPI.title);
                }
                
                if (renderizadorConteudo) {
                    renderizadorConteudo.innerHTML = escapeHtml(respostaAPI.body);
                }

                // Efeito visual de sucesso
                if (renderizadorConteudo) {
                    renderizadorConteudo.style.backgroundColor = '#fefce8';
                    renderizadorConteudo.style.padding = '8px';
                    renderizadorConteudo.style.borderRadius = '12px';
                    setTimeout(() => {
                        renderizadorConteudo.style.backgroundColor = 'transparent';
                        renderizadorConteudo.style.padding = '0';
                    }, 800);
                }

                // Limpa os campos do formulário
                inputTitulo.value = '';
                inputConteudo.value = '';

                // Mensagem de sucesso
                alert(`✅ Post criado com sucesso!\nID do post: ${respostaAPI.id}\nTítulo: ${respostaAPI.title}`);

            } catch (error) {
                console.error('Erro ao criar post:', error);
                alert(`❌ Erro ao publicar post: ${error.message}\nVerifique sua conexão ou tente novamente.`);
            } finally {
                // Restaura o botão
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========== 4. SIMULAÇÃO PARA LINKS DE REGISTRO/LOGIN ==========
    const registerBtn = document.getElementById('registerLink');
    const loginBtn = document.getElementById('loginLink');

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();  
            alert("🔐 [Funcionalidade futura] Tela de Registro.\nAgora você pode criar posts e ver a API em ação!");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert("🔑 [Funcionalidade futura] Tela de Login.\nExplore a criação de conteúdo via formulário POST!");
        });
    }
    
    // ========== 5. CARREGA OS POSTS EXISTENTES AO INICIAR A PÁGINA ==========
    fetchExistingPosts();

    // ========== 6. FALLBACK PARA A IMAGEM ==========
    const imgNotebook = document.getElementById('img_2');
    if (imgNotebook && imgNotebook.complete && imgNotebook.naturalWidth === 0) {
        imgNotebook.src = 'https://placehold.co/600x400/1e293b/ffffff?text=Notebook+2026';
    }
    
});