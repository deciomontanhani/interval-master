# IntervalMaster

Um jogo web para treinamento e prática de reconhecimento de intervalos musicais, desenvolvido para músicos e estudantes que desejam aprimorar sua percepção musical.

## 📖 Sobre o Projeto

IntervalMaster é uma aplicação educativa que desafia os jogadores a identificar intervalos musicais através de representação visual. O jogo apresenta duas notas e pede ao usuário que identifique o intervalo entre elas, oferecendo desafios crescentes em diferentes níveis de dificuldade.

## 🎮 Como Jogar

1. **Escolha um nível de dificuldade** na tela inicial:
   - **Nível 1**: Intervalos básicos com tempo generoso
   - **Nível 2**: Maior variedade de intervalos e menos tempo
   - **Nível 3**: Intervalos mais complexos e tempo reduzido
   - **Nível 4**: Maior desafio com todos os intervalos e tempo mínimo

2. **Durante o jogo**:
   - Uma nota de referência será exibida
   - Uma segunda nota será mostrada
   - Selecione o intervalo correto entre as duas notas antes que o tempo acabe

3. **Regras especiais**:
   - Cada rodada contém 5 perguntas
   - Ao final de cada rodada, um resumo é apresentado
   - Para avançar para a próxima rodada, você deve acertar todas as perguntas
   - Se cometer erros, o jogo terminará e mostrará seus resultados finais

4. **Pontuação**:
   - Responder mais rapidamente gera mais pontos
   - Sequências de respostas corretas aumentam seu multiplicador de pontos
   - Níveis mais altos concedem mais pontos por resposta correta

## 🛠️ Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor e roteamento
- **TypeScript**: Tipagem estática para maior segurança e autocompletar
- **Tailwind CSS**: Framework CSS utilitário para estilização responsiva
- **React Context API**: Gerenciamento de estado da aplicação
- **LocalStorage**: Armazenamento de pontuações máximas

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 16.x ou superior
- npm ou yarn

### Passos para instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/intervalo-master.git
cd intervalo-master
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação:
Abra seu navegador e visite `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
intervalo-master/
├── public/             # Arquivos estáticos
├── src/
│   ├── app/            # Rotas da aplicação Next.js
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── game/       # Componentes específicos do jogo
│   │   └── layout/     # Componentes de layout
│   ├── context/        # Contextos React para gerenciamento de estado
│   └── lib/            # Funções utilitárias e lógica do jogo
│       ├── intervals.ts # Lógica de cálculo de intervalos musicais
│       ├── gameLogic.ts # Regras e lógica principal do jogo
│       └── types.ts     # Tipos e interfaces TypeScript
├── tailwind.config.js  # Configuração do Tailwind CSS
└── package.json        # Dependências e scripts
```

## 👨‍💻 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature:
```bash
git checkout -b feature/nova-funcionalidade
```

3. Faça suas alterações e commit:
```bash
git commit -m 'Adiciona nova funcionalidade'
```

4. Envie para o branch:
```bash
git push origin feature/nova-funcionalidade
```

5. Abra um Pull Request

### Ideias para Contribuição

- Adicionar novos modos de jogo (ex: identificação de acordes)
- Melhorar a acessibilidade da aplicação
- Adicionar suporte para diferentes idiomas
- Implementar estatísticas de desempenho detalhadas
- Criar modo multiplayer

## 📜 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 📬 Contato

Se você tiver dúvidas ou sugestões, sinta-se à vontade para abrir uma issue no repositório.

---

Desenvolvido com ❤️ por Décio Montanhani.
