package com.build.repository.search;

import com.build.domain.Type;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Type entity.
 */
public interface TypeSearchRepository extends ElasticsearchRepository<Type, Long> {
}
