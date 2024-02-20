//Input dos campus
let inputValorInicial = document.querySelector('#valorInicial');
let inputValorMensal = document.querySelector('#valorMensal');
let inputValorJuros = document.querySelector('#taxaJuros');
let inputPeriodo = document.querySelector('#periodo');
//Input dos botões
let btnCalcular = document.querySelector('#btn-calcular');
let btnLimpar = document.querySelector('#btn-limpar');
//Output dos campus
let outputValorTotalFinal = document.querySelector('#valorTotalFinal');
let outputValorTotalInvestido = document.querySelector('#valorTotalInvestido');
let outputValorTotalJuros = document.querySelector('#totalJuros');
let outputImpostoRenda = document.querySelector('#impostoRenda');

//Objeto calculadora
let calculadora = {
    valorInicial: 0.00,
    valorMensal: 0.00,
    taxaJuros: 0.00,
    periodo: 0,
    anos: false,
    meses: [["Meses", "Valor Total Investido", "Valor Total Final Bruto"]],
    valorTotalFinal: 0.00,
    valorTotalInvestido: 0.00,
    valorTotalJuros: 0.00,
    valorImpostoRenda: 0.00,
    porcentagemImpostoRenda: function () {
        if (this.periodo * 30 <= 180) {
            return (22.5 / 100);
        } else if (this.periodo * 30 <= 360) {
            return (20 / 100);
        } else if (this.periodo * 30 <= 720) {
            return (17.5 / 100);
        } else {
            return (15 / 100);
        }
    }
};

//Esconder gráfico no carregamento da página
document.getElementById('card-grafico').style.display = 'none';

//Eventos dos botões
btnCalcular.addEventListener('click', () => {
    limparBack();
    if (preenchimentoValido() == true) {
        calcularRendimentos(formatarMoeda(inputValorInicial.value), formatarMoeda(inputValorMensal.value), formatarMoeda(inputValorJuros.value), parseInt(inputPeriodo.value));
    }
})

btnLimpar.addEventListener('click', () => {
    limparBack();
    limparFront();
})

//Funções para limpar os dados
function limparFront() {
    inputValorInicial.value = '';
    inputValorMensal.value = '';
    inputValorJuros.value = '';
    inputPeriodo.value = '';
    outputValorTotalFinal.value = '';
    outputValorTotalInvestido.value = '';
    outputValorTotalJuros.value = '';
    outputImpostoRenda.value = '';

    //Esconder gráfico quando clicar no botão limpar
    document.getElementById('card-grafico').style.display = 'none';
}

function limparBack() {
    calculadora.valorInicial = undefined;
    calculadora.valorMensal = undefined;
    calculadora.taxaJuros = undefined;
    calculadora.periodo = undefined;
    calculadora.meses = [["Meses", "Valor Total Investido", "Valor Total Final Bruto"]];
    calculadora.valorTotalFinal = undefined;
    calculadora.valorTotalInvestido = undefined;
    calculadora.valorTotalJuros = undefined;
    calculadora.valorImpostoRenda = undefined;
}

//Funções para calcular os valores
function calcularRendimentos(valorInicial, valorMensal, taxaJuros, periodo) {
    calculadora.valorInicial = valorInicial;
    calculadora.valorMensal = valorMensal;
    calculadora.taxaJuros = taxaJuros / 100;
    if (calculadora.anos == true) {
        calculadora.periodo = periodo * 12;
    } else {
        calculadora.periodo = periodo;
    }

    calculadora.valorTotalInvestido = calcularValorTotalInvestido();
    calculadora.valorTotalJuros = calcularValorTotalJuros();
    calculadora.valorImpostoRenda = calcularValorImpostoRenda();
    calculadora.valorTotalFinal = calcularValorTotalFinal();

    //Mostrar resultados
    mostrarResultados();
}

//Funções de calculos
function calcularValorTotalFinal() {
    return (calculadora.valorTotalInvestido + calculadora.valorTotalJuros - calculadora.valorImpostoRenda);
}
function calcularValorTotalInvestido() {
    return (calculadora.valorInicial + (calculadora.valorMensal * calculadora.periodo));
}
function calcularValorTotalJuros() {
    let valorTotalJuro = parseFloat(0.00);
    let valorTotalInvestido = calculadora.valorInicial;
    let temp;

    for (let index = 0; index <= calculadora.periodo; index++) {
        valorTotalJuro = (valorTotalInvestido * calculadora.taxaJuros);
        temp = valorTotalInvestido + valorTotalJuro;
        calculadora.meses.push([index, parseFloat((calculadora.valorInicial + (calculadora.valorMensal * index)).toFixed(2)), parseFloat(temp.toFixed(2))]);

        valorTotalInvestido += (valorTotalJuro + calculadora.valorMensal);
    }

    console.log(calculadora.meses);

    return temp - calculadora.valorTotalInvestido;
}
function calcularValorImpostoRenda() {
    return (calculadora.valorTotalJuros * calculadora.porcentagemImpostoRenda());
}

//Função para mostrar resultados
function mostrarResultados() {
    //Carregar valores do resultado
    outputValorTotalFinal.value = calculadora.valorTotalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    outputValorTotalInvestido.value = calculadora.valorTotalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    outputValorTotalJuros.value = calculadora.valorTotalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    outputImpostoRenda.value = calculadora.valorImpostoRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    //Carregar gráfico
    google.charts.setOnLoadCallback(drawChart);
    //Mostrar gráfico quando clicar em calcular
    document.getElementById('card-grafico').style.display = 'block';
    //Animação para tela descer e mostrar gráfico
    document.getElementById('card-resultado').scrollIntoView({ behavior: "smooth" });
}

//Função para formatar valores input string BRL para float
function formatarMoeda(valor) {
    if (valor === "") {
        valor = "0";
    } else {
        valor = valor.replace(/["."]/g, "");
        valor = valor.replace(",", ".");
        valor = parseFloat(valor);
    }
    return valor;
}

//Gráfico - GOOGLE LINE CHART
google.charts.load('current', { 'packages': ['corechart'] });

window.onresize = doALoadOfStuff; //Deixar o gráfico responsivo
function doALoadOfStuff() {
    drawChart();
}

function drawChart() {
    var data = google.visualization.arrayToDataTable(calculadora.meses);

    var options = {
        title: 'Gráfico do Investimento',
        backgroundColor: '#FDF9F9',
        curveType: 'function',
        legend: { position: 'bottom' }
    };


    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

//Funções do dropdown do período
function escreveAno() {
    document.getElementById("dropBox").innerHTML = "Anos";
    calculadora.anos = true;
}

function escreveMes() {
    document.getElementById("dropBox").innerHTML = "Meses";
    calculadora.anos = false;
}

//Função para validar preenchimento dos dados
function preenchimentoValido() {
    if (inputValorInicial.value == undefined || inputValorInicial.value == "") {
        alert("Preencha corretamente o valor inicial.");
        return false;
    } else if (inputValorMensal.value == undefined || inputValorMensal.value == "") {
        alert("Preencha corretamente o valor mensal.");
        return false;
    } else if (inputValorJuros.value == undefined || inputValorJuros.value == "") {
        alert("Preencha corretamente a taxa de juros.");
        return false;
    } else if (inputPeriodo.value == 0 || inputPeriodo.value == undefined || inputPeriodo.value == "") {
        alert("Preencha corretamente o período. (Deve ser maior que zero)");
        return false;
    } else {
        return true;
    }
}