package com.build.repository;

import com.build.domain.Sublocation;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Sublocation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SublocationRepository extends JpaRepository<Sublocation,Long> {
    
}
