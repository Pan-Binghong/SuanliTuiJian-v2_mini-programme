import chipData from './chipData.js';

export function searchChips(query) {
  query = query.toLowerCase();
  return Object.keys(chipData).filter(chipName => 
    chipName.toLowerCase().includes(query) ||
    Object.values(chipData[chipName]).some(value => 
      value.toString().toLowerCase().includes(query)
    )
  );
}

export function checkChipExists(query) {
  return !!chipData[query];
}

export function selectSuggestion(suggestion) {
    this.searchQuery = suggestion;
    this.suggestions = [];
    }

