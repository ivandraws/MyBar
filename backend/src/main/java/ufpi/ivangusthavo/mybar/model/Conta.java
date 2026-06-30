package ufpi.ivangusthavo.mybar.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Table(name = "conta")
public class Conta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero", nullable = false)
    private Integer numero;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private StatusConta status;

    @Column(name = "data_abertura", nullable = false, updatable = false)
    private LocalDate dataAbertura;

    @Column(name = "hora_abertura", nullable = false, updatable = false)
    private LocalTime horaAbertura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // Relacionamento adicionado conforme o diagrama
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "garcon_abertura_id", nullable = false)
    private Usuario garconAbertura;

    public Conta() {
    }

    // Callback para preencher data e hora automaticamente na criação
    @PrePersist
    protected void onPrePersist() {
        this.dataAbertura = LocalDate.now();
        this.horaAbertura = LocalTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public StatusConta getStatus() {
        return status;
    }

    public void setStatus(StatusConta status) {
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

    public Usuario getGarconAbertura() {
        return garconAbertura;
    }

    public void setGarconAbertura(Usuario garconAbertura) {
        this.garconAbertura = garconAbertura;
    }

    // Equals e HashCode baseados no ID
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Conta conta = (Conta) o;
        return Objects.equals(id, conta.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}