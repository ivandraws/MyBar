package ufpi.ivangusthavo.mybar.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Objects;

@Entity
@Table(name = "itens_conta")
public class ItemConta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_id", nullable = false)
    private Conta conta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_cardapio_id", nullable = false)
    private ItemCardapio itemCardapio;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true;

    // Relacionamentos com Usuário para rastreabilidade
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quem_lancou_id", nullable = false)
    private Usuario quemLancou;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quem_removeu_id")
    private Usuario quemRemoveu; // Pode ser nulo, pois o item pode nunca ser removido

    // Fluxo de tempo e status
    @Column(name = "data_solicitacao", nullable = false, updatable = false)
    private LocalDate dataSolicitacao;

    @Column(name = "hora_solicitacao", nullable = false, updatable = false)
    private LocalTime horaSolicitacao;

    @Column(name = "data_recebimento_cozinha")
    private LocalDate dataRecebimentoCozinha;

    @Column(name = "hora_recebimento_cozinha")
    private LocalTime horaRecebimentoCozinha;

    @Column(name = "data_entrega_cozinha")
    private LocalDate dataEntregaCozinha;

    @Column(name = "hora_entrega_cozinha")
    private LocalTime horaEntregaCozinha;

    @Column(name = "data_recebimento_bar")
    private LocalDate dataRecebimentoBar;

    @Column(name = "hora_recebimento_bar")
    private LocalTime horaRecebimentoBar;

    @Column(name = "data_entrega_bar")
    private LocalDate dataEntregaBar;

    @Column(name = "hora_entrega_bar")
    private LocalTime horaEntregaBar;

    public ItemConta() {
    }

    @PrePersist
    protected void onPrePersist() {
        this.dataSolicitacao = LocalDate.now();
        this.horaSolicitacao = LocalTime.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Conta getConta() { return conta; }
    public void setConta(Conta conta) { this.conta = conta; }

    public ItemCardapio getItemCardapio() { return itemCardapio; }
    public void setItemCardapio(ItemCardapio itemCardapio) { this.itemCardapio = itemCardapio; }

    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }

    public Boolean getAtivo() { return ativo; }
    public void setAtivo(Boolean ativo) { this.ativo = ativo; }

    public Usuario getQuemLancou() { return quemLancou; }
    public void setQuemLancou(Usuario quemLancou) { this.quemLancou = quemLancou; }

    public Usuario getQuemRemoveu() { return quemRemoveu; }
    public void setQuemRemoveu(Usuario quemRemoveu) { this.quemRemoveu = quemRemoveu; }

    public LocalDate getDataSolicitacao() { return dataSolicitacao; }
    public void setDataSolicitacao(LocalDate dataSolicitacao) { this.dataSolicitacao = dataSolicitacao; }

    public LocalTime getHoraSolicitacao() { return horaSolicitacao; }
    public void setHoraSolicitacao(LocalTime horaSolicitacao) { this.horaSolicitacao = horaSolicitacao; }

    public LocalDate getDataRecebimentoCozinha() { return dataRecebimentoCozinha; }
    public void setDataRecebimentoCozinha(LocalDate dataRecebimentoCozinha) { this.dataRecebimentoCozinha = dataRecebimentoCozinha; }

    public LocalTime getHoraRecebimentoCozinha() { return horaRecebimentoCozinha; }
    public void setHoraRecebimentoCozinha(LocalTime horaRecebimentoCozinha) { this.horaRecebimentoCozinha = horaRecebimentoCozinha; }

    public LocalDate getDataEntregaCozinha() { return dataEntregaCozinha; }
    public void setDataEntregaCozinha(LocalDate dataEntregaCozinha) { this.dataEntregaCozinha = dataEntregaCozinha; }

    public LocalTime getHoraEntregaCozinha() { return horaEntregaCozinha; }
    public void setHoraEntregaCozinha(LocalTime horaEntregaCozinha) { this.horaEntregaCozinha = horaEntregaCozinha; }

    public LocalDate getDataRecebimentoBar() { return dataRecebimentoBar; }
    public void setDataRecebimentoBar(LocalDate dataRecebimentoBar) { this.dataRecebimentoBar = dataRecebimentoBar; }

    public LocalTime getHoraRecebimentoBar() { return horaRecebimentoBar; }
    public void setHoraRecebimentoBar(LocalTime horaRecebimentoBar) { this.horaRecebimentoBar = horaRecebimentoBar; }

    public LocalDate getDataEntregaBar() { return dataEntregaBar; }
    public void setDataEntregaBar(LocalDate dataEntregaBar) { this.dataEntregaBar = dataEntregaBar; }

    public LocalTime getHoraEntregaBar() { return horaEntregaBar; }
    public void setHoraEntregaBar(LocalTime horaEntregaBar) { this.horaEntregaBar = horaEntregaBar; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemConta itemConta = (ItemConta) o;
        return Objects.equals(id, itemConta.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}