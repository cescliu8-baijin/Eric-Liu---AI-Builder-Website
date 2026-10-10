const workPreviewObserver = new ResizeObserver(entries => {for (const {target, contentRect} of entries) target.style.setProperty('--preview-scale', contentRect.width / 1440);});
for (const preview of document.querySelectorAll('.preview-viewport')) workPreviewObserver.observe(preview);
