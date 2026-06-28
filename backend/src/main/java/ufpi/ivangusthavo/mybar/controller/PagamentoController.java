package ufpi.ivangusthavo.mybar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.model.Pagamento;
import ufpi.ivangusthavo.mybar.service.PagamentoService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/pagamentos")
public class PagamentoController {

    @Autowired
    private PagamentoService pagamentoService;

    @PostMapping("/{contaId}")
    public ResponseEntity<Pagamento> registrarPagamento(
            @PathVariable Long contaId,
            @RequestBody Pagamento pagamento,
            @RequestParam String codigoGarcom,
            @RequestParam String senha) {

        return ResponseEntity.status(201)
                .body(pagamentoService.registrarPagamento(contaId, pagamento, codigoGarcom, senha));
    }

    @DeleteMapping("/{pagamentoId}")
    public ResponseEntity<?> excluirPagamento(
            @PathVariable Long pagamentoId,
            @RequestParam String usuarioAdmin,
            @RequestParam String senha) {

        pagamentoService.excluirPagamento(pagamentoId, usuarioAdmin, senha);
        return ResponseEntity.status(204).build();
    }

    @GetMapping("/{contaId}/total")
    public ResponseEntity<BigDecimal> totalPagamentos(@PathVariable Long contaId) {
        return ResponseEntity.ok(pagamentoService.somarPagamentos(contaId));
    }
}