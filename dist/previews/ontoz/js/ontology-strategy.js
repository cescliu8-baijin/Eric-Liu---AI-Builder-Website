// Buyer search strategy graph interactions.

const buyerGraphCanvas = document.querySelector('#buyerGraphCanvas');
const buyerGraphFocusLevel = document.querySelector('#buyerGraphFocusLevel');
const buyerGraphFocusTitle = document.querySelector('#buyerGraphFocusTitle');
const buyerGraphFocusDescription = document.querySelector('#buyerGraphFocusDescription');
const buyerGraphNodes = document.querySelectorAll('[data-graph-node]');
const buyerGraphFilters = document.querySelectorAll('[data-graph-filter]');

function focusBuyerGraphNode(node) {
  buyerGraphNodes.forEach(graphNode => {
    const selected = graphNode === node;
    graphNode.classList.toggle('selected', selected);
    graphNode.setAttribute('aria-pressed', String(selected));
  });

  document.querySelectorAll('[data-graph-lane]').forEach(lane => {
    lane.classList.toggle('active', lane.contains(node));
  });

  buyerGraphFocusLevel.textContent = node.dataset.nodeLevel;
  buyerGraphFocusTitle.textContent = node.dataset.nodeTitle;
  buyerGraphFocusDescription.textContent = node.dataset.nodeDescription;
}

buyerGraphNodes.forEach(node => {
  node.addEventListener('click', () => focusBuyerGraphNode(node));
});

buyerGraphFilters.forEach(filterButton => {
  filterButton.addEventListener('click', () => {
    const filter = filterButton.dataset.graphFilter;
    buyerGraphCanvas.dataset.filter = filter;
    buyerGraphFilters.forEach(button => {
      const active = button === filterButton;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  });
});
