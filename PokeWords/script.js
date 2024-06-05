// Seleciona os elementos relevantes do DOM
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');
const themeLightBtn = document.getElementById('theme-light');
const themeDarkBtn = document.getElementById('theme-dark');
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const winModal = document.getElementById('win-modal');
const loseModal = document.getElementById('lose-modal');
const closeModalBtns = document.querySelectorAll('.close-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const tryAgainBtn = document.getElementById('try-again-btn');
const submitGuessBtn = document.getElementById('submit-guess');
const guessInput = document.getElementById('guess-input');
const guessesContainer = document.getElementById('guesses');
let startTime;
let currentPokemon = '';
let pokemonList = [];
const maxGuesses = 6;
let guessCount = 0;
let gameOver = false; // Controla se o jogo já foi ganho

// Verifica se há um tema salvo no localStorage e aplica-o ao carregar a página
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.className = savedTheme;
    document.querySelectorAll('.modal-content').forEach(modalContent => {
        modalContent.classList.add(savedTheme);
    });
    // Aplica o tema ao rodapé
    const footer = document.getElementById('footer');
    if (footer) {
        footer.classList.add(savedTheme);
    }
    // Aplica o tema aos botões Play Again e Try Again
    if (savedTheme === 'dark-theme') {
        playAgainBtn.classList.add('dark-theme');
        tryAgainBtn.classList.add('dark-theme');
    } else {
        playAgainBtn.classList.remove('dark-theme');
        tryAgainBtn.classList.remove('dark-theme');
    }
    // Aplica o tema às modais de vitória e derrota
    winModal.classList.toggle('dark-theme', savedTheme === 'dark-theme');
    loseModal.classList.toggle('dark-theme', savedTheme === 'dark-theme');

    // Verifica se a modal de vitória está visível e aplica o tema correto
    if (winModal.classList.contains('show')) {
        winModal.querySelector('.modal-content').classList.toggle('dark-theme', savedTheme === 'dark-theme');
    }
} else {
    toggleTheme('light-theme');
}

// Função para alternar entre os temas claro e escuro
function toggleTheme(theme) {
    document.body.className = theme; // Define a classe do body para o tema desejado
    localStorage.setItem('theme', theme); // Salva o tema atual no localStorage para persistência

    // Define a classe do modal de acordo com o tema
    document.querySelectorAll('.modal-content').forEach(modalContent => {
        modalContent.classList.remove('light-theme', 'dark-theme');
        modalContent.classList.add(theme);
    });

    // Aplica o tema ao botão Play Again e Try Again
    if (theme === 'dark-theme') {
        playAgainBtn.classList.add('dark-theme');
        tryAgainBtn.classList.add('dark-theme');
    } else {
        playAgainBtn.classList.remove('dark-theme');
        tryAgainBtn.classList.remove('dark-theme');
    }

    // Aplica o tema ao rodapé
    const footer = document.getElementById('footer');
    if (footer) {
        if (theme === 'dark-theme') {
            footer.classList.add('dark-theme');
        } else {
            footer.classList.remove('dark-theme');
        }
    }
}

// Evento de clique no botão de configurações
settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('show');
});

// Evento de clique no botão de tema claro
themeLightBtn.addEventListener('click', () => {
    toggleTheme('light-theme');
    settingsMenu.classList.remove('show');
});

// Evento de clique no botão de tema escuro
themeDarkBtn.addEventListener('click', () => {
    toggleTheme('dark-theme');
    settingsMenu.classList.remove('show');
});

// Evento de clique no botão de login
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('show'); // Define o tema do modal de login de acordo com o tema atual
    if (document.body.classList.contains('dark-theme')) {
        loginModal.querySelector('.modal-content').classList.add('dark-theme');
        loginModal.querySelector('.modal-content').classList.remove('light-theme');
    } else {
        loginModal.querySelector('.modal-content').classList.add('light-theme');
        loginModal.querySelector('.modal-content').classList.remove('dark-theme');
    }
});

// Eventos de clique nos botões de fechar do modal
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        loginModal.classList.remove('show');
        settingsMenu.classList.remove('show');
        winModal.classList.remove('show');
        loseModal.classList.remove('show');
    });
});

// Evento de envio do formulário de login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //Implementar mais tarde o login...
    loginModal.classList.remove('show');
});

// Função para obter a lista de Pokémon da API
function fetchPokemonList() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
        .then(response => response.json())
        .then(data => {
            pokemonList = data.results.map(pokemon => pokemon.name);
        })
        .catch(error => console.error('Erro ao obter a lista de Pokémon:', error));
}

// Função para calcular o tempo gasto
function getTimeSpent() {
    const endTime = new Date();
    const timeDiff = endTime - startTime; // tempo em milissegundos
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

// Função da tela de vitória
function showWinModal() {
    const winModal = document.getElementById('win-modal');
    if (winModal) {
        const congratulationsTitle = document.getElementById('congratulations-title');
        if (congratulationsTitle) {
            congratulationsTitle.innerText = translations[getLanguage()].congratulationsTitle;
        }
        const winTime = document.getElementById('win-time');
        if (winTime) {
            winTime.innerText = `${translations[getLanguage()].winTimeLabel} ${getTimeSpent()}`;
        }
        winModal.classList.add('show');
    }
}

// Função da tela de derrota
function showLoseModal() {
    const loseModal = document.getElementById('lose-modal');
    if (loseModal) {
        const defeatTitle = document.getElementById('defeat-title');
        if (defeatTitle) {
            defeatTitle.innerText = translations[getLanguage()].defeatTitle;
        }
        const loseTime = document.getElementById('lose-time');
        if (loseTime) {
            loseTime.innerText = `${translations[getLanguage()].loseTimeLabel} ${getTimeSpent()}`;
        }
        const correctPokemon = document.getElementById('correct-pokemon');
        if (correctPokemon) {
            correctPokemon.innerText = `${translations[getLanguage()].correctPokemon}${currentPokemon}`;
        }
        loseModal.classList.add('show');
    }
}

// Evento de clique no botão de jogar novamente
playAgainBtn.addEventListener('click', () => {
    winModal.classList.remove('show');
    startGame();
    gameOver = false;
});

// Evento de clique no botão de tentar novamente
tryAgainBtn.addEventListener('click', () => {
    loseModal.classList.remove('show');
    startGame();
    gameOver = false;
});

// Função para iniciar o jogo
function startGame() {
    guessInput.value = '';
    guessesContainer.innerHTML = '';
    guessCount = 0;
    gameOver = false;

    // Escolhe um Pokémon aleatório da lista
    currentPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    startTime = new Date();
    fetchPokemonList();
    console.log(currentPokemon);
}

// Função para validar o nome do Pokémon
function isValidPokemonName(name) {
    return pokemonList.includes(name.toLowerCase());
}

// Função para adicionar uma animação de erro
function showErrorAnimation() {
    const errorMessage = document.getElementById('error-message');
    const lang = getLanguage();
    errorMessage.textContent = errorMessage.dataset.errorMessage || translations[lang].errorMessage;
    document.body.classList.add('error');
    setTimeout(() => {
        document.body.classList.remove('error');
        errorMessage.textContent = "";
    }, 1000);
}

// Função para exibir as letras adivinhadas com as cores corretas
function displayGuess(guess) {
    const guessElement = document.createElement('div');
    guessElement.classList.add('guess');
    const guessChars = guess.split('');
    const currentPokemonChars = currentPokemon.split('');

    guessChars.forEach((char, index) => {
        const charElement = document.createElement('span');
        charElement.textContent = char;

        if (char === currentPokemonChars[index]) {
            charElement.classList.add('correct');
        } else if (currentPokemonChars.includes(char)) {
            charElement.classList.add('present');
        } else {
            charElement.classList.add('absent');
        }

        guessElement.appendChild(charElement);
    });

    guessesContainer.appendChild(guessElement);
}

// Evento de clique no botão de enviar adivinhação
submitGuessBtn.addEventListener('click', () => {
    if (gameOver) return; // Impede que o jogo receba mais inputs após ser acertado ou perdido

    const guess = guessInput.value.toLowerCase().trim();
    if (!isValidPokemonName(guess)) {
        showErrorAnimation();
        return;
    }

    guessCount++;
    displayGuess(guess);

    // Fecha a janela de sugestões após o envio do palpite
    hideSuggestions();

    if (guess === currentPokemon) {
        showWinModal();
    } else if (guessCount >= maxGuesses) {
        showLoseModal();
    } else {
        guessInput.value = '';
    }
});


document.addEventListener("DOMContentLoaded", function () {
    const guessInput = document.getElementById("guess-input");
    guessInput.addEventListener('input', showSuggestions);
    guessInput.addEventListener('blur', hideSuggestions);
    const submitGuess = document.getElementById("submit-guess");

    // Adicionar evento de teclado para o campo de entrada
    guessInput.addEventListener("keyup", function (event) {
        // Verificar se a tecla pressionada é Enter
        if (event.key === "Enter") {
            // Simular clique no botão de envio
            submitGuess.click();
        }
    });
});

// Carregar a lista de nomes de Pokémon da API
fetch('https://pokeapi.co/api/v2/pokemon?limit=1000')
    .then(response => response.json())
    .then(data => {
        pokemonList = data.results.map(pokemon => pokemon.name.toLowerCase());
        startGame();
    });

// Atualize a função para adicionar um event listener ao dropdown
document.addEventListener('DOMContentLoaded', () => {
    const lang = getLanguage();
    updateLanguage(lang);

    const languageSelect = document.getElementById('language-select');
    languageSelect.value = lang; // Define o valor inicial do dropdown
    languageSelect.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });
});

// Função para exibir as sugestões de Pokémon
function showSuggestions() {
    const input = document.getElementById('guess-input');
    const suggestionsDiv = document.getElementById('autocomplete-container');
    const query = input.value.toLowerCase();
    const suggestions = pokemonList.filter(pokemon => pokemon.includes(query));

    suggestionsDiv.innerHTML = '';
    if (suggestions.length === 0) {
        suggestionsDiv.classList.add('hidden');
        return;
    }

    suggestionsDiv.classList.remove('hidden');
    suggestions.forEach(pokemon => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerText = pokemon;
        suggestionItem.addEventListener('mousedown', () => {
            input.value = pokemon;
            suggestionsDiv.classList.add('hidden');
        });
        suggestionsDiv.appendChild(suggestionItem);
    });

    const inputRect = input.getBoundingClientRect();
    suggestionsDiv.style.top = `${inputRect.bottom + window.scrollY}px`;
    suggestionsDiv.style.left = `${inputRect.left + window.scrollX}px`;
    suggestionsDiv.style.width = `${inputRect.width}px`;

    // Aplica o tema ao contêiner de sugestões
    if (document.body.classList.contains('dark-theme')) {
        suggestionsDiv.classList.add('dark-theme');
    } else {
        suggestionsDiv.classList.remove('dark-theme');
    }
}

// Função para esconder a div de autocomplete
function hideSuggestions() {
    const suggestionsDiv = document.getElementById('autocomplete-container');
    suggestionsDiv.classList.add('hidden');
}

// Traduções
const translations = {
    en: {
        instruction: "Guess the Pokemon!",
        guessPlaceholder: "Guess the Pokemon!",
        submitButton: "Submit",
        tryAgainButton: "Try Again",
        playAgainButton: "Play Again",
        settingsTitle: "Settings",
        themeLight: "Light Theme",
        themeDark: "Dark Theme",
        loginButton: "Login",
        usernamePlaceholder: "Username",
        passwordPlaceholder: "Password",
        loginTitle: "Login",
        errorMessage: "This Pokemon does not exist",
        languageLabel: "Select Language:",
        congratulationsTitle: "Congratulations!",
        winTimeLabel: "Time:",
        defeatTitle: "Defeat!",
        loseTimeLabel: "Time:",
        correctPokemon: "The Pokemon was:"
    },
    pt: {
        instruction: "Adivinhe o Pokemon!",
        guessPlaceholder: "Digite o nome do Pokemon!",
        submitButton: "Enviar",
        tryAgainButton: "Tente Novamente",
        playAgainButton: "Jogar Novamente",
        settingsTitle: "Configurações",
        themeLight: "Tema Claro",
        themeDark: "Tema Escuro",
        loginButton: "Entrar",
        usernamePlaceholder: "Usuário",
        passwordPlaceholder: "Senha",
        loginTitle: "Entrar",
        errorMessage: "Este Pokémon não existe",
        languageLabel: "Selecione o Idioma:",
        congratulationsTitle: "Parabéns!",
        winTimeLabel: "Tempo:",
        defeatTitle: "Derrota!",
        loseTimeLabel: "Tempo:",
        correctPokemon: "O Pokemon era:"
    }
};

function updateLanguage(lang) {
    const elementsToTranslate = {
        title: '#title',
        instruction: '#instruction',
        guessPlaceholder: '#guess-input',
        submitButton: '#submit-guess',
        tryAgainButton: '#try-again-btn',
        playAgainButton: '#play-again-btn',
        settingsTitle: '#settings-title',
        themeLight: '#theme-light',
        themeDark: '#theme-dark',
        loginButton: '#login-btn',
        usernamePlaceholder: '#username',
        passwordPlaceholder: '#password',
        loginTitle: '#login-title',
        languageLabel: '#language-label',
        congratulationsTitle: '#congratulations-title',
        defeatTitle: '#defeat-title',
        winTimeLabel: '#win-time',
        loseTimeLabel: '#lose-time',
        correctPokemon: '#correct-pokemon'
    };

    for (const [key, selector] of Object.entries(elementsToTranslate)) {
        const element = document.querySelector(selector);
        if (element) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    }

    // Atualiza mensagem de erro
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.dataset.errorMessage = translations[lang].errorMessage;
    }
}

function setLanguage(lang) {
    localStorage.setItem('language', lang);
    updateLanguage(lang);
}

function getLanguage() {
    return localStorage.getItem('language') || 'en';
}
