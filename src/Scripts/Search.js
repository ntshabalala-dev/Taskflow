export default function Search(searchTerm = '') {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search projects...';
    searchInput.id = 'project-create-search';

    return searchInput;
}