document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.querySelectorAll('.filter-tag');
    const blogGrid = document.getElementById('blogGrid');
    const posts = Array.from(document.querySelectorAll('.blog-post'));
    const noResults = document.getElementById('noResults');
    
    const dropdown = document.getElementById('customSort');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const currentSortText = document.getElementById('currentSort');
    const options = dropdown.querySelectorAll('.dropdown-options li');

    const filterDropdown = document.getElementById('filterDropdown');
    const filterTrigger = filterDropdown ? filterDropdown.querySelector('.dropdown-trigger') : null;
    const filterText = document.getElementById('currentFilter');
    const filterOptions = filterDropdown ? filterDropdown.querySelectorAll('.dropdown-options li') : [];

    let currentTag = 'all';
    let currentSortValue = 'newest'; 

    function filterPosts() {
        const query = searchInput.value.toLowerCase();
        let visibleCount = 0;

        posts.forEach(post => {
            const title = post.getAttribute('data-title').toLowerCase();
            const tags = post.getAttribute('data-tags');
            
            const matchesSearch = title.includes(query);
            const matchesTag = currentTag === 'all' || tags.includes(currentTag);

            if (matchesSearch && matchesTag) {
                post.style.display = 'flex';
                post.style.animation = 'none';
                post.offsetHeight; 
                post.style.animation = 'popIn 0.4s ease forwards';
                visibleCount++;
            } else {
                post.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
        
        sortPosts();
    }

    function sortPosts() {
        const visiblePosts = posts.filter(p => p.style.display !== 'none');
        
        visiblePosts.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date'));
            const dateB = new Date(b.getAttribute('data-date'));
            const titleA = a.getAttribute('data-title').toLowerCase();
            const titleB = b.getAttribute('data-title').toLowerCase();

            if (currentSortValue === 'newest') return dateB - dateA;
            if (currentSortValue === 'oldest') return dateA - dateB;
            if (currentSortValue === 'az') return titleA.localeCompare(titleB);
        });

        visiblePosts.forEach(post => blogGrid.appendChild(post));
    }

    
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        if(filterDropdown) filterDropdown.classList.remove('open'); 
    });

    options.forEach(option => {
        option.addEventListener('click', () => {
            options.forEach(opt => opt.classList.remove('active-option'));
            option.classList.add('active-option');

            currentSortText.textContent = option.textContent;
            currentSortValue = option.getAttribute('data-value');
            
            dropdown.classList.remove('open');
            sortPosts();
        });
    });

    if (filterDropdown) {
        filterTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            filterDropdown.classList.toggle('open');
            sortDropdown.classList.remove('open'); 
        });

        filterOptions.forEach(option => {
            option.addEventListener('click', () => {
                filterOptions.forEach(opt => opt.classList.remove('active-option'));
                option.classList.add('active-option');

                filterText.textContent = "Filter: " + option.innerText;
                currentTag = option.getAttribute('data-tag');
                
                filterDropdown.classList.remove('open');
                filterPosts();
            });
        });
    }

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
        if (filterDropdown && !filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('open');
        }
    });

    searchInput.addEventListener('input', filterPosts);

    sortPosts();
});