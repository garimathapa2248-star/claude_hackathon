function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  if (btn) btn.classList.add('active');
}

function loadDemo() {
  document.getElementById('upload-section').style.display = 'none';
  document.getElementById('demo-section').style.display = 'block';
}

function toggleTerm(el) {
  const def = el.querySelector('.term-def');
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.term-card').forEach(c => {
    c.classList.remove('open');
    c.querySelector('.term-def').classList.remove('show');
  });
  if (!wasOpen) {
    el.classList.add('open');
    def.classList.add('show');
  }
}

const answers = {
  "What if my GPA drops below 3.5?": "If your cumulative GPA drops below 3.5 at any semester end, you'll lose the Highlander Scholarship for the following year — that's $12,000 gone. You'd need to cover that gap with additional loans or out-of-pocket funds. The silver lining: NJIT does have a scholarship reinstatement appeal process for documented hardship cases (medical, family emergency, mental health crisis). If this happens, email financialaid@njit.edu immediately and document everything. Don't wait.",
  "What does capitalization mean for me?": "Your Sallie Mae private loan is accruing interest every single day right now. At 7% on $8,000, that's about $1.53/day. Over 4 years in school, roughly $2,240–$2,800 in interest will have accumulated. At repayment start, that entire pile of interest gets added to your $8,000 principal — you now owe ~$10,800 and pay interest on that bigger number for 10 years. That capitalization alone costs you roughly $800 extra in total interest. One option: pay just the interest during school (~$47/month) to prevent this entirely.",
  "What happens if I do a co-op semester?": "This is an important NJIT-specific situation. If your co-op requires dropping to part-time enrollment, here's what triggers: (1) Your Highlander Scholarship requires full-time enrollment — you could lose it for that semester. (2) Your TAG grant also has enrollment requirements. (3) Your private loan may trigger repayment if you drop below half-time. (4) If you're on F-1 visa, reduced enrollment requires prior authorization from the International Student Services office. Before accepting any co-op that changes your enrollment status, visit financialaid@njit.edu. They sometimes have hardship exceptions or co-op deferment options.",
  "Am I missing any NJ state aid?": "You're currently receiving TAG ($3,500) which is great — that's NJIT's main NJ state aid. However, if you're a first-generation, low-income NJ student, you may also qualify for EOF (Educational Opportunity Fund) grants of $2,000–$5,000/year that aren't showing in your current package. EOF is separate from TAG and many eligible students never apply simply because nobody told them it exists. Email eof@njit.edu with your NJIT ID and ask directly if you qualify. Even if you're unsure, ask — the worst they can say is no.",
  "Can I appeal if I lose my scholarship?": "Yes — and this is one of the most underused options at NJIT. If you lose the Highlander Scholarship due to GPA or credit hours, you can file a formal appeal citing documented hardship. This includes: medical issues (get a doctor's letter), family emergencies (documentation from Dean of Students), mental health crises (counseling center documentation), or other extenuating circumstances. File as soon as possible after the semester ends — don't wait until next semester starts. Email financialaid@njit.edu with subject 'Scholarship Reinstatement Appeal' and attach all documentation.",
  "Should I pay interest now while in school?": "Mathematically, yes — if you can afford it. Your private loan accrues ~$47/month in interest right now. If you pay that monthly during school, you prevent ~$2,800 from capitalizing at graduation. That $2,800 would otherwise cost you about $800 more in total interest over 10 years. So you'd spend ~$2,256 over 4 years in school to save ~$800 later — the math slightly favors not paying it. But preventing capitalization gives you peace of mind and a lower balance from day one of repayment. If $47/month is manageable for you, it's a good habit to build."
};

function askSug(el) {
  const q = el.textContent;
  addMessage(q, 'user');
  showTyping();
  setTimeout(() => {
    removeTyping();
    addMessage(answers[q] || "That's a great question about your specific situation. Based on your NJIT documents, I'd recommend reaching out to financialaid@njit.edu directly about this — they can give you the most accurate answer for your specific package.", 'bot');
  }, 1400);
}

function sendMsg() {
  const inp = document.getElementById('chat-input');
  const val = inp.value.trim();
  if (!val) return;
  inp.value = '';
  addMessage(val, 'user');
  showTyping();
  setTimeout(() => {
    removeTyping();
    const lower = val.toLowerCase();
    let reply = "Based on your NJIT financial aid documents, I can see this relates to your overall package. For the most accurate guidance specific to your situation, I'd recommend also checking with NJIT's financial aid office at financialaid@njit.edu — but here's what I can tell you from your documents: your biggest financial risk right now is the variable rate private loan, followed by the scholarship GPA requirement. Would you like me to explain either of those in more detail?";
    if (lower.includes('withdraw')) reply = "Before you withdraw from any class, please understand the chain reaction it can trigger: dropping below full-time affects your Highlander Scholarship (requires full-time), your TAG grant, your private loan repayment terms, and if you're on F-1 visa, your immigration status. Talk to financialaid@njit.edu BEFORE submitting the withdrawal. They may have alternatives like a late withdrawal, incomplete grade, or hardship exception that doesn't trigger these consequences.";
    if (lower.includes('appeal')) reply = "You have the right to appeal both scholarship loss and financial aid suspension at NJIT. For scholarship appeals: email financialaid@njit.edu with 'Scholarship Reinstatement Appeal' as subject, and attach documentation of the hardship (medical, family, mental health). For SAP (academic progress) appeals: same office, subject 'SAP Appeal'. File as soon as possible — timing matters significantly.";
    if (lower.includes('eof') || lower.includes('first gen') || lower.includes('first-gen')) reply = "EOF (Educational Opportunity Fund) is NJ's grant specifically for first-generation, low-income students at NJ colleges. At NJIT, EOF students can receive $2,000–$5,000/year in additional grants beyond TAG. It also includes academic support, mentoring, and a summer bridge program. If you haven't applied, email eof@njit.edu with your NJIT ID. If you're already an EOF student, you also have access to emergency funds through their office specifically.";
    addMessage(reply, 'bot');
  }, 1600);
}

function addMessage(text, type) {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg ' + type;
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function showTyping() {
  const log = document.getElementById('chat-log');
  const div = document.createElement('div');
  div.className = 'msg bot typing-msg';
  div.innerHTML = '<div class="typing-dots"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>';
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function removeTyping() {
  const t = document.querySelector('.typing-msg');
  if (t) t.remove();
}

