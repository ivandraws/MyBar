package ufpi.ivangusthavo.mybar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ufpi.ivangusthavo.mybar.model.TipoItem;

import java.util.List;

public interface ITipoItem extends JpaRepository<TipoItem, Integer> {
    List<TipoItem> findByAtivoTrue();
}
