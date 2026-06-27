package ufpi.ivangusthavo.mybar.model;


import jakarta.persistence.*;
import org.springframework.data.domain.Persistable;

import java.math.BigDecimal;

@Entity
@Table(name = "tipo_item")
public class TipoItem implements Persistable<Integer> {
    @Id
    @Column(name = "codigo")
    private Integer codigo;

    @Column(name = "descricao", nullable = false)
    private String descricao;

    @Column(name="gorjeta", precision = 5, scale = 2, nullable = false)
    private BigDecimal gorjeta;

    @Column(name = "cozinha", nullable = false)
    private Boolean cozinha;

    @Column(name="ativo", nullable = false)
    private Boolean ativo = true;

    @Transient
    private boolean isNovo = true;

    @Override
    public Integer getId(){
        return this.codigo;
    }

    @Override
    public boolean isNew() {
        return this.isNovo;
    }

    @PostPersist
    @PostLoad
    public void marcarComoAntigo(){
        this.isNovo = false;
    }

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

    public BigDecimal getGorjeta() {
        return gorjeta;
    }

    public void setGorjeta(BigDecimal gorjeta) {
        this.gorjeta = gorjeta;
    }

    public Boolean getCozinha() {
        return cozinha;
    }

    public void setCozinha(Boolean cozinha) {
        this.cozinha = cozinha;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public boolean isNovo() {
        return isNovo;
    }

    public void setNovo(boolean novo) {
        isNovo = novo;
    }

}
