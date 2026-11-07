from pathlib import Path
import tempfile, subprocess, os, json, unittest
ROOT=Path(__file__).resolve().parents[1]
ENDPOINT=ROOT/'public/kontakt/senden.php'
class ContactSecurity(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory(); self.addCleanup(self.tmp.cleanup); self.dir=Path(self.tmp.name)
  self.web=self.dir/'public'; self.web.mkdir(); self.state=self.dir/'SEC'; self.mail=self.dir/'testmail'
 def call(self, fields=None, origin='https://simplecommerce.de', ip='192.0.2.1', endpoint=ENDPOINT, state=None):
  server={'REQUEST_METHOD':'POST','HTTP_ORIGIN':origin,'REMOTE_ADDR':ip,'HTTP_ACCEPT':'application/json','DOCUMENT_ROOT':str(self.web)}
  data=fields if fields is not None else {'name':'Fiktiver Test','email':'test@example.org','thema':'Service','nachricht':'Vertraulicher Testinhalt ohne echten Versand.'}
  code='$_SERVER=json_decode('+json.dumps(json.dumps(server))+',true); $_POST=json_decode('+json.dumps(json.dumps(data))+',true); register_shutdown_function(function(){fwrite(STDERR,(string)http_response_code());}); require '+json.dumps(str(endpoint))+';'
  env=dict(os.environ,CONTACT_ENV='development',CONTACT_TRANSPORT='file',CONTACT_TEST_FILE=str(self.mail),CONTACT_STATE_DIR=str(state or self.state))
  runner=self.dir/'runner.php'; runner.write_text('<?php '+code)
  res=subprocess.run(['php',str(runner)],env=env,text=True,capture_output=True)
  return int(res.stderr),json.loads(res.stdout)
 def test_delivery_limit_and_private_logs(self):
  for _ in range(5): self.assertEqual(self.call()[0],200)
  self.assertEqual(self.call()[0],429)
  self.assertEqual(len(self.mail.read_text().splitlines()),5)
  logs=''.join(p.read_text() for p in self.state.glob('*.jsonl'))
  for private in ['test@example.org','Vertraulicher','192.0.2.1','Fiktiver']: self.assertNotIn(private,logs)
  self.assertIn('test_written',logs)
  self.assertEqual(self.state.stat().st_mode & 0o777,0o700)
 def test_invalid_attempt_limit(self):
  for _ in range(20): self.assertEqual(self.call({})[0],422)
  self.assertEqual(self.call({})[0],429); self.assertFalse(self.mail.exists())
 def test_honeypot_origin_and_header_injection(self):
  self.assertEqual(self.call({'website':'spam'})[0],200)
  self.assertEqual(self.call(origin='https://invalid.example')[0],403)
  self.assertEqual(self.call({'name':'Test','email':'x@example.org\r\nBcc: y@example.org','thema':'Service','nachricht':'Eine lange Nachricht'})[0],422)
  self.assertFalse(self.mail.exists())
 def test_public_storage_refused(self):
  self.assertEqual(self.call(state=self.web/'SEC')[0],503)
  self.assertFalse((self.web/'SEC').exists())
 def test_ipv6_group(self):
  for _ in range(5): self.assertEqual(self.call(ip='2001:db8:1:2::1')[0],200)
  self.assertEqual(self.call(ip='2001:db8:1:2::2')[0],429)
 def test_retention(self):
  self.state.mkdir(); old=self.state/'contact_2000-01-01.jsonl'; old.write_text('old')
  self.call(); self.assertFalse(old.exists())
 def test_exception_sanitized(self):
  fault=self.dir/'fault.php'
  fault.write_text(ENDPOINT.read_text().replace('$fields = [];', 'throw new RuntimeException("PRIVATE test@example.org");\n$fields = [];'))
  status,result=self.call(endpoint=fault)
  self.assertEqual(status,503); self.assertFalse(result['ok']); self.assertNotIn('PRIVATE',str(result))
  logs=''.join(p.read_text() for p in self.state.glob('*.jsonl')); self.assertIn('RuntimeException',logs); self.assertNotIn('PRIVATE',logs)
 def test_preview_uses_account_home(self):
  auth=self.dir/'auth'; auth.write_text('AuthType Basic\nAuthUserFile /example/.htpasswd\nRequire valid-user\n')
  out=self.dir/'preview'
  subprocess.run(['python3', str(ROOT/'scripts/prepare-preview.py'), '--output', str(out), '--existing-htaccess', str(auth), '--account-login', 'seccom'],check=True,capture_output=True)
  self.assertIn("'/usr/home/seccom/SEC/simplecommerce-preview'",(out/'kontakt/senden.php').read_text())
  self.assertNotIn('dirname(__DIR__, 4)',(out/'kontakt/senden.php').read_text())
  self.assertIn('php84-fcgi-starter.fcgi',(out/'.htaccess').read_text())
if __name__=='__main__': unittest.main()
