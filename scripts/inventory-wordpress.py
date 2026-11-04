from pathlib import Path
import re,json,html
root=Path(__file__).resolve().parents[1]
s=(root/'wp_seccom_db0.sql').read_text()
def rows(table):
 for match in re.finditer(r'INSERT INTO `'+re.escape(table)+r'` \((.*?)\) VALUES\s*',s):
  cols=re.findall(r'`([^`]+)`',match[1]);i=match.end();row=[]
  while i<len(s):
   c=s[i]
   if c==';':break
   if c in ' \r\n,(':i+=1;continue
   if c==')':
    if len(row)==len(cols):yield dict(zip(cols,row))
    row=[];i+=1;continue
   if c=="'":
    i+=1;out=[]
    while i<len(s):
     c=s[i];i+=1
     if c=='\\':
      c=s[i];i+=1;out.append({'n':'\n','r':'\r','t':'\t','0':'\0'}.get(c,c))
     elif c=="'":
      if i<len(s) and s[i]=="'":out.append("'");i+=1
      else:break
     else:out.append(c)
    row.append(''.join(out))
   else:
    j=i
    while s[i] not in ',);':i+=1
    row.append(s[j:i].strip())
pages=[r for r in rows('wp_posts') if r['post_status']=='publish' and r['post_type'] in ('page','post') and not r['post_password']]
fields=('ID','post_parent','post_name','post_title','post_content','post_type','post_modified')
public=[{k:p[k] for k in fields} for p in pages]
(root/'content/wordpress-public.json').write_text(json.dumps(public,ensure_ascii=False,indent=2)+'\n')
for p in pages:print(p['ID'],p['post_parent'],p['post_name'],p['post_title'],len(p['post_content']))
