package com.ict304.banque.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ict304.banque.model.Compte;
import com.ict304.banque.service.CompteService;

@RestController
@RequestMapping("/api/comptes")
public class CompteController {

    @Autowired
    private CompteService service;

    // Créer un compte : POST http://localhost:8080/api/comptes
    @PostMapping
    public Compte create(@RequestBody Compte compte) {
        return service.creerCompte(compte);
    }

    // Lister tous les comptes : GET http://localhost:8080/api/comptes
    @GetMapping
    public List<Compte> getAll() {
        return service.listerTousLesComptes();
    }

    // Effectuer un dépôt : PUT http://localhost:8080/api/comptes/1/depot?montant=500
    @PutMapping("/{id}/depot")
    public Compte deposer(@PathVariable Long id, @RequestParam double montant) {
        return service.deposer(id, montant);
    }

    // Effectuer un retrait : PUT http://localhost:8080/api/comptes/1/retrait?montant=200
    @PutMapping("/{id}/retrait")
    public Compte retirer(@PathVariable Long id, @RequestParam double montant) {
        return service.retirer(id, montant);
    }
}