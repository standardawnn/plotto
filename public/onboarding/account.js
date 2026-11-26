const accountStatus = '<div class="status"><span>9:41</span><i></i><img src="/assets/intervention/8b917.svg" alt=""></div>';
const accountBack = '<button class="back" type="button" aria-label="이전 화면">‹</button>';
const consentPage = document.createElement('section');
consentPage.id = 'consent'; consentPage.className = 'page gradient'; consentPage.hidden = true;
consentPage.innerHTML = `${accountStatus}${accountBack}<div class="account-content"><h1>안전하게 함께하기 위해<br>확인해 주세요</h1><p>Plotto에서 사용하는 정보와 서비스 내용을 확인해 주세요.</p><p class="account-note">아래 내용은 시연을 위한 초안이며 실제 서비스 적용 전 운영 정보와 함께 확정해야 합니다.</p><div class="account-card"><label class="account-check"><input id="terms-check" type="checkbox"><span>서비스 이용약관 확인 (필수)</span></label><details><summary>내용 보기</summary><p>Plotto는 프로젝트 일정, 회의와 문서, 팀원 간 소통을 돕는 서비스입니다. 사용자는 접근 권한이 있는 자료만 연결해야 하며 AI 결과는 확인 후 활용합니다. 제공 범위, 책임, 탈퇴 및 분쟁 처리 기준은 운영 전 확정됩니다.</p></details></div><div class="account-card"><label class="account-check"><input id="privacy-check" type="checkbox"><span>개인정보 수집·이용 안내 확인 (필수)</span></label><details><summary>내용 보기</summary><p>로그인 시 제공자의 계정 식별자와 제공에 동의한 프로필 정보, 사용자가 설정한 이름을 계정 관리에 사용합니다. 프로젝트 이용 시 선택한 프로젝트와 팀원·일정·회의·문서·메시지에 포함된 정보가 기능 제공에 사용될 수 있습니다.</p><p>수집 항목, 보유 기간, 운영자 연락처, 열람·삭제 요청 방법은 실제 운영 전에 확정해야 합니다.</p></details></div><div class="account-card"><label class="account-check"><input id="notice-check" type="checkbox"><span>서비스 소식 및 마케팅 알림 수신 (선택)</span></label><details><summary>내용 보기</summary><p>서비스 소식과 이벤트 알림에 관한 선택 항목입니다. 수신 수단과 철회 방법은 실제 발송 기능을 도입할 때 안내합니다.</p></details></div><p class="account-note">AI 처리, 외부 서비스 연결과 알림 권한은 실제 기능 이용 전에 대상과 범위를 별도로 안내합니다.</p></div><button class="primary" id="consent-next" disabled>다음</button><div class="home-indicator"></div>`;
const loginPage = document.createElement('section');
loginPage.id = 'login'; loginPage.className = 'page gradient'; loginPage.hidden = true;
loginPage.innerHTML = `${accountStatus}${accountBack}<div class="account-content"><h1>Plotto와 함께할<br>계정으로 시작해요</h1><p>간편하게 로그인하고 프로젝트를 이어가세요.</p><div class="social-list"><button class="social-button kakao" id="login-kakao" type="button"><strong aria-hidden="true">●</strong> 카카오로 시작하기</button></div><p class="account-error" id="login-error" role="status"></p></div><div class="home-indicator"></div>`;
document.body.append(consentPage, loginPage);
consentPage.querySelector('.back').onclick = () => show('tour');
loginPage.querySelector('.back').onclick = () => show('consent');
const consentInputs = ['terms-check','privacy-check','notice-check'].map(id => document.getElementById(id));
consentInputs.forEach(input => input.onchange = () => { document.getElementById('consent-next').disabled = !consentInputs[0].checked || !consentInputs[1].checked; });
document.getElementById('consent-next').onclick = () => { sessionStorage.setItem('plotto-consent-pending', JSON.stringify({version:'draft', terms:true, privacy:true, marketing:consentInputs[2].checked, acceptedAt:new Date().toISOString()})); show('login'); };
// 로그인에서 돌아왔는지 SDK가 주소를 정리하기 전에 기록해 둔다 (launch.js·account-session.js 가 사용)
window.PLOTTO_AUTH_RETURN = (() => {
 const q = new URLSearchParams(location.search), h = new URLSearchParams(location.hash.slice(1));
 const error = q.get('error') || h.get('error');
 return error || q.has('code') ? { error, code: q.has('code') } : null;
})();
const authConfig = window.PLOTTO_AUTH;
// supabase-client.js 를 못 불러왔거나 설정이 비어 있으면 로그인만 막고 나머지 화면은 그대로 만든다
const authClient = authConfig && authConfig.url && authConfig.publishableKey && window.supabase ? window.supabase.createClient(authConfig.url, authConfig.publishableKey, {auth:{flowType:'pkce'}}) : null;
async function socialLogin(provider) {
 const error = document.getElementById('login-error');
 if (!authClient) { error.textContent = '로그인 서비스가 아직 연결되지 않았어요.'; return; }
 error.textContent = '';
 try {
  // 앱 시작 주소(/)로 돌아오게 한다. 앱(shell.tsx)이 로그인 결과를 온보딩 화면에 넘겨 이어서 처리한다.
  // 지금 열려 있는 주소(Preview·운영·localhost)의 도메인을 그대로 쓴다. Supabase Redirect URLs 에 등록돼 있어야 한다.
  const { data, error: authError } = await authClient.auth.signInWithOAuth({provider, options:{redirectTo:`${location.origin}/`, skipBrowserRedirect:true}});
  if (authError || !data.url) { error.textContent = '로그인 연결을 확인해 주세요. 잠시 후 다시 시도할 수 있어요.'; return; }
  window.top.location.assign(data.url);
 } catch { error.textContent = '연결하지 못했어요. 잠시 후 다시 시도해 주세요.'; }
}
document.getElementById('login-kakao').onclick = () => socialLogin('kakao');

// 이 화면은 연결 전 시연용입니다. 입력한 자격 증명은 저장하거나 전송하지 않습니다.
const loginContent = loginPage.querySelector('.account-content');
const loginForm = document.createElement('form');
loginForm.id = 'email-form';
loginForm.innerHTML = '<label class="account-field">아이디 (이메일)<input type="email" name="email" autocomplete="username" placeholder="이메일을 입력해 주세요" required></label><label class="account-field">비밀번호<input type="password" name="password" autocomplete="current-password" placeholder="비밀번호를 입력해 주세요" required minlength="6"></label><button class="email-submit" type="submit">로그인</button><button class="account-link signup-link" type="button">회원가입하기</button>';
loginContent.insertBefore(loginForm, loginContent.querySelector('.social-list'));
loginContent.querySelector('.social-list').insertAdjacentHTML('beforebegin', '<div class="social-divider">또는 간편 로그인</div>');
loginForm.onsubmit = e => { e.preventDefault(); document.getElementById('login-error').textContent = '아이디 로그인은 아직 연결 준비 중이에요. 카카오로 로그인해 주세요.'; loginForm.elements.password.value = ''; };

const signupPage = document.createElement('section');
signupPage.id = 'signup'; signupPage.className = 'page gradient'; signupPage.hidden = true;
signupPage.innerHTML = `${accountStatus}${accountBack}<div class="account-content"><h1>Plotto와 함께할<br>계정을 만들어 볼까요?</h1><p>이메일을 아이디로 사용해요.</p><p class="account-note">회원가입 화면은 시연용입니다. 입력한 정보는 저장되지 않아요.</p><form id="signup-form"><label class="account-field">아이디 (이메일)<input type="email" autocomplete="email" placeholder="이메일을 입력해 주세요" required></label><label class="account-field">비밀번호<input type="password" autocomplete="new-password" placeholder="6자 이상 입력해 주세요" minlength="6" required></label><label class="account-field">비밀번호 확인<input type="password" autocomplete="new-password" placeholder="비밀번호를 다시 입력해 주세요" minlength="6" required></label><button class="email-submit" type="submit">회원가입</button><p class="account-error" id="signup-error" role="status"></p></form></div><div class="home-indicator"></div>`;
document.body.append(signupPage);
signupPage.querySelector('.back').onclick = () => show('login');
loginForm.querySelector('.signup-link').onclick = () => show('signup');
signupPage.querySelector('form').onsubmit = e => { e.preventDefault(); const inputs = signupPage.querySelectorAll('input[type=password]'); const error = document.getElementById('signup-error'); error.textContent = inputs[0].value !== inputs[1].value ? '비밀번호가 일치하지 않아요.' : '회원가입은 아직 연결 준비 중이에요. 카카오로 로그인해 주세요.'; inputs.forEach(input => { input.value = ''; }); };

const consentDetails = consentPage.querySelectorAll('details');
consentDetails[0].innerHTML = '<summary>내용 보기</summary><p><b>시연용 이용약관 초안</b></p><p>1. 서비스: Plotto는 프로젝트의 일정·회의·문서·소통을 정리하고 AI 결과를 제안하는 기능을 제공합니다. 실제 제공 범위는 정식 운영 시 안내합니다.</p><p>2. 계정: 이용자는 본인의 계정을 관리하고 다른 사람의 정보를 무단으로 사용하지 않습니다. 가입·탈퇴 및 이용 제한 기준은 운영 전 확정합니다.</p><p>3. 프로젝트 자료: 접근 및 공유 권한이 있는 자료만 연결해야 하며, 팀원 정보와 자료의 제공 권한을 확인해야 합니다.</p><p>4. AI 결과: 생성 내용은 오류나 누락이 있을 수 있습니다. 이용자는 원문과 결과를 확인한 후 사용합니다. 외부 서비스 연결 및 자료 처리는 해당 기능 이용 전에 별도로 안내합니다.</p><p>5. 변경과 문의: 서비스 변경, 중단, 약관 변경 고지, 책임, 분쟁 해결 및 운영자 연락처는 정식 운영 전에 구체화합니다.</p>';
consentDetails[1].innerHTML = '<summary>내용 보기</summary><p><b>시연용 개인정보 안내 초안</b></p><p>목적: 계정 식별과 서비스 이용, 프로젝트 선택 및 관련 기능 제공.</p><p>예상 항목: 이메일 아이디 또는 소셜 계정 식별자, 사용자가 입력한 이름. 프로젝트 연결 시 선택한 프로젝트의 팀원, 일정, 회의, 문서 및 메시지에 개인정보가 포함될 수 있습니다. 실제 수집 항목은 연결 범위를 정한 후 확정합니다.</p><p>보유·이용 기간: 운영 방침 확정 필요. 삭제와 법령에 따른 보존 여부도 정식 운영 전 안내합니다.</p><p>동의를 거부할 수 있으며, 필수 정보 처리에 동의하지 않으면 해당 계정 서비스 이용이 제한될 수 있습니다.</p><p>운영자·문의처, 처리 위탁 및 국외 이전 여부, 열람·삭제 등 권리 행사 방법은 실제 운영에 맞춰 별도로 공개합니다.</p>';

const sourcePage = document.createElement('section');
consentDetails[0].insertAdjacentHTML('beforeend', '<p><a href="terms-draft.html" target="_blank" rel="noopener">이용약관 상세 초안 전체 보기</a></p>');
sourcePage.id = 'source'; sourcePage.className = 'page gradient'; sourcePage.hidden = true;
sourcePage.innerHTML = `${accountStatus}${accountBack}<div class="account-content"><h1>어디에서 프로젝트를<br>가져올까요?</h1><p>함께할 프로젝트의 출처를 선택해 주세요.</p><div class="source-list"><label class="source-choice"><input type="radio" name="source" value="demo" checked><span><strong>예시 프로젝트</strong><small>연결 없이 Plotto를 둘러볼 수 있어요</small></span></label><label class="source-choice unavailable"><input type="radio" name="source" value="notion" disabled><span><strong>Notion</strong><small>연결 준비 중</small></span></label><label class="source-choice unavailable"><input type="radio" name="source" value="figma" disabled><span><strong>Figma</strong><small>연결 준비 중</small></span></label></div><p class="account-note">시연에서는 예시 데이터만 사용해요. 외부 서비스는 실제로 연결되지 않습니다.</p></div><button class="primary" id="source-next">다음</button><div class="home-indicator"></div>`;
document.body.append(sourcePage);
sourcePage.querySelector('.back').onclick = () => show('name');
document.getElementById('source-next').onclick = () => show('projects');
