const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector("#loadMoreButton");
const maxRecords = 151;
const limit = 12;
let offset = 0;

function validatePokemonData(pokemon) {
    return {
        name: pokemon.name || "Unknown",
        number: pokemon.number || "N/A",
        photo: pokemon.photo || "default-image.png", 
        types: pokemon.types && pokemon.types.length > 0 ? pokemon.types : ["Unknown"],
        height: pokemon.height || "N/A",
        weight: pokemon.weight || "N/A",
        abilities: pokemon.abilities && pokemon.abilities.length > 0 ? pokemon.abilities : ["None"],
        moves: pokemon.moves && pokemon.moves.length > 0 ? pokemon.moves : ["None"],
        baseStats: {
            hp: pokemon.baseStats?.hp || 0,
            attack: pokemon.baseStats?.attack || 0,
            defense: pokemon.baseStats?.defense || 0,
            speed: pokemon.baseStats?.speed || 0,
        },
    };
}

function createPokemonModal(pokemon) {
    const validatedPokemon = validatePokemonData(pokemon);

    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modalContainer');

    modalContainer.innerHTML = `
        <div class="modal">
            <button class="closeModal">X</button>
            <h2>${validatedPokemon.name} (#${validatedPokemon.number})</h2>
            <img src="${validatedPokemon.photo}" alt="${validatedPokemon.name}">
            <p><strong>Type(s):</strong> ${validatedPokemon.types.join(', ')}</p>
            <p><strong>Height:</strong> ${validatedPokemon.height}m</p>
            <p><strong>Weight:</strong> ${validatedPokemon.weight}kg</p>
            <p><strong>Abilities:</strong> ${validatedPokemon.abilities.join(', ')}</p>
            <p><strong>Moves:</strong> ${validatedPokemon.moves.slice(0, 5).join(', ')}</p>

            <h3>Base Stats:</h3>
            <table>
                <tr><td>HP</td><td>${validatedPokemon.baseStats.hp}</td><td><progress max="255" value="${validatedPokemon.baseStats.hp}"></progress></td></tr>
                <tr><td>Attack</td><td>${validatedPokemon.baseStats.attack}</td><td><progress max="255" value="${validatedPokemon.baseStats.attack}"></progress></td></tr>
                <tr><td>Defense</td><td>${validatedPokemon.baseStats.defense}</td><td><progress max="255" value="${validatedPokemon.baseStats.defense}"></progress></td></tr>
                <tr><td>Speed</td><td>${validatedPokemon.baseStats.speed}</td><td><progress max="255" value="${validatedPokemon.baseStats.speed}"></progress></td></tr>
            </table>
        </div>
    `;

    const closeButton = modalContainer.querySelector('.closeModal');
    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });

    document.body.appendChild(modalContainer);
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => {
            const validatedPokemon = validatePokemonData(pokemon);

            return `
            <li class="pokemon ${validatedPokemon.types[0]}" data-id="${validatedPokemon.number}">
                <span class="number">${validatedPokemon.number}</span>
                <span class="name">${validatedPokemon.name}</span>
            
                <div class="detail">
                    <ol class="types">
                        ${validatedPokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
    
                    <img src="${validatedPokemon.photo}" alt="${validatedPokemon.name}">
                </div>
            </li>`;
        }).join('');

        pokemonList.innerHTML += newHtml;

        document.querySelectorAll('.pokemon').forEach(pokemonLi => {
            pokemonLi.addEventListener('click', () => {
                const pokemonNumber = pokemonLi.dataset.id;
                const pokemon = pokemons.find(p => p.number == pokemonNumber);

                createPokemonModal(pokemon);
            });
        });
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordNexPage = offset + limit;

    if (qtdRecordNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});


