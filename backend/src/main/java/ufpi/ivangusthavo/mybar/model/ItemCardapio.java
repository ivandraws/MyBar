package ufpi.ivangusthavo.mybar.model;

import jakarta.persistence.*;
import org.springframework.data.domain.Persistable;
import java.math.BigDecimal;
import java.util.Objects;

@Entity
@Table(name = "item_cardapio")
public class ItemCardapio implements Persistable<Integer> {

    @Id
    @Column(name = "codigo", nullable = false, unique = true)
    private Integer codigo;

    @Column(name = "descricao", length = 255, nullable = false)
    private String descricao;

    @Column(name = "valor", precision = 10, scale = 2, nullable = false)
    private BigDecimal valor;

    // Relacionamento definindo que Vários Itens pertencem a Um Tipo (ManyToOne)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_item_codigo", nullable = false)
    private TipoItem tipoItem;

    @Column(name = "ativo", nullable = false)
    private Boolean ativo = true; // Controla o soft delete

    @Transient
    private boolean isNovo = true;

    public ItemCardapio() {
    }


    // Métodos do Persistable para controle de chaves manuais
    @Override
    public Integer getId() {
        return this.codigo;
    }

    @Override
    public boolean isNew() {
        return this.isNovo;
    }

    @PostPersist
    @PostLoad
    public void marcarComoAntigo() {
        this.isNovo = false;
    }

    // Getters e Setters
    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public TipoItem getTipoItem() {
        return tipoItem;
    }

    public void setTipoItem(TipoItem tipoItem) {
        this.tipoItem = tipoItem;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ItemCardapio that = (ItemCardapio) o;
        return Objects.equals(codigo, that.codigo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codigo);
    }
}