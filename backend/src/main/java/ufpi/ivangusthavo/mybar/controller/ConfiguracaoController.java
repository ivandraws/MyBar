package ufpi.ivangusthavo.mybar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.model.Configuracao;
import ufpi.ivangusthavo.mybar.model.ModoOperacao;
import ufpi.ivangusthavo.mybar.service.ConfiguracaoService;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/configuracao")
public class ConfiguracaoController {
    private ConfiguracaoService configuracaoService;

    public ConfiguracaoController(ConfiguracaoService configuracaoService){
        this.configuracaoService = configuracaoService;
    }

    @GetMapping
    public ResponseEntity<Configuracao> buscarAtual()
    {
        return ResponseEntity.status(200).body(configuracaoService.getConfig());
    }
    @PutMapping("/ingresso")
    public ResponseEntity<Configuracao> atualizarIngresso(@RequestParam BigDecimal masc, @RequestParam BigDecimal fem)
    {
        return ResponseEntity.status(201).body(configuracaoService.atualizarValoresIngresso(masc, fem));
    }

    @PutMapping("/operation")
    public ResponseEntity<Configuracao> atualizarOperacao(@RequestParam ModoOperacao op){
        return ResponseEntity.status(201).body(configuracaoService.alterarModoOperacao(op));
    }

}
