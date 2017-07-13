package com.build.repository.search;

import com.build.domain.Sublocation;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Sublocation entity.
 */
public interface SublocationSearchRepository extends ElasticsearchRepository<Sublocation, Long> {
}
