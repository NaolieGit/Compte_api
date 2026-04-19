package com.ict304.banque.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ict304.banque.model.Compte;
import com.ict304.banque.repository.CompteRepository;

import jakarta.transaction.Transactional;

@Service
public class CompteService {

    @Autowired
    private CompteRepository repository;

    // Créer un compte
    public Compte creerCompte(Compte compte) {
        // On peut ajouter une règle : solde initial à 0 par défaut si non précisé
        if (compte.getSolde() < 0) {
            throw new RuntimeException("Le solde initial ne peut pas être négatif");
        }
        return repository.save(compte);
    }

    // Liste de tous les comptes
    public List<Compte> listerTousLesComptes() {
        return repository.findAll();
    }

    // Effectuer un dépôt
    @Transactional
    public Compte deposer(Long id, double montant) {
        if (montant <= 0) {
            throw new RuntimeException("Le montant du dépôt doit être positif");
        }
        
        Compte compte = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));
        
        compte.setSolde(compte.getSolde() + montant);
        return repository.save(compte);
    }

    // Effectuer un retrait
    @Transactional
    public Compte retirer(Long id, double montant) {
        Compte compte = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compte introuvable"));

        if (montant <= 0) {
            throw new RuntimeException("Le montant du retrait doit être positif");
        }
        
        if (compte.getSolde() < montant) {
            throw new RuntimeException("Solde insuffisant pour effectuer ce retrait");
        }

        compte.setSolde(compte.getSolde() - montant);
        return repository.save(compte);
    }
}