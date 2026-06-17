package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.repository.CrudRepository;
import ufpi.ivangusthavo.mybar.model.Usuario;

public interface InterfaceUsuario extends CrudRepository<Usuario, Integer> {
}
