package ufpi.ivangusthavo.mybar.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table
public class Conta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public int numero;

    public boolean status;

    public LocalDate dataAbertura;

    public LocalTime horaAbertura;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;
    public Conta(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public LocalDate getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDate dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public LocalTime getHoraAbertura() {
        return horaAbertura;
    }

    public void setHoraAbertura(LocalTime horaAbertura) {
        this.horaAbertura = horaAbertura;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }
}
