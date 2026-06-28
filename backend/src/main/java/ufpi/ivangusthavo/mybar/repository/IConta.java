package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ufpi.ivangusthavo.mybar.model.Conta;
import ufpi.ivangusthavo.mybar.model.StatusConta;

import java.util.Optional;

public interface IConta extends JpaRepository<Conta, Integer> {
    boolean existsByCliente_CpfAndStatus(String cpf, StatusConta status);

    boolean existsByNumeroAndStatus(int numero, StatusConta status);

    // Adicionado para os próximos passos (Lançamento de itens na conta aberta)
    Optional<Conta> findByNumeroAndStatus(int numero, StatusConta status);

}
