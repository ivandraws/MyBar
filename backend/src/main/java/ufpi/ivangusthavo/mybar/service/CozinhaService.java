package ufpi.ivangusthavo.mybar.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import ufpi.ivangusthavo.mybar.model.ItemConta;
import ufpi.ivangusthavo.mybar.repository.ItemContaRepository; // Assumindo que você criou a interface com este padrão

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class CozinhaService {

    @Autowired
    private ItemContaRepository itemContaRepository;

    @Transactional
    public ItemConta receberPedido(Long idItemConta) {
        ItemConta item = itemContaRepository.findById(idItemConta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));

        // Valida se o item realmente pertence à cozinha
        if (!item.getItemCardapio().getTipoItem().getCozinha()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Este item não é de preparo da cozinha.");
        }

        // Registra o recebimento (Status passa a ser "Recebido")
        item.setDataRecebimentoCozinha(LocalDate.now());
        item.setHoraRecebimentoCozinha(LocalTime.now());

        return itemContaRepository.save(item);
    }

    @Transactional
    public ItemConta entregarPedido(Long idItemConta) {
        ItemConta item = itemContaRepository.findById(idItemConta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Item não encontrado."));

        // Não pode entregar se não tiver recebido antes
        if (item.getDataRecebimentoCozinha() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O pedido precisa ser recebido antes de ser entregue.");
        }

        // Registra a entrega (Status passa a ser "Entregue" pela cozinha)
        item.setDataEntregaCozinha(LocalDate.now());
        item.setHoraEntregaCozinha(LocalTime.now());

        return itemContaRepository.save(item);
    }
}