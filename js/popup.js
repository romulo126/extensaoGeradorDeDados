document.addEventListener('DOMContentLoaded', function() {

    aplicarTema();

    restaurarGeneroSelecionado();

    if (!localStorage.getItem('dadosGerados')) {
        gerarDados();
    } else {
        carregarDados();
    }

    document.getElementById('gerar').addEventListener('click', function() {
        gerarDados();
    });

    adicionarEventosDeCopia();

    document.getElementById('darkModeToggle').addEventListener('click', function() {
        alternarModoEscuro();
    });

    adicionarEventoSelecaoGenero();
});

function gerarDados() {
    const generoSelecionado = document.querySelector('input[name="gender"]:checked').value;

    const nomeCompleto = gerarNome(generoSelecionado);
    const nomeMae = gerarNome('feminino');
    const cpfGerado = gerarCPF();
    const telefone = gerarTelefone();
    const email = gerarEmail(nomeCompleto);
    const cep = gerarCEP();

    const dados = {
        nome: nomeCompleto,
        nomeMae: nomeMae,
        cpf: cpfGerado,
        telefone: telefone,
        email: email,
        cep: cep
    };

    localStorage.setItem('dadosGerados', JSON.stringify(dados));
    exibirDados(dados);
}

function carregarDados() {
    const dados = JSON.parse(localStorage.getItem('dadosGerados'));
    exibirDados(dados);
}

function exibirDados(dados) {
    document.getElementById('nome').textContent = dados.nome;
    document.getElementById('nomeMae').textContent = dados.nomeMae;
    document.getElementById('cpf').textContent = formatarCPF(dados.cpf);
    document.getElementById('telefone').textContent = formatarTelefone(dados.telefone);
    document.getElementById('email').textContent = dados.email;
    document.getElementById('cep').textContent = formatarCEP(dados.cep);
}

function adicionarEventosDeCopia() {
    const campos = document.querySelectorAll('.data-field');
    campos.forEach(campo => {
        campo.addEventListener('click', function() {
            let valor = this.querySelector('.data-value').textContent;
            const idCampo = this.id;

            if (idCampo === 'campo-cpf' || idCampo === 'campo-cep' || idCampo === 'campo-telefone') {
                valor = valor.replace(/\D/g, '');
            }

            copiarParaClipboard(valor);
            this.classList.add('copiado');
            setTimeout(() => {
                this.classList.remove('copiado');
            }, 1000);
        });
    });
}

function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        console.log('Texto copiado para a área de transferência');
    }, err => {
        console.error('Erro ao copiar texto: ', err);
    });
}

function gerarNome(genero) {
    const nomesMasculinos = ["João", "Pedro", "Paulo", "Lucas", "Gabriel", "Felipe", "Mateus", "Guilherme", "Rafael", "Bruno"];
    const nomesFemininos = ["Maria", "Ana", "Carla", "Mariana", "Fernanda", "Camila", "Julia", "Larissa", "Beatriz", "Isabela"];
    const sobrenomes = ["Silva", "Souza", "Costa", "Oliveira", "Pereira", "Rodrigues", "Almeida", "Nascimento", "Lima", "Araújo"];

    let nome;

    if (genero === 'masculino') {
        nome = nomesMasculinos[Math.floor(Math.random() * nomesMasculinos.length)];
    } else {
        nome = nomesFemininos[Math.floor(Math.random() * nomesFemininos.length)];
    }

    const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
    return `${nome} ${sobrenome}`;
}

function gerarCPF() {
    let cpf = [];
    for (let i = 0; i < 9; i++) {
        cpf.push(Math.floor(Math.random() * 10));
    }
    cpf.push(calcularDigitoCPF(cpf));
    cpf.push(calcularDigitoCPF(cpf));
    return cpf.join('');
}

function calcularDigitoCPF(cpf) {
    let soma = 0;
    let peso = cpf.length + 1;
    for (let i = 0; i < cpf.length; i++) {
        soma += cpf[i] * (peso - i);
    }
    let resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
}

function gerarTelefone() {
    const ddd = ["11", "21", "31", "41", "51", "61", "71", "81", "91"];
    const numero = Math.floor(10000000 + Math.random() * 90000000);
    return `${ddd[Math.floor(Math.random() * ddd.length)]}9${numero}`;
}

function gerarEmail(nomeCompleto) {
    const provedores = ["gmail.com", "hotmail.com", "yahoo.com.br", "outlook.com", "uol.com.br"];
    const nomeUsuario = nomeCompleto.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 100);
    return `${nomeUsuario}@${provedores[Math.floor(Math.random() * provedores.length)]}`;
}

function gerarCEP() {
    return `${Math.floor(10000000 + Math.random() * 90000000)}`;
}

// Funções de formatação para exibição
function formatarCPF(cpf) {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatarTelefone(telefone) {
    return telefone.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "($1) $2 $3-$4");
}

function formatarCEP(cep) {
    return cep.replace(/(\d{5})(\d{3})/, "$1-$2");
}

function aplicarTema() {
    const body = document.body;
    const tema = localStorage.getItem('tema') || 'claro';
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (tema === 'escuro') {
        body.classList.add('dark-mode');
        darkModeToggle.src = '/img/light-mode-icon.svg';
    } else {
        body.classList.remove('dark-mode');
        darkModeToggle.src = '/img/dark-mode-icon.svg';
    }
}

function alternarModoEscuro() {
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        localStorage.setItem('tema', 'claro');
        darkModeToggle.src = '/img/dark-mode-icon.svg';
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('tema', 'escuro');
        darkModeToggle.src = '/img/light-mode-icon.svg';
    }
}

function adicionarEventoSelecaoGenero() {
    const radiosGenero = document.querySelectorAll('input[name="gender"]');
    radiosGenero.forEach(radio => {
        radio.addEventListener('change', function() {
            localStorage.setItem('generoSelecionado', this.value);
        });
    });
}

function restaurarGeneroSelecionado() {
    const generoSalvo = localStorage.getItem('generoSelecionado');
    if (generoSalvo) {
        const radioGenero = document.querySelector(`input[name="gender"][value="${generoSalvo}"]`);
        if (radioGenero) {
            radioGenero.checked = true;
        }
    }
}
