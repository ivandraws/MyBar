package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ufpi.ivangusthavo.mybar.model.Usuario;

public interface InterfaceUsuario extends JpaRepository<Usuario, Integer> {
}
