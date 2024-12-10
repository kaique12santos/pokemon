const pokemonList = document.querySelector('#pokemonList');
const loadMoreButton = document.querySelector("#loadMoreButton");
const maxRecords = 151;
const limit = 12;
let offset = 0;

function createPokemonModal(pokemon) {
    const modalContainer = document.createElement('div');
    modalContainer.classList.add('modalContainer');

    modalContainer.innerHTML = `
        <div class="modal">
            <button class="closeModal">X</button>
            <h2>${pokemon.name} (#${pokemon.number})</h2>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <p><strong>Type(s):</strong> ${pokemon.types.join(', ')}</p>
            <p><strong>Height:</strong> ${pokemon.height}m</p>
            <p><strong>Weight:</strong> ${pokemon.weight}kg</p>
            <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
            <p><strong>Moves:</strong> ${pokemon.moves.slice(0, 5).join(', ')}</p>

            <h3>Base Stats:</h3>
            <table>
                <tr><td>HP</td><td>${pokemon.baseStats.hp}</td><td><progress max="255" value="${pokemon.baseStats.hp}"></progress></td></tr>
                <tr><td>Attack</td><td>${pokemon.baseStats.attack}</td><td><progress max="255" value="${pokemon.baseStats.attack}"></progress></td></tr>
                <tr><td>Defense</td><td>${pokemon.baseStats.defense}</td><td><progress max="255" value="${pokemon.baseStats.defense}"></progress></td></tr>
                <tr><td>Speed</td><td>${pokemon.baseStats.speed}</td><td><progress max="255" value="${pokemon.baseStats.speed}"></progress></td></tr>
            </table>
        </div>
    `;

    const modal = modalContainer.querySelector('.modal');
   
    const closeButton = modal.querySelector('.closeModal');
    closeButton.addEventListener('click', () => {
        modalContainer.remove();
    });

    document.body.appendChild(modalContainer);
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map((pokemon) => 
            ` 
            <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
                <span class="number">${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>
            
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
    
                    <img src="${pokemon.photo}" alt="${pokemon.name}">
                </div>
            </li>`
        ).join('');
        pokemonList.innerHTML += newHtml;

        document.querySelectorAll('.pokemon').forEach(pokemonLi => {
            pokemonLi.addEventListener('click', () => {
                const pokemonNumber = pokemonLi.dataset.id;
                const pokemon = pokemons.find(p => p.number == pokemonNumber);

                createPokemonModal(pokemon);
            });
        });
    })
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

