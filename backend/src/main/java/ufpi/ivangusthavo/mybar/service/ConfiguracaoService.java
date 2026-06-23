package ufpi.ivangusthavo.mybar.service;


import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import ufpi.ivangusthavo.mybar.model.Configuracao;
import ufpi.ivangusthavo.mybar.model.ModoOperacao;
import ufpi.ivangusthavo.mybar.repository.IConfiguracao;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class ConfiguracaoService {
    private IConfiguracao repository;

    public ConfiguracaoService(IConfiguracao repository){
        this.repository = repository;
    }

    public Configuracao getConfig(){
        return repository.findById(1).orElseGet(() -> {
            Configuracao configInicial = new Configuracao();
            configInicial.setValorIngressoMasc(new BigDecimal("50.00"));
            configInicial.setValorIngressoFemin(new BigDecimal("10.00"));
            configInicial.setModoOperacao(ModoOperacao.GESTAO);
            return repository.save(configInicial);
        });
    }
@Transactional
public Configuracao atualizarValoresIngresso(BigDecimal masc, BigDecimal fem) {
    Configuracao config = getConfig();
    config.setValorIngressoMasc(masc);
    config.setValorIngressoFemin(fem);
    return repository.save(config);
}

    @Transactional
    public Configuracao alterarModoOperacao(ModoOperacao novoModo) {
        Configuracao config = getConfig();
        config.setModoOperacao(novoModo);
        config.setData(LocalDate.now());
        config.setHora(LocalTime.now());
        return repository.save(config);
    }
}
