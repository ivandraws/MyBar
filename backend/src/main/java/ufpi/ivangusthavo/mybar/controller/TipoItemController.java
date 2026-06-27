package ufpi.ivangusthavo.mybar.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ufpi.ivangusthavo.mybar.model.TipoItem;
import ufpi.ivangusthavo.mybar.service.TipoItemService;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-item")
public class TipoItemController {

    private final TipoItemService tipoItemService;

    public TipoItemController(TipoItemService tipoItemService) {
        this.tipoItemService = tipoItemService;
    }

    // GET /api/tipos-item?descricao=Bebida
    @GetMapping
    public ResponseEntity<List<TipoItem>> listar(@RequestParam(required = false) String descricao) {
        return ResponseEntity.ok(tipoItemService.pesquisar(descricao));
    }

    // GET /api/tipos-item/10
    @GetMapping("/{codigo}")
    public ResponseEntity<TipoItem> buscarPorCodigo(@PathVariable Integer codigo) {
        return ResponseEntity.ok(tipoItemService.buscarPorCodigo(codigo));
    }

    // POST /api/tipos-item
    @PostMapping
    public ResponseEntity<TipoItem> criar(@RequestBody TipoItem tipoItem) {
        // Força a classe a ser entendida como nova para garantir o INSERT
        tipoItem.marcarComoAntigo(); // Reset se necessário, mas o padrão já é true na criação
        TipoItem novoTipo = tipoItemService.salvar(tipoItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTipo);
    }

    // PUT /api/tipos-item/10
    @PutMapping("/{codigo}")
    public ResponseEntity<TipoItem> atualizar(@PathVariable Integer codigo, @RequestBody TipoItem tipoItem) {
        // Garante que o código da URL é o mesmo do objeto a ser alterado
        tipoItem.setCodigo(codigo);
        // O Hibernate fará o UPDATE porque o ID já existe
        TipoItem tipoAtualizado = tipoItemService.salvar(tipoItem);
        return ResponseEntity.ok(tipoAtualizado);
    }

    // DELETE /api/tipos-item/10
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluir(@PathVariable Integer codigo) {
        tipoItemService.excluir(codigo);
        return ResponseEntity.noContent().build();
    }
}
