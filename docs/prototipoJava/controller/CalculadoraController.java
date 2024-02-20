package controller;

import model.Calculadora;
import view.CalculadoraView;
import java.lang.Math;

public class CalculadoraController {

    public static void calcular(String valorInicial, String valorMensal, String taxaJuros, String periodo) {
        Calculadora calc = new Calculadora();
        try {
            calc.setValorInicialInvestido(Float.parseFloat(valorInicial));
            try {
                calc.setValorMensalInvestido(Float.parseFloat(valorMensal));
                try {
                    calc.setRendimentoMensal(Float.parseFloat(taxaJuros)/100f);
                    try {
                        calc.setPeriodoMensal(Integer.parseInt(periodo));

                        float valorFinalBruto = calcularValorTotalFinalBruto(calc);
                        calc = calcularValorTotalInvestido(calc);
                        calc = calcularValorTotalJuros(calc, valorFinalBruto);
                        calc = calcularValorImpostoRenda(calc);
                        calc = calcularValorTotalFinal(calc);

                        CalculadoraView.resultados(calc);
                    } catch (Exception e) {
                        CalculadoraView.excecao(4);
                    }
                } catch (Exception e) {
                    CalculadoraView.excecao(3);
                }
            } catch (Exception e) {
                CalculadoraView.excecao(2);
            }
        } catch (Exception e) {
            CalculadoraView.excecao(1);
        }
    }

    public static float calcularValorTotalFinalBruto(Calculadora calc) {
        float valorTotalBruto = (float) ((float) (calc.getValorInicialInvestido()*(Math.pow(1+calc.getRendimentoMensal(), calc.getPeriodoMensal())))
        + (calc.getValorMensalInvestido()*(Math.pow(1+calc.getRendimentoMensal(), calc.getPeriodoMensal())-1)/(calc.getRendimentoMensal())));
        return valorTotalBruto;
    }

    public static Calculadora calcularValorTotalInvestido(Calculadora calc) {
        calc.setValorTotalInvestido(calc.getValorInicialInvestido() + calc.getPeriodoMensal()*calc.getValorMensalInvestido());
        return calc;
    }

    public static Calculadora calcularValorTotalJuros(Calculadora calc, float valorFinalBruto) {
        calc.setValorTotalJuros(valorFinalBruto - calc.getValorTotalInvestido());
        return calc;
    }

    public static Calculadora calcularValorImpostoRenda(Calculadora calc) {
        int diaRetirado = calc.getPeriodoMensal()*30;
        if(diaRetirado <= 180) {
            calc.setValorImpostoRenda((22.5f/100f)*calc.getValorTotalJuros());
            return calc;
        } else if(181 <= diaRetirado && diaRetirado <= 360) {
            calc.setValorImpostoRenda((20f/100f)*calc.getValorTotalJuros());
            return calc;
        } else if(361 <= diaRetirado && diaRetirado <= 720) {
            calc.setValorImpostoRenda((17.5f/100f)*calc.getValorTotalJuros());
            return calc;
        } else if(720 < diaRetirado) {
            calc.setValorImpostoRenda((15f/100f)*calc.getValorTotalJuros());
            return calc;
        }
        return calc;
    }

    public static Calculadora calcularValorTotalFinal(Calculadora calc) {
        calc.setValorTotalFinal(calc.getValorTotalInvestido()+calc.getValorTotalJuros()-calc.getValorImpostoRenda());
        return calc;
    }
}