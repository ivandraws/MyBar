package ufpi.ivangusthavo.mybar.service;

import ufpi.ivangusthavo.mybar.model.ItemCardapio;
import ufpi.ivangusthavo.mybar.repository.ItemCardapioRepository;
import ufpi.ivangusthavo.mybar.repository.ItemContaRepository; // Novo import
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCardapioService {

    private final ItemCardapioRepository itemCardapioRepository;
    private final ItemContaRepository itemContaRepository; // Nova dependência

    // Construtor atualizado com a injeção do ItemContaRepository
    public ItemCardapioService(ItemCardapioRepository itemCardapioRepository, ItemContaRepository itemContaRepository) {
        this.itemCardapioRepository = itemCardapioRepository;
        this.itemContaRepository = itemContaRepository;
    }

    public List<ItemCardapio> pesquisar(String descricao) {
        List<ItemCardapio> todosAtivos = itemCardapioRepository.findByAtivoTrue();

        if (descricao != null && !descricao.trim().isEmpty()) {
            return todosAtivos.stream()
                    .filter(i -> i.getDescricao().toLowerCase().contains(descricao.toLowerCase()))
                    .collect(Collectors.toList());
        }
        return todosAtivos;
    }

    public ItemCardapio buscarPorCodigo(Integer codigo) {
        return itemCardapioRepository.findById(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item de cardápio não encontrado."));
    }

    @Transactional
    public ItemCardapio salvar(ItemCardapio itemCardapio) {
        return itemCardapioRepository.save(itemCardapio);
    }

    @Transactional
    public void excluir(Integer codigo) {
        ItemCardapio item = buscarPorCodigo(codigo);

        // Validação real no banco de dados habilitada
        boolean possuiContasAssociadas = verificarSePossuiContasAssociadas(codigo);

        if (possuiContasAssociadas) {
            item.setAtivo(false);
            itemCardapioRepository.save(item);
        } else {
            itemCardapioRepository.delete(item);
        }
    }

    private boolean verificarSePossuiContasAssociadas(Integer codigo) {
        // Agora o Spring Data vai ao banco verificar se esse item já foi pedido alguma vez
        return itemContaRepository.existsByItemCardapioCodigo(codigo);
    }
}