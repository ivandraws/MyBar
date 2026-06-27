package ufpi.ivangusthavo.mybar.controller;

import ufpi.ivangusthavo.mybar.model.ItemCardapio;
import ufpi.ivangusthavo.mybar.service.ItemCardapioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/itens-cardapio")
public class ItemCardapioController {

    private final ItemCardapioService itemCardapioService;

    public ItemCardapioController(ItemCardapioService itemCardapioService) {
        this.itemCardapioService = itemCardapioService;
    }

    @GetMapping
    public ResponseEntity<List<ItemCardapio>> listar(@RequestParam(required = false) String descricao) {
        return ResponseEntity.ok(itemCardapioService.pesquisar(descricao));
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<ItemCardapio> buscarPorCodigo(@PathVariable Integer codigo) {
        return ResponseEntity.ok(itemCardapioService.buscarPorCodigo(codigo));
    }

    @PostMapping
    public ResponseEntity<ItemCardapio> criar(@RequestBody ItemCardapio itemCardapio) {
        itemCardapio.marcarComoAntigo(); // Garante o isNew() configurado para INSERT manual
        ItemCardapio novoItem = itemCardapioService.salvar(itemCardapio);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoItem);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<ItemCardapio> atualizar(@PathVariable Integer codigo, @RequestBody ItemCardapio itemCardapio) {
        itemCardapio.setCodigo(codigo);
        ItemCardapio itemAtualizado = itemCardapioService.salvar(itemCardapio);
        return ResponseEntity.ok(itemAtualizado);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluir(@PathVariable Integer codigo) {
        itemCardapioService.excluir(codigo);
        return ResponseEntity.noContent().build();
    }
}
