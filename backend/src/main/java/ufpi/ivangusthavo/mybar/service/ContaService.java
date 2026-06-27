package ufpi.ivangusthavo.mybar.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ufpi.ivangusthavo.mybar.model.Conta;
import ufpi.ivangusthavo.mybar.repository.IConta;
@Service
public class ContaService {
    @Autowired
    private IConta iConta;

    @Transactional
    public Conta abrirConta(Conta novaConta){

        return novaConta;
    }

}
