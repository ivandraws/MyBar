package ufpi.ivangusthavo.mybar.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "configuracao")
public class Configuracao {
    @Id
    private Integer id = 1;
    @Column(name = "valor_ingresso_masc", nullable = false)
    private BigDecimal valorIngressoMasc;
    @Column(name = "valor_ingresso_fem", nullable = false)
    private BigDecimal valorIngressoFemin;
    @Enumerated(EnumType.STRING)
    @Column(name = "modo_operacao", nullable = false)
    private ModoOperacao modoOperacao;
    @Column(name = "data")
    private LocalDate data;
    @Column(name = "hora")
    private LocalTime hora;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getValorIngressoMasc() {
        return valorIngressoMasc;
    }

    public void setValorIngressoMasc(BigDecimal valorIngressoMasc) {
        this.valorIngressoMasc = valorIngressoMasc;
    }

    public BigDecimal getValorIngressoFemin() {
        return valorIngressoFemin;
    }

    public void setValorIngressoFemin(BigDecimal valorIngressoFemin) {
        this.valorIngressoFemin = valorIngressoFemin;
    }

    public ModoOperacao getModoOperacao() {
        return modoOperacao;
    }

    public void setModoOperacao(ModoOperacao modoOperacao) {
        this.modoOperacao = modoOperacao;
    }

    public LocalDate getData() {
        return data;
    }

    public void setData(LocalDate data) {
        this.data = data;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }
}
