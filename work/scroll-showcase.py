from pathlib import Path
import re
items=[('lily','触达转化','Lily','理解客户、制定触达策略并持续跟进，让高质量线索转化为真实询盘。'),('wendy','社媒运营','Wendy','从内容创作到发布排期与评论跟进，让海外社媒运营持续运转。'),('john','投流','John','全天候观察投放表现、识别优化机会，并在关键决策前交由用户确认。')]
p=Path('dist/index.html');s=p.read_text();start=s.index('  <div class="live-projects">');end=s.index('\n</section>',start)
visuals=''.join(f'<div class="showcase-image{" is-active" if i==0 else ""}" data-project="{key}"><div class="preview-viewport" aria-hidden="true" inert><iframe src="previews/ontoz/index.html#{key}" title="{name} 首页动态展示" loading="lazy" tabindex="-1" sandbox="allow-scripts allow-same-origin"></iframe></div></div>' for i,(key,role,name,desc) in enumerate(items))
steps=''.join(f'<article class="showcase-step" data-project="{key}" id="showcase-{key}"><div class="showcase-copy"><span class="meta">0{i+1} / 03</span><h3>{role}<span lang="en">{name}</span></h3><p>{desc}</p><a class="showcase-more" href="work.html#{key}" aria-label="查看更多：{role} {name}">查看更多 <span aria-hidden="true">↗</span></a></div></article>' for i,(key,role,name,desc) in enumerate(items))
s=s[:start]+f'<div class="scroll-showcase"><div class="showcase-visuals" aria-hidden="true">{visuals}</div><div class="showcase-stories">{steps}</div></div>'+s[end:];p.write_text(s)
p=Path('dist/work.html');s=p.read_text();start=s.index('  <div class="projects">');end=s.index('\n</section>',start)
projects=''.join(f'<article class="project case-placeholder" id="{key}"><div class="project-top meta"><span>0{i+1} / ONTOZ</span><span>案例待补充</span></div><div class="case-placeholder-content"><h3>{role} <span>{name}</span></h3><p>{desc}</p><p class="case-coming">完整案例整理中，后续补充项目背景、关键设计决策、我的贡献与成果。</p><a class="text-link" href="index.html#showcase-{key}">返回首页预览 ↗</a></div></article>' for i,(key,role,name,desc) in enumerate(items))
s=s[:start]+'  <div class="projects">'+projects+'</div>'+s[end:];p.write_text(s)
