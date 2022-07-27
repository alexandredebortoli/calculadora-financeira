var valorInicialInvestido;
var valorMensalInvestido;
var rendimentoMensal;
var periodoMensal;
var valorTotalFinal;
var valorTotalInvestido;
var valorTotalJuros;
var valorImpostoRenda;

let vli = document.querySelector('#valorInicial');
let vlm = document.querySelector("#valorMensal");
let tj = document.querySelector("#taxaJuros");
let p = document.querySelector("#periodo");
let calcular = document.querySelector("#btn-calcular");
let limpar = document.querySelector("#btn-limpar");
let textVli = document.querySelector("#valorTotalFinal");
let textVi = document.querySelector("#valorTotalInvestido");
let textTj = document.querySelector("#totalJuros");
let textIr = document.querySelector("#impostoRenda");


calcular.addEventListener("click", () => {
    //console.log(vli.value,vlm.value,tj.value,p.value);
    console.log(vli.value, vlm.value, tj.value, p.value);
    calcula();
})

limpar.addEventListener("click", () => {
    limpa();
})

function limpa() {
    vli.value = "";
    vlm.value = "";
    tj.value = "";
    p.value = "";
    textVli.value = "";
    textVi.value = "";
    textTj.value = "";
    textIr.value = "";
}

function calcula() {
    valorTotalFinal = calculaValorTotalFinalBruto(formatarMoeda(vli.value), formatarMoeda(tj.value), p.value, formatarMoeda(vlm.value));
    valorTotalInvestido = calculaTotalInvestido(formatarMoeda(vli.value), formatarMoeda(vlm.value), p.value);
    textVi.value = valorTotalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    valorTotalJuros = calculaTotalJuros(valorTotalFinal, valorTotalInvestido);
    textTj.value = valorTotalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    valorImpostoRenda = calculaTotalImpostoRenda(p.value, valorTotalJuros);
    textIr.value = valorImpostoRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    valorTotalFinal = calculaValorTotalLiquido(valorTotalInvestido, valorTotalJuros, valorImpostoRenda);
    textVli.value = valorTotalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

//função que calcula o valor final bruto  
function calculaValorTotalFinalBruto(capital, juros, periodo, aporte) {
    return (capital * ((1 + juros / 100) ** periodo)) + (aporte * (((1 + juros / 100) ** periodo) - 1)) / (juros / 100);
}

//função que calcula o investimento total
function calculaTotalInvestido(valorII, valorMensal, periodo) {
    var vI = parseInt(valorII) + periodo * valorMensal;
    return vI;
}

//função que calcula o total de juros gerado
function calculaTotalJuros(valorTotalFinal, valorTotalInvestido) {
    return valorTotalFinal - valorTotalInvestido;
}

//função que calcula o total de imposto de renda
function calculaTotalImpostoRenda(periodo, valorTotalJuros) {
    var diaRetirado = periodo * 30;
    //Setando valor da aliquota
    if (diaRetirado <= 180) {
        return (valorTotalJuros * 22.5) / 100;
    } else if (diaRetirado <= 360) {
        return (valorTotalJuros * 20) / 100;
    } else if (diaRetirado <= 720) {
        return (valorTotalJuros * 17.5) / 100;
    } else {
        return (valorTotalJuros * 15) / 100;
    }
}
//função para calcular valor final liquido
function calculaValorTotalLiquido(totalInvestido, totalJuros, ir) {
    return totalInvestido + totalJuros - ir;
}

//FORMATAR INPUT
function formatarMoedaInput(id) {
    var elemento = document.getElementById(id);
    var valor = elemento.value;


    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    elemento.value = valor;
    if (valor == 'NaN') elemento.value = '';
}

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

//GOOGLE LINE CHART
google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Meses', 'Valor Investido', 'Valor Total Final'],
        ['1', 1000.00, 1000],
        ['2', 2000.00, 2500],
        ['3', 3000.00, 4500],
        ['4', 4000.00, 7500]
    ]);

    var options = {
        title: 'Gráfico do Investimento',
        subtitle: 'valor investido e valor total final por mês (R$)',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}