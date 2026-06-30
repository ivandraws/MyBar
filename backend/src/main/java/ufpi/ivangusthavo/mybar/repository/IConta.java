package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ufpi.ivangusthavo.mybar.model.Conta;
import ufpi.ivangusthavo.mybar.model.StatusConta;

public interface IConta extends JpaRepository<Conta, Long> {
    boolean existsByCliente_CpfAndStatus(String cpf, StatusConta status);

    boolean existsByNumeroAndStatus(int numero, StatusConta status);
    boolean existsByNumeroAndStatusAndIdNot(int numero, StatusConta status, Long id);
}
