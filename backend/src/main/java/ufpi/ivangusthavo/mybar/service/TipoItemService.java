package ufpi.ivangusthavo.mybar.service;

import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ufpi.ivangusthavo.mybar.model.TipoItem;
import ufpi.ivangusthavo.mybar.repository.ITipoItem;
import ufpi.ivangusthavo.mybar.repository.ItemCardapioRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TipoItemService {
    private final ITipoItem tipoItemRepository;
    private final ItemCardapioRepository itemCardapioRepository;

    public TipoItemService(ITipoItem tipoItemRepository, ItemCardapioRepository itemCardapioRepository) {
        this.tipoItemRepository = tipoItemRepository;
        this.itemCardapioRepository = itemCardapioRepository;
    }

    // Atende ao comando "Pesquisar" da tela, buscando por descrição
    public List<TipoItem> pesquisar(String descricao) {
        List<TipoItem> todosAtivos = tipoItemRepository.findByAtivoTrue();

        if (descricao != null && !descricao.trim().isEmpty()) {
            return todosAtivos.stream()
                    .filter(t -> t.getDescricao().toLowerCase().contains(descricao.toLowerCase()))
                    .collect(Collectors.toList());
        }
        return todosAtivos;
    }

    public TipoItem buscarPorCodigo(Integer codigo) {
        return tipoItemRepository.findById(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tipo de Item não encontrado."));
    }

    @Transactional
    public TipoItem salvar(TipoItem tipoItem) {
        // Como o Persistable lida com a flag isNovo internamente,
        // o Spring Data JPA saberá fazer INSERT ou UPDATE corretamente.
        return tipoItemRepository.save(tipoItem);
    }

    @Transactional
    public void excluir(Integer codigo) {
        TipoItem tipoItem = buscarPorCodigo(codigo);

        // para verificar se existem itens associados a este tipo.
        boolean possuiItensAssociados = verificarSePossuiItensNoCardapio(codigo);

        if (possuiItensAssociados) {
            // Se houver itens, apenas desativa impedindo a visualização
            tipoItem.setAtivo(false);
            tipoItemRepository.save(tipoItem);
        } else {
            // Se não houver, exclui definitivamente do banco
            tipoItemRepository.delete(tipoItem);
        }
    }

    private boolean verificarSePossuiItensNoCardapio(Integer codigo) {
        // Devolve true se o banco encontrar qualquer item atrelado a este tipo
        return itemCardapioRepository.existsByTipoItemCodigo(codigo);
    }
}

