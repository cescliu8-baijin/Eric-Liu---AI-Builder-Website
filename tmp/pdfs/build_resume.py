from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader

ROOT=Path('/Users/zhangxinyi/Documents/Eric/AI Builder Website')
OUT=ROOT/'output/pdf/Eric_Liu_中文简历.pdf'
pdfmetrics.registerFont(TTFont('CN',str(ROOT/'tmp/pdfs/PingFangSC-Regular-Resume.ttf')))
pdfmetrics.registerFont(TTFont('CNB',str(ROOT/'tmp/pdfs/PingFangSC-Semibold-Resume.ttf')))
pdfmetrics.registerFontFamily('CN',normal='CN',bold='CNB')
W,H=A4
c=canvas.Canvas(str(OUT),pagesize=A4)
c.setTitle('刘汗青 Eric Liu | AI 产品设计师 · 中文简历')
c.setAuthor('刘汗青 Eric Liu')
c.setSubject('工作经历、核心能力与 OntoZ 代表项目')
INK=HexColor('#242422'); MUTED=HexColor('#646460'); ACCENT=HexColor('#E94723'); LINE=HexColor('#DEDEDA')
L=42; R=W-42; WIDTH=R-L
y=H-39

def text(s,x,y,size=10,font='CN',color=INK):
 c.setFillColor(color); c.setFont(font,size); c.drawString(x,y,s)
def para(s, top, size=10.1, leading=15.4, x=L, width=WIDTH, color=INK):
 style=ParagraphStyle('body',fontName='CN',fontSize=size,leading=leading,textColor=color,wordWrap='CJK')
 p=Paragraph(s,style); _,h=p.wrap(width,1000); p.drawOn(c,x,top-h); return top-h

def section(title,en):
 global y
 y-=18
 text(title,L,y,12,'CNB')
 text(en,L+65,y+0.5,7.2,'Helvetica',MUTED)
 c.setStrokeColor(LINE); c.setLineWidth(.55); c.line(L,y-7,R,y-7)
 y-=18

def job(company,role,dates,bullets):
 global y
 text(company,L,y-10.5,11.1,'CNB')
 c.setFillColor(MUTED); c.setFont('CN',9); c.drawRightString(R,y-10,dates)
 y-=15.8
 y=para(role,y,9.3,13.8,color=MUTED)-4
 for b in bullets:
  text('•',L+1,y-10,10,'CN',ACCENT)
  y=para(b,y,x=L+12,width=WIDTH-12)-3
 y-=4

c.setFillColor(ACCENT); c.rect(L,H-30,29,3,fill=1,stroke=0)
text('刘汗青',L,y-31,27,'CNB')
text('Eric Liu',L+96,y-30,21,'Helvetica-Bold')
photo=ROOT/'output/pdf/assets/刘汗青_简历照.png'
c.drawImage(str(photo),R-78,H-131,width=78,height=104,preserveAspectRatio=True,anchor='c',mask='auto')
text('AI 产品设计师 / UX · 交互设计 / 设计负责人',L,y-54,11.4,'CNB')
text('19121320412',L,y-76,9.4,'Helvetica')
text('cescliu8@gmail.com',L+100,y-76,9.4,'Helvetica')
c.linkURL('tel:19121320412',(L,y-79,L+80,y-65),relative=0)
c.linkURL('mailto:cescliu8@gmail.com',(L+100,y-79,L+230,y-65),relative=0)
website='https://eric-liu-ai-builder-website.vercel.app'
website_label='个人&作品网站链接'
website_offset=pdfmetrics.stringWidth(website_label,'CNB',9)+12
text(website_label,L,y-94,9,'CNB',ACCENT)
text(website,L+website_offset,y-94,8.5,'Helvetica',ACCENT)
link_width=pdfmetrics.stringWidth(website,'Helvetica',8.5)
assert link_width < WIDTH-website_offset
c.linkURL(website,(L,y-98,L+website_offset+link_width,y-83),relative=0)
y-=114

y=para('专注 AI 原生产品体验，拥有企业服务、海外钱包与 AI Agent 产品设计经验。现任上海百型智能设计负责人，结合系统化设计与 AI Coding，串联业务理解、交互设计和高保真 Demo，推动复杂业务转化为清晰、可控的产品体验。',y)
section('核心能力','EXPERTISE')
y=para('<b>AI 产品设计</b>：Agent 任务流程、上下文组织、人机协作与关键确认机制。<br/><b>系统与交付</b>：设计系统、组件规范、跨团队协作、设计团队管理与多端体验。<br/><b>AI Coding</b>：结合 Codex、Figma 与大模型完成方案探索、可交互原型及验证迭代。',y)
section('工作经历','EXPERIENCE')
job('上海百型智能科技有限公司','UX / 交互设计师 · 设计负责人','2025.07 - 至今',[
'负责 AI Agent 平台及 B2B 跨境出海产品设计与团队管理，覆盖智能体创建、配置、运行及业务应用。',
'主导 Agent 设计规范、设计系统与组件库建设，统一任务执行、思考过程、工具调用及异常反馈的交互模式。',
'运用 AI 工具推进需求分析、交互设计与高保真 Demo 搭建，带领团队协同产品、研发进行快速验证与落地。'])
job('蚂蚁国际','UX / 交互设计师','2024.05 - 2025.06',[
'负责海外钱包 App 与 B 端运营产品交互设计，覆盖支付、收单流程及 Web 端运营投放等复杂业务系统。',
'主导项目体验设计，梳理设计框架与规范，管理设计排期并推动方案交付。'])
job('上海才历网络','UX / 交互设计师','2021.05 - 2024.01',[
'承担 AiPath 招聘管理平台与 SSC 人力资源共享中心的全部交互设计及部分 UI 设计，参与从 0 到 1 的产品建设。',
'覆盖 Web、H5 与小程序，服务客户包括蒂升电梯、贺利氏、迪士尼与康师傅等。'])
section('代表项目','SELECTED WORK')
text('OntoZ · 面向外贸增长的多智能体工作台',L,y-10.5,11.1,'CNB')
c.setFillColor(MUTED); c.setFont('CN',9); c.drawRightString(R,y-10,'2025.12 - 2026.10')
y-=19
y=para('面向中国 B2B 出海中小企业，围绕企业上下文、场景化任务与用户确认机制，设计触达转化 Lily、社媒运营 Wendy 和投流 John 的协作体验。',y)-6
for b in [
'<b>研究与定义：</b>围绕 B2B 出海业务与用户角色，梳理获客、触达、社媒运营及投放场景，明确平台定位、企业上下文与各 Agent 的任务边界。',
'<b>交互与原型：</b>设计平台信息架构与 Agent 核心任务流程，串联策略确认、执行进展、结果反馈和人工介入，并构建可交互原型验证方案。',
'<b>系统化交付：</b>统一跨 Agent 的视觉、组件与状态规范，补齐字段、校验及异常处理说明，与研发对齐实现约束并持续验收。']:
 text('•',L+1,y-10,10,'CN',ACCENT)
 y=para(b,y,x=L+12,width=WIDTH-12)-3

y-=9
text('ASAP · Alipay 海外钱包运营平台',L,y-10.5,11.1,'CNB')
c.setFillColor(MUTED); c.setFont('CN',9); c.drawRightString(R,y-10,'2024.05 - 2025.06')
y-=19
y=para('为 Alipay 海外钱包运营设计创意投放、A/B 实验、投放策略、活动玩法与风控功能，支持投放配置、效果追踪和运营决策，交付海外钱包运营团队。',y)

assert y>42, f'Content exceeds page: {y}'
c.setStrokeColor(LINE); c.line(L,31,R,31)
text('刘汗青 / Eric Liu',L,20,7,'CN',MUTED)
c.setFillColor(MUTED); c.setFont('Helvetica',7); c.drawRightString(R,20,'AI PRODUCT DESIGN / 01')
c.save()
r=PdfReader(OUT)
assert len(r.pages)==1
assert any(a.get_object().get('/A',{}).get('/URI')==website for a in r.pages[0]['/Annots'])
s=r.pages[0].extract_text()
for value in ['刘汗青','上海百型智能','蚂蚁国际','上海才历网络','19121320412','cescliu8@gmail.com','OntoZ','ASAP']:
 assert value in s, value
print(f'Created {OUT}; pages={len(r.pages)}; content_bottom={y:.1f}')
