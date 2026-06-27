package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ufpi.ivangusthavo.mybar.model.ItemCardapio;

import java.util.List;

public interface ItemCardapioRepository extends JpaRepository<ItemCardapio, Integer> {
    // Traz apenas os itens que não sofreram "soft delete"
    List<ItemCardapio> findByAtivoTrue();

    // Verifica se existe algum Item de Cardápio vinculado a um determinado código de Tipo
    boolean existsByTipoItemCodigo(Integer codigoTipoItem);
}
