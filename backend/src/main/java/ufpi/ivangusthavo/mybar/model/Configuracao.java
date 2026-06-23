package ufpi.ivangusthavo.mybar.model;

import java.time.LocalDate;
import java.time.LocalTime;

public class Configuracao {
    private double valorIngMasc;
    private double valorIngFem;
    private int operation;
    private LocalDate dia;
    private LocalTime hora;

    public double getValorIngMasc() {
        return valorIngMasc;
    }

    public void setValorIngMasc(double valorIngMasc) {
        this.valorIngMasc = valorIngMasc;
    }

    public double getValorIngFem() {
        return valorIngFem;
    }

    public void setValorIngFem(double valorIngFem) {
        this.valorIngFem = valorIngFem;
    }

    public int getOperation() {
        return operation;
    }

    public void setOperation(int operation) {
        this.operation = operation;
    }

    public LocalDate getDia() {
        return dia;
    }

    public void setDia(LocalDate dia) {
        this.dia = dia;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }
}
