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


calcular.addEventListener("click",()=>{
    //console.log(vli.value,vlm.value,tj.value,p.value);
    console.log(vli.value,vlm.value,tj.value,p.value);
    calcula();
})

function calcula() {
    valorTotalFinal = calculaValorTotalFinalBruto(vli.value,tj.value,p.value,vlm.value);
    valorTotalInvestido = calculaTotalInvestido(vli.value,vlm.value,p.value);
    textVi.value = valorTotalInvestido;
    valorTotalJuros = calculaTotalJuros(valorTotalFinal,valorTotalInvestido);
    textTj.value = valorTotalJuros;
    valorImpostoRenda = calculaTotalImpostoRenda(p.value,valorTotalJuros,valorImpostoRenda);
    textIr.value = valorImpostoRenda;
    valorTotalFinal = calculaValorTotalLiquido(valorTotalInvestido,valorTotalJuros,valorImpostoRenda);
    textVli.value = valorTotalFinal;
}

//função que calcula o valor final bruto 
function calculaValorTotalFinalBruto(capital,juros,periodo,aporte){
    return (capital * ((1+juros/100) ** periodo)) + (aporte*(((1+juros/100) ** periodo)-1))/(juros/100);
}

//função que calcula o investimento total
function calculaTotalInvestido(valorII,valorMensal,periodo){
    var vI = parseInt(valorII) + periodo * valorMensal;
    return vI;
}

//função que calcula o total de juros gerado
function calculaTotalJuros(valorTotalFinal,valorTotalInvestido){
    return valorTotalFinal - valorTotalInvestido;   
}

//função que calcula o total de imposto de renda
function calculaTotalImpostoRenda(periodo,valorTotalJuros,valorImpostoRenda){
    var diaRetirado = periodo*30;
    //Setando valor da aliquota
    if(diaRetirado <=180){
        return (valorTotalJuros *22.5)/100;
    }else if(diaRetirado <=360){
        return (valorTotalJuros *20)/100;
    }else if(diaRetirado <=720){
        return (valorTotalJuros *17.5)/100;
    }else{
        return (valorTotalJuros *15)/100;
    }  
}
//função para calcular valor final liquido
function calculaValorTotalLiquido(totalInvestido,totalJuros,ir){
    return totalInvestido+totalJuros-ir;
}
