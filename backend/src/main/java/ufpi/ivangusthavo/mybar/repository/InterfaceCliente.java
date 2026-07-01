package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ufpi.ivangusthavo.mybar.model.Cliente;

import java.util.Optional;

@Repository
public interface InterfaceCliente extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByCpf(String cpf);
}
