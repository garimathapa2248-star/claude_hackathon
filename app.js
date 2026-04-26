// ─────────────────────────────────────────────────────────────────
// DEBT DECODER — app.js
// ─────────────────────────────────────────────────────────────────

// ── NAVIGATION ───────────────────────────────────────────────────

function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + pageId).classList.add('active');
  const btn = document.querySelector('[data-page="' + pageId + '"]');
  if (btn) btn.classList.add('active');
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => goTo(btn.dataset.page));
});


// ── UPLOAD / DEMO ─────────────────────────────────────────────────

function startAnalysis() {
  document.getElementById('analyzing').style.display = 'block';
  setTimeout(() => {
    document.getElementById('upload-section').style.display = 'none';
    document.getElementById('demo-section').style.display = 'block';
  }, 2200);
}


// ── TERM DECODER ─────────────────────────────────────────────────

const TERMS = [
  {
    name: 'Capitalization',
    preview: 'When unpaid interest becomes principal',
    definition: "When you don't pay interest while in school, it accumulates silently. At graduation, all unpaid interest gets added to your original loan balance — and you now pay interest on that larger number. On your $8k private loan over 4 years, this adds ~$2,800 that then compounds against you for 10 years of repayment."
  },
  {
    name: 'Forbearance',
    preview: 'Pausing payments — interest still runs',
    definition: "A temporary pause on loan payments for financial hardship. Sounds helpful — but interest keeps accruing the entire time. When forbearance ends, all accumulated interest capitalizes onto your principal. Use it only as an absolute last resort."
  },
  {
    name: 'Variable rate',
    preview: 'Interest rate tied to market conditions',
    definition: "An interest rate that rises and falls with a market index. Your Sallie Mae loan at '6.99–14.5% variable' could more than double if rates spike. Always calculate your worst-case payment at the ceiling, not the advertised starting rate."
  },
  {
    name: 'Fixed rate',
    preview: 'Locked in forever — no surprises',
    definition: "An interest rate set at origination that never changes. Your federal loans are fixed at 5.50%. Almost always better for student borrowers — you can plan exactly what you'll owe every month for the full life of the loan."
  },
  {
    name: 'Grace period',
    preview: 'Time before your first payment is due',
    definition: "The window between leaving school and your first required payment. Federal loans give 6 months. Your Sallie Mae loan has zero — payments begin immediately after graduating or dropping below half-time."
  },
  {
    name: 'Origination fee',
    preview: 'A fee taken before you see the money',
    definition: "A fee deducted from your loan before it hits your account. A $10,000 loan with a 1.057% fee deposits $9,894 — but you owe $10,000 plus interest from day one."
  },
  {
    name: 'SAP',
    preview: 'Satisfactory Academic Progress rule',
    definition: "Federal law requires you to maintain a minimum GPA AND complete a minimum percentage of attempted credits to keep receiving aid. At NJIT, failing or withdrawing from too many courses can suspend your entire financial aid package."
  },
  {
    name: 'Disbursement',
    preview: 'When your aid money is released',
    definition: "The date NJIT releases financial aid to your account. If aid exceeds tuition you receive a refund — but loan portions of that refund must be repaid with interest. Don't spend it without knowing where it came from."
  },
  {
    name: 'Subsidized loan',
    preview: 'Govt pays your interest while in school',
    definition: "A federal loan where the government covers interest while you're enrolled at least half-time. Your $3,500 federal loan is subsidized — no interest builds until 6 months after leaving school."
  },
  {
    name: 'EOF Grant',
    preview: "NJ grant for first-gen students — often missed",
    definition: "Educational Opportunity Fund — NJ's grant for first-generation, low-income students. Worth $2,000–$5,000/year on top of TAG at NJIT. Many eligible students never apply. Email eof@njit.edu to check."
  },
  {
    name: 'TAG Grant',
    preview: "New Jersey's main state grant",
    definition: "The Tuition Aid Grant is NJ's primary state grant for residents attending NJ colleges. Never needs to be repaid. Must renew annually via FAFSA. You're currently receiving $3,500."
  },
  {
    name: 'Auto-debit discount',
    preview: '0.25% rate cut that can vanish permanently',
    definition: "Many lenders offer a 0.25% rate reduction for auto-pay enrollment. If a single payment bounces, many lenders remove the discount permanently. Use a dedicated account with always-sufficient funds."
  },
];

function buildTerms() {
  const grid = document.getElementById('terms-grid');
  let openIndex = null;

  TERMS.forEach((term, i) => {
    const card = document.createElement('div');
    card.className = 'term-card';
    card.innerHTML = `
      <div class="term-header">
        <div>
          <div class="term-name">${term.name}</div>
          <div class="term-preview">${term.preview}</div>
        </div>
        <div class="term-arrow">▼</div>
      </div>
      <div class="term-definition">${term.definition}</div>
    `;

    card.addEventListener('click', () => {
      if (openIndex === i) {
        card.classList.remove('open');
        openIndex = null;
      } else {
        document.querySelectorAll('.term-card').forEach(c => c.classList.remove('open'));
        card.classList.add('open');
        openIndex = i;
      }
    });

    grid.appendChild(card);
  });
}

buildTerms();


// ── CHAT ─────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Debt Decoder AI, a financial aid advisor built specifically for NJIT (New Jersey Institute of Technology) students. The student's documents include:
- Highlander Merit Scholarship: $12,000/year renewable, requires 3.5 GPA minimum each semester, 15 credits/semester minimum, STEM majors only
- NJ TAG Grant: $3,500/year, must renew via FAFSA annually
- Federal Subsidized Loan: $3,500 at 5.50% fixed, government pays interest during school, 6-month grace period
- Private Sallie Mae Loan: $8,000 at 6.99–14.5% variable, NO grace period, interest accruing now (~$2,800 capitalization by graduation)
- Total cost: $34,200/year, remaining owed: $15,700/year

You are knowledgeable about NJIT-specific programs (Highlander Grant, EOF, food pantry, emergency fund), NJ state aid (TAG, EOF), NJIT co-op program impacts on financial aid, visa transitions and tuition classification appeals, and SAP rules.
Contacts: financialaid@njit.edu, eof@njit.edu, registrar@njit.edu, 973-596-3466 (Dean of Students).

Be direct, specific, and use plain language. Quantify in real dollars whenever possible. Be an advocate for the student. Keep responses to 3-5 sentences.`;

const SUGGESTED_QUESTIONS = [
  "What if my GPA drops below 3.5?",
  "What does capitalization mean for me?",
  "What if I do a co-op semester?",
  "Am I missing any NJ state aid?",
  "Can I appeal if I lose my scholarship?",
  "Should I pay interest on my private loan now?",
  "What happens if I withdraw from a class?",
  "What is SAP and how does it affect me?",
];

let chatHistory = [];
let chatBusy = false;

function buildSuggestions() {
  const container = document.getElementById('chat-suggestions');
  SUGGESTED_QUESTIONS.forEach(q => {
    const chip = document.createElement('span');
    chip.className = 'suggestion-chip';
    chip.textContent = q;
    chip.addEventListener('click', () => sendMessage(q));
    container.appendChild(chip);
  });
}

buildSuggestions();

async function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || chatBusy) return;
  input.value = '';
  await sendMessage(text);
}

async function sendMessage(text) {
  if (chatBusy) return;
  chatBusy = true;
  document.getElementById('chat-send-btn').disabled = true;

  appendMessage(text, 'user');
  chatHistory.push({ role: 'user', content: text });

  // Show typing indicator
  const log = document.getElementById('chat-log');
  const typingEl = document.createElement('div');
  typingEl.className = 'message bot';
  typingEl.innerHTML = `
    <div class="typing-dots">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  log.appendChild(typingEl);
  log.scrollTop = log.scrollHeight;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: chatHistory,
      }),
    });

    const data = await res.json();
    const reply = data.content?.[0]?.text || 'Sorry, I had trouble responding. Please try again.';
    typingEl.remove();
    appendMessage(reply, 'bot');
    chatHistory.push({ role: 'assistant', content: reply });

  } catch (err) {
    typingEl.remove();
    appendMessage('Connection issue — please try again in a moment.', 'bot');
  }

  chatBusy = false;
  document.getElementById('chat-send-btn').disabled = false;
}

function appendMessage(text, type) {
  const log = document.getElementById('chat-log');
  const el = document.createElement('div');
  el.className = 'message ' + type;
  el.textContent = text;
  log.appendChild(el);
  log.scrollTop = log.scrollHeight;
}

// Enter key to send
document.getElementById('chat-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChat();
});


// ── APPEAL LETTER ─────────────────────────────────────────────────

const DEFAULT_LETTER = `Dear Stevens Institute of Technology Office of Financial Aid,

I am writing to respectfully request a reconsideration of my financial aid award for the upcoming academic year. I have been accepted to Stevens and am genuinely excited about the program and the opportunities it offers.

After carefully reviewing my financial aid options, I have received a significantly more competitive offer from another institution that I must consider seriously.

New Jersey Institute of Technology has offered me the following:
  · Highlander Merit Scholarship: $12,000/year (renewable for 4 years — $48,000 total)
  · NJ TAG Grant: $3,500/year
  · Federal Subsidized Loan: $3,500
  · True annual net cost: $15,700

My current Stevens award, while generous in year one, includes a one-time scholarship that does not renew — resulting in a net cost difference of approximately $12,700 per year beginning in year two, and a projected 4-year debt difference of over $57,000.

I believe strongly in the value of a Stevens education and would sincerely prefer to attend if the financial gap can be narrowed. I would be grateful for any additional merit aid, renewable grants, or institutional funding you are able to offer.

I am happy to provide a copy of my competing offer letter or any additional documentation. I look forward to your response and appreciate your time.

Sincerely,
[Your Full Name]
[NJIT Applicant ID] | [Stevens Application ID]
[Email Address] | [Phone Number]
[Date]`;

document.getElementById('appeal-letter').value = DEFAULT_LETTER;

function copyLetter() {
  navigator.clipboard.writeText(document.getElementById('appeal-letter').value).then(() => {
    const btn = document.getElementById('copy-btn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = 'Copy Letter', 2000);
  });
}

function resetLetter() {
  document.getElementById('appeal-letter').value = DEFAULT_LETTER;
}


// ── CAPITALIZATION CALCULATOR ─────────────────────────────────────

function updateCap() {
  const loan  = parseInt(document.getElementById('slider-loan').value);
  const rate  = parseFloat(document.getElementById('slider-rate').value);
  const years = parseInt(document.getElementById('slider-years').value);

  const accrued  = Math.round(loan * (rate / 100) * years);
  const capBal   = loan + accrued;
  const monthly  = Math.round(loan * (rate / 100) / 12);
  const extraCost = Math.round(accrued * (rate / 100) * 5);

  document.getElementById('out-loan').textContent  = '$' + loan.toLocaleString();
  document.getElementById('out-rate').textContent  = rate.toFixed(1) + '%';
  document.getElementById('out-years').textContent = years + (years === 1 ? ' year' : ' years');

  document.getElementById('cr-original').textContent = '$' + loan.toLocaleString();
  document.getElementById('cr-accrued').textContent  = '+$' + accrued.toLocaleString();
  document.getElementById('cr-monthly').textContent  = '~$' + monthly + '/mo';
  document.getElementById('cr-total').textContent    = '$' + capBal.toLocaleString();

  document.getElementById('cap-insight').innerHTML =
    `That extra <strong>$${accrued.toLocaleString()}</strong> doesn't sit still — you now pay ${rate.toFixed(1)}% on ` +
    `<strong>$${capBal.toLocaleString()}</strong> instead of $${loan.toLocaleString()}. ` +
    `Over a 10-year repayment, this costs roughly <strong>$${extraCost.toLocaleString()}</strong> ` +
    `more than if you'd paid the interest during school (~$${monthly}/month).`;

  document.getElementById('cap-green-title').textContent =
    `How to fight it: pay ~$${monthly}/month now`;

  document.getElementById('cap-green-body').textContent =
    `Paying just the monthly interest during school prevents $${accrued.toLocaleString()} from capitalizing. ` +
    `Your federal subsidized loan avoids this entirely — the government pays that interest. ` +
    `Focus these payments on your private loan.`;
}
