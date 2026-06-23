package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ufpi.ivangusthavo.mybar.model.Configuracao;


public interface IConfiguracao extends JpaRepository<Configuracao, Integer> {
}
