package ufpi.ivangusthavo.mybar.service;

import ufpi.ivangusthavo.mybar.model.ItemCardapio;
import ufpi.ivangusthavo.mybar.repository.ItemCardapioRepository;
import ufpi.ivangusthavo.mybar.repository.ItemContaRepository; // Novo import
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import ufpi.ivangusthavo.mybar.model.TipoItem;
import ufpi.ivangusthavo.mybar.repository.ITipoItem;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCardapioService {

    private final ItemCardapioRepository itemCardapioRepository;
    private final ItemContaRepository itemContaRepository; // Nova dependência
    private final ITipoItem tipoItemRepository;

    // Construtor atualizado com a injeção do ItemContaRepository
    public ItemCardapioService(ItemCardapioRepository itemCardapioRepository, ItemContaRepository itemContaRepository, ITipoItem tipoItemRepository) {
        this.itemCardapioRepository = itemCardapioRepository;
        this.itemContaRepository = itemContaRepository;
        this.tipoItemRepository = tipoItemRepository;

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
        // 2. A interceptação acontece aqui antes de salvar!

        // Verifica se veio um TipoItem na requisição e se ele tem um ID informado
        if (itemCardapio.getTipoItem() != null && itemCardapio.getTipoItem().getId() != null) {
            Integer tipoId = itemCardapio.getTipoItem().getId();

            // Vai no banco e busca o TipoItem gerenciado pelo Hibernate
            TipoItem tipoGerenciado = tipoItemRepository.findById(tipoId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de Item com o ID " + tipoId + " não existe."));

            // Substitui o objeto "solto" da memória pelo objeto rastreado do banco
            itemCardapio.setTipoItem(tipoGerenciado);
        }

        // Agora o Hibernate reconhece a relação e salva sem disparar o erro 500
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