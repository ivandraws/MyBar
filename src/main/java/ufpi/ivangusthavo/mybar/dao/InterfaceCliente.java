package ufpi.ivangusthavo.mybar.dao;

import org.springframework.data.repository.CrudRepository;
import ufpi.ivangusthavo.mybar.model.Cliente;

public interface InterfaceCliente extends CrudRepository<Cliente, Integer> {
}
