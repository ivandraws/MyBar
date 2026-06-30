package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ufpi.ivangusthavo.mybar.model.Pagamento;

import java.util.List;

public interface IPagamento extends JpaRepository<Pagamento, Long> {
    List<Pagamento> findByConta_Id(Long contaId);
}
