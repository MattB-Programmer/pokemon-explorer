function PokemonCard({ pokemon }) {
  const type = pokemon.types[0].type.name;

  return (
    <div className={`pokemon-card card shadow-sm type-${type}`}>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="card-img-top"
      />

      <div className="card-body">
        <h3 className="card-title">{pokemon.name}</h3>

        <p className="card-text">
          Type: {pokemon.types.map((type) => type.type.name).join(", ")}
        </p>

        <p className="card-text">
          Height: {pokemon.height / 10} m
        </p>

        <p className="card-text">
          Weight: {pokemon.weight / 10} kg
        </p>
      </div>
    </div>
  );
}

export default PokemonCard;