package com.ict304.banque.repository;

import org.springframework.stereotype.Repository;

import com.ict304.banque.model.Compte;

import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface CompteRepository extends JpaRepository<Compte, Long> {

}
