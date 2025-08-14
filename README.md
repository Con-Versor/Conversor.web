<div align="center">
  <img src="conversor-app/public/favicon.ico" alt="Con-Versor Logo" width="120" height="120">
  
  # 💱 Con-Versor
  
  ### Conversor de Moedas Moderno e Intuitivo
  
  [![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://javascript.info/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  
  [🚀 Demo ao Vivo](#) • [📖 Documentação](#funcionalidades) • [🛠 Instalação](#instalação) • [🤝 Contribuir](#contribuição)
  
  ---
  
  <p align="center">
    <strong>Con-Versor</strong> é uma aplicação web moderna que oferece conversão de moedas em tempo real, 
    consultas detalhadas, gráficos históricos interativos e ranking de moedas — tudo em uma interface 
    elegante e responsiva.
  </p>
  
  ![Screenshot da Aplicação](https://via.placeholder.com/800x400/f59e0b/ffffff?text=Con-Versor+Dashboard)
</div>

## ✨ Funcionalidades

### 🔄 **Conversor de Moedas**
- Conversão instantânea entre 30+ moedas internacionais
- Interface intuitiva com campos de entrada otimizados
- Botão de troca rápida entre moedas
- Histórico de conversões mais utilizadas
- Suporte a formatação regional de números

### � **Consulta Detalhada**
- Informações completas sobre cada moeda
- Bandeiras dos países para identificação visual
- Tendências de alta/baixa com indicadores coloridos
- Dados atualizados em tempo real via APIs confiáveis

### 📈 **Gráficos Históricos**
- Visualização interativa de cotações históricas
- Períodos configuráveis (7, 15, 30, 90, 180 dias)
- Gráficos responsivos construídos com Chart.js
- Tooltips detalhados e navegação por zoom

### 🏆 **Ranking de Moedas**
- Top moedas mais valorizadas
- Sistema de pódio para as 3 primeiras posições
- Filtros e ordenação personalizáveis
- Interface em cards com animações suaves

### � **Experiência do Usuário**
- **100% Responsivo** - Funciona perfeitamente em dispositivos de 320px+
- **Modo Escuro/Claro** - Interface adaptável
- **Animações Fluidas** - Transições suaves com Framer Motion
- **Performance Otimizada** - Carregamento rápido e eficiente

## � Tecnologias

### Frontend
- **[React 19.0.0](https://react.dev/)** - Biblioteca para interfaces de usuário
- **[Vite 6.2.0](https://vitejs.dev/)** - Build tool e dev server ultra rápido
- **[React Router DOM](https://reactrouter.com/)** - Navegação SPA
- **[Chart.js](https://www.chartjs.org/) + React-ChartJS-2** - Gráficos interativos
- **[Heroicons](https://heroicons.com/)** - Ícones SVG otimizados
- **[Framer Motion](https://www.framer.com/motion/)** - Animações avançadas
- **[React Hot Toast](https://react-hot-toast.com/)** - Notificações elegantes

### APIs & Dados
- **[AwesomeAPI](https://economia.awesomeapi.com.br/)** - Cotações em tempo real
- **[ExchangeRate-API](https://exchangerate-api.com/)** - Dados históricos

### Desenvolvimento
- **ESLint** - Linting de código JavaScript/React
- **Modern CSS3** - Flexbox, Grid, Custom Properties
- **Mobile First** - Design responsivo desde 320px

## 📦 Instalação

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### Clone o Repositório
```bash
git clone https://github.com/Con-Versor/Conversor.web.git
cd Conversor.web/conversor-app
```

### Instale as Dependências
```bash
npm install
# ou
yarn install
```

### Execute o Projeto
```bash
npm run dev
# ou  
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build para Produção
```bash
npm run build
npm run preview
```

## 🚀 Deploy

### Netlify
```bash
npm run build
# Upload da pasta 'dist' no Netlify
```

### Vercel
```bash
npx vercel --prod
```

### GitHub Pages
```bash
npm run build
npm run deploy
```

## 📱 Compatibilidade

| Navegador | Versão Mínima |
|-----------|---------------|
| Chrome    | 90+           |
| Firefox   | 88+           |
| Safari    | 14+           |
| Edge      | 90+           |

**Dispositivos Suportados:** Desktop, Tablet, Mobile (320px+)

## 🎯 Roadmap

- [ ] **v2.0** - PWA com cache offline
- [ ] **v2.1** - Notificações de alertas de cotação  
- [ ] **v2.2** - Calculadora de investimentos
- [ ] **v2.3** - Exportação de relatórios PDF
- [ ] **v2.4** - Integração com carteiras digitais
- [ ] **v3.0** - Dashboard para traders

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: amazing feature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Guias de Contribuição
- [Código de Conduta](CODE_OF_CONDUCT.md)
- [Guia de Contribuição](CONTRIBUTING.md)
- [Padrões de Commit](https://conventionalcommits.org/)

## 👥 Equipe

<table>
  <tr>
    <td align="center">
      <a href="#">
        <img src="https://github.com/username.png" width="100px;" alt=""/>
        <br />
        <sub><b>Desenvolvedor Principal</b></sub>
      </a>
    </td>
  </tr>
</table>

## 📈 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/Con-Versor/Conversor.web?style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/Con-Versor/Conversor.web?style=flat-square)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Con-Versor/Conversor.web?style=flat-square)
![GitHub stars](https://img.shields.io/github/stars/Con-Versor/Conversor.web?style=flat-square)

## � Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  
  **[⬆ Voltar ao Topo](#-con-versor)**
  
  Feito com ❤️ e ☕ por [Con-Versor Team](https://github.com/Con-Versor)
  
  ⭐ **Gostou do projeto? Deixe uma estrela!** ⭐
  
</div>