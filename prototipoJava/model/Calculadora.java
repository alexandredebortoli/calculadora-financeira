package model;

public class Calculadora {
    //Dados de entrada
    private float valorInicialInvestido;
    private float valorMensalInvestido;
    private float rendimentoMensal;
    private int periodoMensal;
    //Dados Gerados
    private float valorTotalInvestido;
    private float valorTotalJuros;
    private float valorImpostoRenda;
    private float valorTotalFinal;

    //Construtor para valores reset
    public Calculadora() {
        this.valorInicialInvestido = 0.00f;
        this.valorMensalInvestido = 0.00f;
        this.rendimentoMensal = 0.00f;
        this.periodoMensal = 0;
    }

    //Getters e Setters
    public float getValorInicialInvestido() {
        return this.valorInicialInvestido;
    }

    public void setValorInicialInvestido(float valorInicialInvestido) {
        this.valorInicialInvestido = valorInicialInvestido;
    }

    public float getValorMensalInvestido() {
        return this.valorMensalInvestido;
    }

    public void setValorMensalInvestido(float valorMensalInvestido) {
        this.valorMensalInvestido = valorMensalInvestido;
    }

    public float getRendimentoMensal() {
        return this.rendimentoMensal;
    }

    public void setRendimentoMensal(float rendimentoMensal) {
        this.rendimentoMensal = rendimentoMensal;
    }

    public int getPeriodoMensal() {
        return this.periodoMensal;
    }

    public void setPeriodoMensal(int periodoMensal) {
        this.periodoMensal = periodoMensal;
    }

    public float getValorTotalInvestido() {
        return this.valorTotalInvestido;
    }

    public void setValorTotalInvestido(float valorTotalInvestido) {
        this.valorTotalInvestido = valorTotalInvestido;
    }

    public float getValorTotalJuros() {
        return this.valorTotalJuros;
    }

    public void setValorTotalJuros(float valorTotalJuros) {
        this.valorTotalJuros = valorTotalJuros;
    }

    public float getValorImpostoRenda() {
        return this.valorImpostoRenda;
    }

    public void setValorImpostoRenda(float valorImpostoRenda) {
        this.valorImpostoRenda = valorImpostoRenda;
    }

    public float getValorTotalFinal() {
        return this.valorTotalFinal;
    }

    public void setValorTotalFinal(float valorTotalFinal) {
        this.valorTotalFinal = valorTotalFinal;
    }

}