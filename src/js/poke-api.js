const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon();

    pokemon.number = pokeDetail.id;
    pokemon.name = pokeDetail.name;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;
    pokemon.types = types;
    pokemon.type = type;

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default;

    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);

    pokemon.moves = pokeDetail.moves.map((moveSlot) => moveSlot.move.name);

    pokemon.baseStats = {
        hp: pokeDetail.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: pokeDetail.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: pokeDetail.stats.find(stat => stat.stat.name === 'defense').base_stat,
        specialAttack: pokeDetail.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
        specialDefense: pokeDetail.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
        speed: pokeDetail.stats.find(stat => stat.stat.name === 'speed').base_stat
    };

    pokemon.height = pokeDetail.height / 10; 
    pokemon.weight = pokeDetail.weight / 10; 

    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails);
}
