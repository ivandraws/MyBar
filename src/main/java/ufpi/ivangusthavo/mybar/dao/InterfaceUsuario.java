package ufpi.ivangusthavo.mybar.dao;

import org.springframework.data.repository.CrudRepository;
import ufpi.ivangusthavo.mybar.model.Usuario;

public interface InterfaceUsuario extends CrudRepository<Usuario, Integer> {
}
