package com.build.web.rest;

import com.build.BuildingsouqApp;

import com.build.domain.Sublocation;
import com.build.repository.SublocationRepository;
import com.build.repository.search.SublocationSearchRepository;
import com.build.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SublocationResource REST controller.
 *
 * @see SublocationResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = BuildingsouqApp.class)
public class SublocationResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private SublocationRepository sublocationRepository;

    @Autowired
    private SublocationSearchRepository sublocationSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restSublocationMockMvc;

    private Sublocation sublocation;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        SublocationResource sublocationResource = new SublocationResource(sublocationRepository, sublocationSearchRepository);
        this.restSublocationMockMvc = MockMvcBuilders.standaloneSetup(sublocationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sublocation createEntity(EntityManager em) {
        Sublocation sublocation = new Sublocation()
            .name(DEFAULT_NAME);
        return sublocation;
    }

    @Before
    public void initTest() {
        sublocationSearchRepository.deleteAll();
        sublocation = createEntity(em);
    }

    @Test
    @Transactional
    public void createSublocation() throws Exception {
        int databaseSizeBeforeCreate = sublocationRepository.findAll().size();

        // Create the Sublocation
        restSublocationMockMvc.perform(post("/api/sublocations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sublocation)))
            .andExpect(status().isCreated());

        // Validate the Sublocation in the database
        List<Sublocation> sublocationList = sublocationRepository.findAll();
        assertThat(sublocationList).hasSize(databaseSizeBeforeCreate + 1);
        Sublocation testSublocation = sublocationList.get(sublocationList.size() - 1);
        assertThat(testSublocation.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the Sublocation in Elasticsearch
        Sublocation sublocationEs = sublocationSearchRepository.findOne(testSublocation.getId());
        assertThat(sublocationEs).isEqualToComparingFieldByField(testSublocation);
    }

    @Test
    @Transactional
    public void createSublocationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sublocationRepository.findAll().size();

        // Create the Sublocation with an existing ID
        sublocation.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restSublocationMockMvc.perform(post("/api/sublocations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sublocation)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Sublocation> sublocationList = sublocationRepository.findAll();
        assertThat(sublocationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = sublocationRepository.findAll().size();
        // set the field null
        sublocation.setName(null);

        // Create the Sublocation, which fails.

        restSublocationMockMvc.perform(post("/api/sublocations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sublocation)))
            .andExpect(status().isBadRequest());

        List<Sublocation> sublocationList = sublocationRepository.findAll();
        assertThat(sublocationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllSublocations() throws Exception {
        // Initialize the database
        sublocationRepository.saveAndFlush(sublocation);

        // Get all the sublocationList
        restSublocationMockMvc.perform(get("/api/sublocations?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sublocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getSublocation() throws Exception {
        // Initialize the database
        sublocationRepository.saveAndFlush(sublocation);

        // Get the sublocation
        restSublocationMockMvc.perform(get("/api/sublocations/{id}", sublocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sublocation.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingSublocation() throws Exception {
        // Get the sublocation
        restSublocationMockMvc.perform(get("/api/sublocations/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateSublocation() throws Exception {
        // Initialize the database
        sublocationRepository.saveAndFlush(sublocation);
        sublocationSearchRepository.save(sublocation);
        int databaseSizeBeforeUpdate = sublocationRepository.findAll().size();

        // Update the sublocation
        Sublocation updatedSublocation = sublocationRepository.findOne(sublocation.getId());
        updatedSublocation
            .name(UPDATED_NAME);

        restSublocationMockMvc.perform(put("/api/sublocations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSublocation)))
            .andExpect(status().isOk());

        // Validate the Sublocation in the database
        List<Sublocation> sublocationList = sublocationRepository.findAll();
        assertThat(sublocationList).hasSize(databaseSizeBeforeUpdate);
        Sublocation testSublocation = sublocationList.get(sublocationList.size() - 1);
        assertThat(testSublocation.getName()).isEqualTo(UPDATED_NAME);

        // Validate the Sublocation in Elasticsearch
        Sublocation sublocationEs = sublocationSearchRepository.findOne(testSublocation.getId());
        assertThat(sublocationEs).isEqualToComparingFieldByField(testSublocation);
    }

    @Test
    @Transactional
    public void updateNonExistingSublocation() throws Exception {
        int databaseSizeBeforeUpdate = sublocationRepository.findAll().size();

        // Create the Sublocation

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSublocationMockMvc.perform(put("/api/sublocations")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sublocation)))
            .andExpect(status().isCreated());

        // Validate the Sublocation in the database
        List<Sublocation> sublocationList = sublocationRepository.findAll();
        assertThat(sublocationList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteSublocation() throws Exception {
        // Initialize the database
        sublocationRepository.saveAndFlush(sublocation);
        sublocationSearchRepository.save(sublocation);
        int databaseSizeBeforeDelete = sublocationRepository.findAll().size();

        // Get the sublocation
        restSublocationMockMvc.perform(delete("/api/sublocations/{id}", sublocation.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean sublocationExistsInEs = sublocationSearchRepository.exists(sublocation.getId());
        assertThat(sublocationExistsInEs).isFalse();

        // Validate the database is empty
        List<Sublocation> sublocationList = sublocationRepository.findAll();
        assertThat(sublocationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchSublocation() throws Exception {
        // Initialize the database
        sublocationRepository.saveAndFlush(sublocation);
        sublocationSearchRepository.save(sublocation);

        // Search the sublocation
        restSublocationMockMvc.perform(get("/api/_search/sublocations?query=id:" + sublocation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sublocation.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sublocation.class);
        Sublocation sublocation1 = new Sublocation();
        sublocation1.setId(1L);
        Sublocation sublocation2 = new Sublocation();
        sublocation2.setId(sublocation1.getId());
        assertThat(sublocation1).isEqualTo(sublocation2);
        sublocation2.setId(2L);
        assertThat(sublocation1).isNotEqualTo(sublocation2);
        sublocation1.setId(null);
        assertThat(sublocation1).isNotEqualTo(sublocation2);
    }
}
