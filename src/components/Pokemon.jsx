import { useState, useEffect } from "react";
import PokemonCard from "./PokemonCard";
import "./Pokemon.css";

function Pokemon() {
  const [pokemon, setPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [foundPokemon, setFoundPokemon] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [offset, setOffset] = useState(20);
  const [loading, setLoading] = useState(false);

  async function getPokemon(url) {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch Pokémon");
    }

    const data = await response.json();

    return Promise.all(
      data.results.map(async (item) => {
        const result = await fetch(item.url);
        if (!result.ok) throw new Error("Failed to fetch Pokémon");
        return result.json();
      })
    );
  }

  useEffect(() => {
    let active = true;

    getPokemon("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((data) => {
        if (active) setPokemon(data);
      })
      .catch(() => {
        if (active) setMessage("Unable to load Pokémon.");
      });

    return () => {
      active = false;
    };
  }, []);

  async function searchPokemon() {
    const name = searchTerm.trim().toLowerCase();

    if (!name) {
      setMessage("Please enter a Pokémon name.");
      setFoundPokemon(null);
      return;
    }

    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`
      );

      if (!response.ok) {
        setMessage(
          response.status === 404
            ? "Pokémon not found."
            : "Unable to search Pokémon."
        );
        setFoundPokemon(null);
        return;
      }

      const data = await response.json();
      setFoundPokemon(data);
      setMessage("");
    } catch {
      setMessage("Unable to search Pokémon.");
      setFoundPokemon(null);
    }
  }

  async function loadMorePokemon() {
    if (loading) return;

    setLoading(true);

    try {
      const data = await getPokemon(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`
      );

      setPokemon((previous) => [...previous, ...data]);
      setOffset((previous) => previous + 20);
      setMessage("");
    } catch {
      setMessage("Unable to load more Pokémon.");
    } finally {
      setLoading(false);
    }
  }

  const filteredPokemon = pokemon.filter(
    (item) =>
      selectedType === "all" ||
      item.types.some((type) => type.type.name === selectedType)
  );

  return (
    <div className="pokemon-container">
      <h2>Pokémon List</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a Pokémon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button onClick={searchPokemon}>Search</button>
      </div>

      {message && <p className="message">{message}</p>}

      {foundPokemon && (
        <div className="search-results">
          <h2>Search Result</h2>
          <PokemonCard pokemon={foundPokemon} />
        </div>
      )}

      <div className="filter-container">
        <h3>Filter by Type</h3>

        {["all", "fire", "water", "grass", "electric", "normal"].map(
          (type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={selectedType === type ? "active" : ""}
            >
              {type}
            </button>
          )
        )}
      </div>

      <div className="pokemon-list">
        {filteredPokemon.map((item) => (
          <PokemonCard key={item.id} pokemon={item} />
        ))}
      </div>

      <div className="load-more-container">
        <button onClick={loadMorePokemon} disabled={loading}>
          {loading ? "Loading..." : "Load More Pokémon"}
        </button>
      </div>
    </div>
  );
}

export default Pokemon;