from pathlib import Path
import shutil,re
src=Path('/Users/zhangxinyi/Documents/OntoZ')
out=Path('dist/previews/ontoz');out.mkdir(parents=True,exist_ok=True)
for folder in ['css','js','assets']:
 shutil.copytree(src/folder,out/folder,dirs_exist_ok=True)
for name in ['index.html','styles.css','lucide-icons.css']:
 shutil.copy2(src/name,out/name)
# All storage in the display-only copy is ephemeral and isolated from the original app.
for p in (out/'js').glob('*.js'):
 s=p.read_text().replace('window.localStorage','window.previewStorage').replace('localStorage.','previewStorage.')
 if p.name=='john.js':
  s=s.replace("launched: false, stage: 'welcome'", "launched: true, stage: 'home'")
  s=s.replace('campaigns: [], reports:', 'campaigns: clone(D.initialCampaigns), reports:')
 p.write_text(s)
p=out/'index.html';s=p.read_text()
s=s.replace('<head>','''<head>
<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'none'; form-action 'none';">
<script src="preview-setup.js"></script>''',1)
s=s.replace('</head>','<link rel="stylesheet" href="preview-only.css"></head>')
s=s.replace('</body>','<script src="preview-only.js"></script></body>')
p.write_text(s)
# Aliased image path in the source demo.
alias=out/'designs/wendy-v12';alias.mkdir(parents=True,exist_ok=True)
shutil.copy2(src/'assets/wendy-v15-industrial-inspection.jpg',alias/'16-linkedin-workspace.jpg')
index=Path('dist/index.html');home=index.read_text()
start=home.index('  <div class="projects">');end=home.index('\n</section>',start)
cards=[]
for n,name,desc in [(1,'Lily','触达转化'),(2,'Wendy','社媒运营'),(3,'John','24/7 投流')]:
 cards.append(f'''<article class="live-project">
<div class="live-project-heading"><div><span class="meta">0{n} / ONTOZ</span><h3>{name}<span>{desc}</span></h3></div><span class="live-label meta"><i aria-hidden="true"></i>动态界面预览</span></div>
<div class="live-preview" tabindex="0" aria-label="{name} 首页动态展示，仅供浏览，不可操作">
<div class="preview-viewport" aria-hidden="true" inert><iframe src="previews/ontoz/index.html#{name.lower()}" title="OntoZ {name} 首页展示" loading="lazy" tabindex="-1" sandbox="allow-scripts allow-same-origin"></iframe></div>
<div class="preview-caption meta"><span>ONTOZ / {name.upper()}</span><span>仅展示 · 不可操作</span></div>
</div>
</article>''')
home=home[:start]+'  <div class="live-projects">'+'\n'.join(cards)+'</div>'+home[end:]
home=home.replace('</body>','<script src="project-previews.js"></script>\n</body>')
index.write_text(home)
print('Imported original OntoZ pages and replaced homepage project area only.')
