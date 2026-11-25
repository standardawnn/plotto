// OAuth 복귀 후 SDK가 PKCE 코드를 교환하고 세션을 확인합니다.
const authParams = new URLSearchParams(location.search);
const authHash = new URLSearchParams(location.hash.slice(1));
if (authParams.has('error') || authHash.has('error')) {
  show('login');
  document.getElementById('login-error').textContent = '카카오 로그인을 완료하지 못했어요. 다시 시도해 주세요.';
} else if (authClient && authParams.has('code')) {
  authClient.auth.getSession().then(({data,error}) => {
    if (error || !data.session) { show('login'); document.getElementById('login-error').textContent = '로그인을 완료하지 못했어요. 다시 시도해 주세요.'; return; }
    show('name');
  }).catch(() => { show('login'); document.getElementById('login-error').textContent = '로그인 연결을 확인해 주세요.'; });
}
