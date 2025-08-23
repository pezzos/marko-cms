(async function() {
  const res = await fetch('/search.json');
  const docs = await res.json();
  const idx = lunr(function () {
    this.ref('url');
    this.field('title');
    this.field('tags');
    this.field('excerpt');
    docs.forEach(doc => this.add(doc));
  });

  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');

  input.addEventListener('input', function() {
    const query = this.value.trim();
    results.innerHTML = '';
    if (!query) return;
    idx.search(query).forEach(result => {
      const doc = docs.find(d => d.url === result.ref);
      if (!doc) return;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = doc.url;
      a.textContent = doc.title;
      const p = document.createElement('p');
      p.textContent = doc.excerpt;
      li.appendChild(a);
      li.appendChild(p);
      results.appendChild(li);
    });
  });
})();
