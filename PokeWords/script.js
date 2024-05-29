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
let currentPokemon;
let pokemonList = [];
const maxGuesses = 6; // Define o número máximo de adivinhações permitidas
let guessCount = 0; // Conta o número de adivinhações feitas
let gameOver = false; // Controla se o jogo já foi ganho

// Verifica se há um tema salvo no localStorage e aplica-o ao carregar a página
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.body.className = savedTheme;
    document.querySelectorAll('.modal-content').forEach(modalContent => {
        modalContent.classList.add(savedTheme);
    });

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
    // Se não houver tema salvo, aplica o tema padrão
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
}

// Evento de clique no botão de configurações
settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('show'); // Mostra ou oculta o menu de configurações
});

// Evento de clique no botão de tema claro
themeLightBtn.addEventListener('click', () => {
    toggleTheme('light-theme'); // Alterna para o tema claro
    settingsMenu.classList.remove('show'); // Fecha o menu de configurações após a seleção
});

// Evento de clique no botão de tema escuro
themeDarkBtn.addEventListener('click', () => {
    toggleTheme('dark-theme'); // Alterna para o tema escuro
    settingsMenu.classList.remove('show'); // Fecha o menu de configurações após a seleção
});

// Evento de clique no botão de login
loginBtn.addEventListener('click', () => {
    loginModal.classList.add('show'); // Mostra o modal de login ao clicar no botão de login
    // Define o tema do modal de login de acordo com o tema atual
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
        loginModal.classList.remove('show'); // Fecha o modal de login ao clicar no botão de fechar
        settingsMenu.classList.remove('show'); // Fecha o modal do menu ao clicar no botão de fechar
        winModal.classList.remove('show'); // Fecha o modal de vitória ao clicar no botão de fechar
        loseModal.classList.remove('show'); // Fecha o modal de derrota ao clicar no botão de fechar
    });
});

// Evento de envio do formulário de login
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário
    // Aqui você pode adicionar a lógica para processar o login (enviar dados para um servidor, etc.)
    // Por enquanto, apenas fechamos o modal de login ao clicar no botão de submit
    loginModal.classList.remove('show'); // Fecha o modal de login após o envio do formulário
});

// Função para calcular o tempo gasto
function getTimeSpent() {
    const endTime = new Date();
    const timeDiff = endTime - startTime; // tempo em milissegundos
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}

function showWinModal() {
    const winModal = document.getElementById('win-modal');
    if (winModal) {
        const congratulationsTitle = document.getElementById('congratulations-title');
        if (congratulationsTitle) {
            congratulationsTitle.innerText = translations[getLanguage()].congratulationsTitle;
        }
        const winTime = document.getElementById('win-time');
        if (winTime) {
            winTime.innerText = `Time: ${getTimeSpent()}`;
        }
        winModal.classList.add('show');
    }
}

function showLoseModal() {
    const loseModal = document.getElementById('lose-modal');
    if (loseModal) {
        const defeatTitle = document.getElementById('defeat-title');
        if (defeatTitle) {
            defeatTitle.innerText = translations[getLanguage()].defeatTitle;
        }
        const loseTime = document.getElementById('lose-time');
        if (loseTime) {
            loseTime.innerText = `Time: ${getTimeSpent()}`;;
        }
        loseModal.classList.add('show');
    }
}

// Evento de clique no botão de jogar novamente
playAgainBtn.addEventListener('click', () => {
    winModal.classList.remove('show');
    startGame();
    gameOver = false; // Reinicia o jogo ao clicar em jogar novamente
});

// Evento de clique no botão de tentar novamente
tryAgainBtn.addEventListener('click', () => {
    loseModal.classList.remove('show');
    startGame();
    gameOver = false; // Reinicia o jogo ao clicar em tentar novamente
});

// Função para iniciar o jogo
function startGame() {
    // Limpa o campo de entrada e as adivinhações anteriores
    guessInput.value = '';
    guessesContainer.innerHTML = '';
    guessCount = 0; // Reinicia a contagem de adivinhações
    gameOver = false; // Reinicia o estado do jogo

    // Escolhe um Pokémon aleatório da lista
    currentPokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];

    // Marca o início do jogo
    startTime = new Date();
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
    }, 1000); // Tempo aumentado para que a mensagem de erro seja visível por mais tempo
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

    guessCount++; // Incrementa a contagem de adivinhações
    displayGuess(guess);

    if (guess === currentPokemon) {
        showWinModal();
    } else if (guessCount >= maxGuesses) {
        showLoseModal();
    } else {
        guessInput.value = ''; // Limpa o campo de entrada para a próxima adivinhação
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const guessInput = document.getElementById("guess-input");
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
        startGame(); // Inicia o jogo após carregar a lista de Pokémon
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
//traduções
const translations = {
    en: {
        title: "PokeWords",
        instruction: "Guess the Pokemon name!",
        guessPlaceholder: "Guess the Pokemon",
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
        defeatTitle: "Defeat!",
        loseTimeLabel: "Time:"
    },
    pt: {
        title: "PokeWords",
        instruction: "Adivinhe o nome do Pokemon!",
        guessPlaceholder: "Digite seu palpite",
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
        defeatTitle: "Derrota!",
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
