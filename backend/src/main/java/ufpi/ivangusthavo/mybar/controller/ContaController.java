package ufpi.ivangusthavo.mybar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.model.Conta;
import ufpi.ivangusthavo.mybar.service.ContaService;

import java.util.List;

@RestController
@RequestMapping("/contas")
public class ContaController {

    @Autowired
    private ContaService contaService;

    @PostMapping
    public ResponseEntity<Conta> abrirConta(
            @RequestBody Conta novaConta,
            @RequestParam String codigoGarcom,
            @RequestParam String senha) {

        return ResponseEntity.status(201)
                .body(contaService.abrirConta(novaConta, codigoGarcom, senha));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Conta> buscarConta(@PathVariable Long id) {
        return ResponseEntity.ok(contaService.buscarConta(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Conta> alterarConta(
            @PathVariable Long id,
            @RequestBody Conta conta,
            @RequestParam String codigoGarcom,
            @RequestParam String senha) {

        conta.setId(id);
        return ResponseEntity.ok(contaService.alterarConta(conta, codigoGarcom, senha));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirConta(@PathVariable Long id) {
        contaService.excluirConta(id);
        return ResponseEntity.status(204).build();
    }

    @GetMapping
    public ResponseEntity<List<Conta>> listarContas() {
        return ResponseEntity.ok(contaService.listarContas());
    }
}