package com.build.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.build.domain.Sublocation;

import com.build.repository.SublocationRepository;
import com.build.repository.search.SublocationSearchRepository;
import com.build.web.rest.util.HeaderUtil;
import com.build.web.rest.util.PaginationUtil;
import io.swagger.annotations.ApiParam;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Sublocation.
 */
@RestController
@RequestMapping("/api")
public class SublocationResource {

    private final Logger log = LoggerFactory.getLogger(SublocationResource.class);

    private static final String ENTITY_NAME = "sublocation";

    private final SublocationRepository sublocationRepository;

    private final SublocationSearchRepository sublocationSearchRepository;

    public SublocationResource(SublocationRepository sublocationRepository, SublocationSearchRepository sublocationSearchRepository) {
        this.sublocationRepository = sublocationRepository;
        this.sublocationSearchRepository = sublocationSearchRepository;
    }

    /**
     * POST  /sublocations : Create a new sublocation.
     *
     * @param sublocation the sublocation to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sublocation, or with status 400 (Bad Request) if the sublocation has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/sublocations")
    @Timed
    public ResponseEntity<Sublocation> createSublocation(@Valid @RequestBody Sublocation sublocation) throws URISyntaxException {
        log.debug("REST request to save Sublocation : {}", sublocation);
        if (sublocation.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new sublocation cannot already have an ID")).body(null);
        }
        Sublocation result = sublocationRepository.save(sublocation);
        sublocationSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/sublocations/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sublocations : Updates an existing sublocation.
     *
     * @param sublocation the sublocation to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sublocation,
     * or with status 400 (Bad Request) if the sublocation is not valid,
     * or with status 500 (Internal Server Error) if the sublocation couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/sublocations")
    @Timed
    public ResponseEntity<Sublocation> updateSublocation(@Valid @RequestBody Sublocation sublocation) throws URISyntaxException {
        log.debug("REST request to update Sublocation : {}", sublocation);
        if (sublocation.getId() == null) {
            return createSublocation(sublocation);
        }
        Sublocation result = sublocationRepository.save(sublocation);
        sublocationSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, sublocation.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sublocations : get all the sublocations.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sublocations in body
     */
    @GetMapping("/sublocations")
    @Timed
    public ResponseEntity<List<Sublocation>> getAllSublocations(@ApiParam Pageable pageable) {
        log.debug("REST request to get a page of Sublocations");
        Page<Sublocation> page = sublocationRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sublocations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sublocations/:id : get the "id" sublocation.
     *
     * @param id the id of the sublocation to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sublocation, or with status 404 (Not Found)
     */
    @GetMapping("/sublocations/{id}")
    @Timed
    public ResponseEntity<Sublocation> getSublocation(@PathVariable Long id) {
        log.debug("REST request to get Sublocation : {}", id);
        Sublocation sublocation = sublocationRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(sublocation));
    }

    /**
     * DELETE  /sublocations/:id : delete the "id" sublocation.
     *
     * @param id the id of the sublocation to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/sublocations/{id}")
    @Timed
    public ResponseEntity<Void> deleteSublocation(@PathVariable Long id) {
        log.debug("REST request to delete Sublocation : {}", id);
        sublocationRepository.delete(id);
        sublocationSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/sublocations?query=:query : search for the sublocation corresponding
     * to the query.
     *
     * @param query the query of the sublocation search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/sublocations")
    @Timed
    public ResponseEntity<List<Sublocation>> searchSublocations(@RequestParam String query, @ApiParam Pageable pageable) {
        log.debug("REST request to search for a page of Sublocations for query {}", query);
        Page<Sublocation> page = sublocationSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/sublocations");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
