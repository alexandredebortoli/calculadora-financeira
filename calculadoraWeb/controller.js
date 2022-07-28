var valorInicialInvestido;
var valorMensalInvestido;
var rendimentoMensal;
var periodoMensal;
var valorTotalFinal;
var valorTotalInvestido;
var valorTotalJuros;
var valorImpostoRenda;
var boolMes = true;
var meses = [["Meses", "Valor Total Investido", "Valor Total Final Bruto"]];

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

document.getElementById('card-grafico').style.display = "none";

calcular.addEventListener("click", () => {
    limparJs();
    if(preenchimentoValido(vli.value, tj.value, p.value, vlm.value) == true) {
        calculaPorMes(formatarMoeda(vli.value), formatarMoeda(tj.value), parseFloat(p.value), formatarMoeda(vlm.value));
    }
})

limpar.addEventListener("click", () => {
    limpa();
    limparJs();
})

function preenchimentoValido(ivli, itj, ip, ivlm) {
    if(ivli == undefined || ivli == "") {
        alert("Preencha corretamente o valor inicial.");
        return false;
    } else if(ivlm == undefined || ivlm == "") {
        alert("Preencha corretamente o valor mensal.");
        return false;
    } else if(itj == undefined || itj == "") {
        alert("Preencha corretamente a taxa de juros.");
        return false;
    } else if(ip == 0 || ip == undefined || ip == "") {
        if(ip == 0) {
            alert("O período deve ser maior que zero.");
        } else {
            alert("Preencha corretamente o período.");
        }
        return false;
    } else {
        return  true;
    }
}

function limpa() {
    vli.value = "";
    vlm.value = "";
    tj.value = "";
    p.value = "";
    textVli.value = "";
    textVi.value = "";
    textTj.value = "";
    textIr.value = "";

    document.getElementById('card-grafico').style.display = "none";
}

function limparJs() {
    valorInicialInvestido=null;
    valorMensalInvestido=null;
    rendimentoMensal=null;
    periodoMensal=null;
    valorTotalFinal=null;
    valorTotalInvestido=null;
    valorTotalJuros=null;
    valorImpostoRenda=null;
    meses=null;
    meses = [["Meses", "Valor Total Investido", "Valor Total Final Bruto"]];

}

function calculaPorMes(cVli, cTj, cP, cVlm) {
    var periodo = 0;

    if (boolMes == false) {
        cP = cP * 12;
    }

    while (cP - 1 >= periodo) {
        var mes = [];
        periodo++;
        mes.push(periodo);
        if(cTj != 0) {
            valorTotalFinal = calculaValorTotalFinalBruto(cVli, cTj, periodo, cVlm);
            valorTotalInvestido = calculaTotalInvestido(cVli, cVlm, periodo);
            valorTotalJuros = calculaTotalJuros(valorTotalFinal, valorTotalInvestido);
        } else {
            valorTotalFinal = cVli + (periodo * cVlm);
            valorTotalInvestido = valorTotalFinal;
            valorTotalJuros = 0;
        }
        mes.push(parseFloat((valorTotalFinal - valorTotalJuros).toFixed(2)));
        mes.push(parseFloat(valorTotalFinal.toFixed(2)));
        meses.push(mes);
    }
    textVi.value = valorTotalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    textTj.value = valorTotalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    valorImpostoRenda = calculaTotalImpostoRenda(cP, valorTotalJuros);
    textIr.value = valorImpostoRenda.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    valorTotalFinal = calculaValorTotalLiquido(valorTotalInvestido, valorTotalJuros, valorImpostoRenda);
    textVli.value = valorTotalFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    document.getElementById('card-grafico').style.display = "block";
    google.charts.setOnLoadCallback(drawChart);
    document.getElementById('card-resultado').scrollIntoView({ behavior: "smooth" });
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

window.onresize = doALoadOfStuff;
function doALoadOfStuff() {
    drawChart();
}

function drawChart() {
    var data = google.visualization.arrayToDataTable(meses);

    var options = {
        title: 'Gráfico do Investimento',
        backgroundColor: '#FDF9F9',
        curveType: 'function',
        legend: { position: 'bottom' }
    };


    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}

//funções do dropbox
function escreveAno() {
    document.getElementById("dropBox").innerHTML = "Anos";
    boolMes = false;
}

function escreveMes() {
    document.getElementById("dropBox").innerHTML = "Meses";
    boolMes = true;
}