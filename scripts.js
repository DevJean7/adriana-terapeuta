// Armazenando os horários ocupados (simulação de exemplo)
let horariosOcupados = {
    '2025-01-12': ['18:00', '19:00'], // Exemplo: já estão ocupados
};

// Horários por dia
const horariosDisponiveis = {
    'segunda': ['18:00', '19:00', '20:00'],
    'terça': ['09:30', '10:30', '14:00', '15:00', '16:00', '17:00', '18:00'],
    'quarta': ['09:30', '10:30', '14:00', '15:00', '16:00', '17:00', '18:00'],
    'quinta': ['09:30', '10:30', '14:00', '15:00', '16:00', '17:00', '18:00'],
    'sexta': ['09:30', '10:30', '14:00', '15:00', '16:00', '17:00', '18:00'],
};

// Função para formatar as datas
function formatarData(dia, mes, ano) {
    const data = new Date(ano, mes, dia);
    return data.toISOString().split('T')[0]; // Retorna a data no formato 'YYYY-MM-DD'
}

// Função para marcar o horário como ocupado
function marcarComoOcupado(dia, hora) {
    const botao = document.querySelector(`button[data-dia="${dia}"][data-hora="${hora}"]`);
    if (botao) {
        botao.classList.add('ocupado');
        botao.disabled = true; // Desabilita o botão
    }
}

// Função para gerar os botões de horários
function gerarHorarios() {
    const dias = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
    const diasNomes = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
    const diasHorariosContainer = document.getElementById('dias-horarios');

    dias.forEach((dia, index) => {
        const divDia = document.createElement('div');
        divDia.classList.add('dia');

        const nomeDia = document.createElement('h3');
        nomeDia.textContent = diasNomes[index];
        divDia.appendChild(nomeDia);

        const horariosContainer = document.createElement('div');
        horariosContainer.classList.add('horarios');

        // Adicionando os botões de horários para o dia
        horariosDisponiveis[dia].forEach(hora => {
            const botao = document.createElement('button');
            botao.classList.add('horario-btn');
            botao.textContent = hora;
            botao.setAttribute('data-dia', formatarData(12 + index, 0, 2025)); // 12 + index gera as datas
            botao.setAttribute('data-hora', hora);

            // Marcar como ocupado se já estiver reservado
            if (horariosOcupados[formatarData(12 + index, 0, 2025)] && horariosOcupados[formatarData(12 + index, 0, 2025)].includes(hora)) {
                marcarComoOcupado(formatarData(12 + index, 0, 2025), hora);
            }

            botao.addEventListener('click', () => {
                // Verificar se já foi selecionado, caso sim, desmarcar
                if (botao.classList.contains('selecionado')) {
                    botao.classList.remove('selecionado');
                    document.getElementById('formulario-agendamento').classList.add('escondido');
                    return;
                }

                // Se outro horário já foi selecionado, desmarcar
                const horariosSelecionados = document.querySelectorAll('.horario-btn.selecionado');
                horariosSelecionados.forEach(btn => btn.classList.remove('selecionado'));

                // Marcar o horário selecionado
                botao.classList.add('selecionado');

                // Exibir formulário para o agendamento
                document.getElementById('formulario-agendamento').classList.remove('escondido');
                const nomeHorario = `${hora} - ${formatarData(12 + index, 0, 2025)}`;
                document.getElementById('form-agendamento').setAttribute('data-horario', nomeHorario);
            });

            horariosContainer.appendChild(botao);
        });

        divDia.appendChild(horariosContainer);
        diasHorariosContainer.appendChild(divDia);
    });
}

// Função que lida com o envio do formulário
document.getElementById('form-agendamento').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const horarioSelecionado = document.getElementById('form-agendamento').getAttribute('data-horario');

    // Exibir mensagem de sucesso
    document.getElementById('formulario-agendamento').reset();
    document.getElementById('sucesso').classList.remove('escondido');
});

// Gerar os horários ao carregar a página
document.addEventListener('DOMContentLoaded', gerarHorarios);

// Inicializando o EmailJS com a chave pública (substitua com sua própria chave)
emailjs.init('v1B-WB4-d10L-x-79'); // Substitua 'YOUR_USER_ID' pela chave pública que você obteve no painel do EmailJS

// Função para enviar o e-mail
function enviarEmail(nome, email, horario) {
    const templateParams = { nome, email, horario };

    emailjs.send('service_kvd5jhl', 'template_xb8gz2d', templateParams)
        .then(function(response) {
            console.log('Sucesso:', response);
            document.getElementById('formulario-agendamento').reset();
            document.getElementById('sucesso').classList.remove('escondido');
        })
        .catch(function(error) {
            console.log('Erro:', error);
            alert('Erro ao enviar o agendamento. Tente novamente.');
        });
}

// Evento de envio do formulário
document.getElementById('form-agendamento').addEventListener('submit', function(e) {
    e.preventDefault(); // Previne o comportamento padrão de envio do formulário

    // Coleta os dados inseridos pelo usuário no formulário
    const nome = document.getElementById('nome').value;  // Nome do cliente
    const email = document.getElementById('email').value; // E-mail do cliente
    const horarioSelecionado = document.getElementById('form-agendamento').getAttribute('data-horario'); // Horário selecionado pelo cliente

    // Chama a função para enviar o e-mail com os dados coletados
    enviarEmail(nome, email, horarioSelecionado);
});

