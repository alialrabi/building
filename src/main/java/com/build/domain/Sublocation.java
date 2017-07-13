package com.build.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Sublocation.
 */
@Entity
@Table(name = "sublocation")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "sublocation")
public class Sublocation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "sublocation")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Location> locations = new HashSet<>();

    @OneToMany(mappedBy = "sublocation")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Asset> assets = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Sublocation name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Location> getLocations() {
        return locations;
    }

    public Sublocation locations(Set<Location> locations) {
        this.locations = locations;
        return this;
    }

    public Sublocation addLocation(Location location) {
        this.locations.add(location);
        location.setSublocation(this);
        return this;
    }

    public Sublocation removeLocation(Location location) {
        this.locations.remove(location);
        location.setSublocation(null);
        return this;
    }

    public void setLocations(Set<Location> locations) {
        this.locations = locations;
    }

    public Set<Asset> getAssets() {
        return assets;
    }

    public Sublocation assets(Set<Asset> assets) {
        this.assets = assets;
        return this;
    }

    public Sublocation addAsset(Asset asset) {
        this.assets.add(asset);
        asset.setSublocation(this);
        return this;
    }

    public Sublocation removeAsset(Asset asset) {
        this.assets.remove(asset);
        asset.setSublocation(null);
        return this;
    }

    public void setAssets(Set<Asset> assets) {
        this.assets = assets;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Sublocation sublocation = (Sublocation) o;
        if (sublocation.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), sublocation.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Sublocation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
