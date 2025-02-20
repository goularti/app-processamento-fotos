# 🖼️ Processador de Imagens

[![Licença MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)

Um aplicativo web simples e eficiente para processamento em lote de imagens, oferecendo recursos de recorte e marcação de data.

## ✨ Funcionalidades

- 📤 Upload de múltiplas imagens (até 25)
- 👁️ Visualização prévia em tempo real
- ✂️ Ferramenta de recorte individual
- 📅 Inserção automática de data
- 📦 Download em massa em formato ZIP

## 🚀 Início Rápido

### Pré-requisitos

- Navegador web moderno com suporte a JavaScript ES6+
- Conexão com internet para CDNs
- Python (opcional, para servidor local)

### 🔧 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/app-processamento-fotos.git
   cd app-processamento-fotos
   ```

2. Inicie um servidor local:
   ```bash
   # Python 3.x
   python -m http.server 8000

   # OU Python 2.x
   python -m SimpleHTTPServer 8000
   ```

3. Acesse no navegador:
   ```
   http://localhost:8000
   ```

## 📖 Como Usar

1. **Upload de Imagens**
   - Clique em "Escolher arquivos"
   - Selecione até 25 imagens
   - Formatos suportados: JPG, JPEG, PNG

2. **Edição de Imagens**
   - Use o botão "Editar" em cada imagem
   - Recorte conforme necessário
   - Confirme as alterações

3. **Processamento**
   - Digite a data no formato DD/MM/AAAA
   - Clique em "Processar Imagens"
   - Aguarde o processamento

4. **Download**
   - Clique em "Baixar Imagens"
   - Receba o arquivo ZIP com todas as imagens processadas

## 🏗️ Estrutura do Projeto
```
app-processamento-fotos /
│
├── 📄 index.html # Página principal
├── 🎨 style.css # Estilos CSS
├── 🔧 script.js # Lógica JavaScript
└── 📝 README.md # Documentação
```


## 🛠️ Tecnologias

- ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
- ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
- ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
- [Cropper.js](https://fengyuanchen.github.io/cropperjs/) - Biblioteca de recorte de imagens
- [JSZip](https://stuk.github.io/jszip/) - Biblioteca de compactação

## ⚠️ Limitações

| Recurso | Limitação |
|---------|-----------|
| Formatos | Apenas JPG, JPEG e PNG |
| Quantidade | Máximo 25 imagens por vez |
| Data | Posição fixa no canto superior direito |

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📬 Contato

Link do Projeto: [https://github.com/seu-usuario/app-processamento-fotos](https://github.com/goularti/app-processamento-fotos)

---

⭐️ Se este projeto te ajudou, considere dar uma estrela!
