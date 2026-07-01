package ufpi.ivangusthavo.mybar.repository;

import ufpi.ivangusthavo.mybar.model.ItemConta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemContaRepository extends JpaRepository<ItemConta, Long> {

    // Método essencial para verificar se um Item de Cardápio já foi pedido alguma vez (bloqueia exclusão física)
    boolean existsByItemCardapioCodigo(Integer codigoItemCardapio);

    // Método para buscar todos os itens ativos de uma conta específica
    List<ItemConta> findByContaIdAndAtivoTrue(Long contaId);
}