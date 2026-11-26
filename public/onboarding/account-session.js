// 카카오 로그인에서 돌아온 뒤의 처리.
// - 코드 교환은 Supabase SDK 가 createClient 때 자동으로 한다(detectSessionInUrl, PKCE). 여기서는 따로 교환하지 않고
//   getSession() 으로 그 결과를 기다린다(자동·수동 처리 중복 없음).
// - 확인하는 동안 로그인 화면에서 "확인 중" 안내를 보여 주고, 세션이 확인되면 이름 입력으로 넘어간다.
// - 취소·실패는 첫 화면으로 보내지 않고 로그인 화면에 안내를 남겨 다시 시도할 수 있게 한다.
// - 코드·토큰 값은 기록하거나 화면에 보여 주지 않는다.
(() => {
  const ret = window.PLOTTO_AUTH_RETURN;
  if (!ret) return;
  const message = document.getElementById('login-error');
  const kakao = document.getElementById('login-kakao');
  const clean = () => { try { history.replaceState(null, '', location.pathname); } catch { /* ignore */ } };
  const busy = on => { if (kakao) kakao.disabled = on; message.classList.toggle('pending', on); };
  const fail = text => { clean(); busy(false); show('login'); message.textContent = text; };

  if (ret.error) {
    fail(ret.error === 'access_denied' ? '카카오 로그인을 취소했어요. 다시 시도할 수 있어요.' : '카카오 로그인을 완료하지 못했어요. 다시 시도해 주세요.');
    return;
  }
  if (!authClient) { fail('로그인 서비스가 연결되지 않아 로그인을 마치지 못했어요.'); return; }

  busy(true);
  message.textContent = '카카오 로그인을 확인하고 있어요…';
  const timeout = new Promise(resolve => setTimeout(() => resolve({ data: { session: null }, error: { timeout: true } }), 15000));
  Promise.race([authClient.auth.getSession(), timeout]).then(({ data, error }) => {
    if (error || !data || !data.session) {
      fail(error && error.timeout ? '로그인 확인이 오래 걸려요. 네트워크를 확인하고 다시 시도해 주세요.' : '로그인을 완료하지 못했어요. 다시 시도해 주세요.');
      return;
    }
    clean(); busy(false); message.textContent = '';
    // 처음 로그인한 계정이면 동의 화면, 이미 동의한 계정이면 이름 입력으로 (account.js)
    continueAfterLogin(data.session);
  }).catch(() => fail('로그인 연결을 확인해 주세요. 잠시 후 다시 시도할 수 있어요.'));
})();
