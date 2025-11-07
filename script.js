// Mobile menu
function toggleMenu(){
  document.getElementById('navlinks').classList.toggle('open');
}

// Video preview modal
const watchPreviewBtn = document.getElementById('watchPreviewBtn');
const videoPreviewTrigger = document.querySelector('[data-preview-trigger]');
const videoModal      = document.getElementById('videoModal');
const videoModalClose = document.querySelector('.video-modal-close');
const modalIframe     = document.getElementById('videoModalFrame');
const previewIframe   = document.getElementById('previewIframe');
const modalBaseSrc    = modalIframe ? modalIframe.dataset.src : '';
const ticker          = document.getElementById('ticker');

function openVideoModal(){
  if(!videoModal) return;
  videoModal.style.display = 'flex';
  videoModal.classList.add('open');
  document.body.classList.add('modal-open');
  if(modalIframe){
    const src = modalBaseSrc.includes('?') ? `${modalBaseSrc}&autoplay=1` : `${modalBaseSrc}?autoplay=1`;
    modalIframe.src = src;
  }

  // pause ticker scroll while the video is open
  if(ticker){
    ticker.classList.add('ticker-paused');
  }
}

function closeVideoModal(){
  if(!videoModal) return;
  videoModal.classList.remove('open');
  videoModal.style.display = 'none';
  document.body.classList.remove('modal-open');
  if(modalIframe){
    modalIframe.src = '';
  }

  if(ticker){
    ticker.classList.remove('ticker-paused');
  }
}

if(watchPreviewBtn){
  watchPreviewBtn.addEventListener('click', function(e){
    e.preventDefault();
    openVideoModal();
  });
}

if(videoPreviewTrigger){
  videoPreviewTrigger.addEventListener('click', openVideoModal);
  videoPreviewTrigger.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      openVideoModal();
    }
  });
}

if(videoModalClose){
  videoModalClose.addEventListener('click', closeVideoModal);
}

if(videoModal){
  videoModal.addEventListener('click', (e)=>{
    if(e.target === videoModal){
      closeVideoModal();
    }
  });
}

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape' && videoModal && videoModal.classList.contains('open')){
    closeVideoModal();
  }
});

if(previewIframe){
  previewIframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
}

// Smooth scroll for on‑page anchors
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href^="#"]');
  if(!a || a.id === 'watchPreviewBtn' || a.dataset.emailInterest) return;
  const id = a.getAttribute('href');
  if(id.length > 1){
    const el = document.querySelector(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', id);
    }
  }
});

// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Email capture for interest buttons (mock flow)

function isValidEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function createToast(message, background){
  const toast = document.createElement('div');
  toast.style.cssText = `position:fixed; top:20px; right:20px; padding:16px 22px; border-radius:12px; color:#fff; font-weight:600; z-index:10000; box-shadow:0 10px 30px rgba(0,0,0,.35); background:${background}; max-width:320px; line-height:1.4;`;
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(()=>{
    toast.style.opacity = '1';
    toast.style.transition = 'opacity .3s';
  });
  setTimeout(()=>{
    toast.style.opacity = '0';
    setTimeout(()=>toast.remove(), 300);
  }, 3200);
}

function showSuccessMessage(message){
  createToast(message, 'linear-gradient(135deg, #0ea5e9, #14b8a6)');
}

function showErrorMessage(message){
  createToast(message, 'linear-gradient(135deg, #ef4444, #b91c1c)');
}

// Email Modal Functions
let currentInterest = '';

function showEmailModal(interest){
  currentInterest = interest;
  const emailModal = document.getElementById('emailModal');
  const emailModalTitle = document.getElementById('emailModalTitle');
  const emailModalSubtitle = document.getElementById('emailModalSubtitle');
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  
  // Update modal content based on interest
  emailModalTitle.textContent = `Request ${interest}`;
  emailModalSubtitle.textContent = `Enter your email to get notified about ${interest}`;
  
  // Reset form
  emailInput.value = '';
  emailError.style.display = 'none';
  emailInput.classList.remove('error');
  
  // Show modal
  emailModal.style.display = 'flex';
  setTimeout(() => emailInput.focus(), 100);
}

function closeEmailModal(){
  const emailModal = document.getElementById('emailModal');
  emailModal.style.display = 'none';
  currentInterest = '';
}

function handleEmailSubmit(){
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const email = emailInput.value.trim();
  
  if(email && isValidEmail(email)){
    emailError.style.display = 'none';
    emailInput.classList.remove('error');
    showSuccessMessage(`Thanks! We'll reach out about ${currentInterest}.`);
    closeEmailModal();
  } else if(email){
    // Invalid email format
    emailError.style.display = 'block';
    emailInput.classList.add('error');
    emailInput.focus();
  } else {
    emailError.style.display = 'block';
    emailInput.classList.add('error');
    emailInput.focus();
  }
}

function handleEmailSkip(){
  closeEmailModal();
}

function handleEmailInterest(){
  showSuccessMessage(`Thanks! We recorded your interest in ${currentInterest}.`);
  closeEmailModal();
}

// Modal handling for Join Waitlist - wait for DOM
document.addEventListener('DOMContentLoaded', function(){
  const waitlistButtons = document.querySelectorAll('[data-email-interest="Join Waitlist"]');
  const waitlistModal = document.getElementById('waitlistModal');
  const modalClose = document.querySelector('.modal-close');
  const modalOptionButtons = document.querySelectorAll('.modal-option-btn');
  
  // Email modal elements
  const emailModal = document.getElementById('emailModal');
  const emailModalClose = document.querySelector('.email-modal-close');
  const emailInput = document.getElementById('emailInput');
  const emailSendBtn = document.getElementById('emailSendBtn');
  const emailInterestBtn = document.getElementById('emailInterestBtn');
  const emailSkipBtn = document.getElementById('emailSkipBtn');

  if(!waitlistModal || !modalClose || !emailModal) return;

  // Open modal when Join Waitlist is clicked
  waitlistButtons.forEach((btn)=>{
    btn.addEventListener('click', (event)=>{
      event.preventDefault();
      waitlistModal.style.display = 'flex';
    });
  });

  // Close waitlist modal when X is clicked
  modalClose.addEventListener('click', ()=>{
    waitlistModal.style.display = 'none';
  });

  // Close waitlist modal when clicking outside
  waitlistModal.addEventListener('click', (e)=>{
    if(e.target === waitlistModal){
      waitlistModal.style.display = 'none';
    }
  });

  // Handle option selection in waitlist modal
  modalOptionButtons.forEach((btn)=>{
    btn.addEventListener('click', ()=>{
      const interest = btn.dataset.option;
      waitlistModal.style.display = 'none';
      showEmailModal(interest);
    });
  });

  // Email modal handlers
  emailModalClose.addEventListener('click', handleEmailSkip);
  
  emailModal.addEventListener('click', (e)=>{
    if(e.target === emailModal){
      handleEmailSkip();
    }
  });

  emailSendBtn.addEventListener('click', handleEmailSubmit);
  emailInterestBtn.addEventListener('click', handleEmailInterest);
  emailSkipBtn.addEventListener('click', handleEmailSkip);
  
  // Handle Enter key in email input
  emailInput.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter'){
      handleEmailSubmit();
    }
  });
});

// Direct access buttons (not Join Waitlist)
document.addEventListener('DOMContentLoaded', function(){
  const directAccessButtons = document.querySelectorAll('[data-email-interest]:not([data-email-interest="Join Waitlist"])');
  directAccessButtons.forEach((btn)=>{
    btn.addEventListener('click', (event)=>{
      event.preventDefault();
      const interest = btn.dataset.emailInterest || 'Interest';
      showEmailModal(interest);
    });
  });
});

// Smooth ticker auto-scroll - infinite carousel with no gaps
(function(){
  const ticker = document.getElementById('ticker');
  if(!ticker) return;
  const tickerContent = document.getElementById('tickerContent');
  if(!tickerContent) return;
  
  // Wait for DOM to be ready
  setTimeout(() => {
    const originalItems = Array.from(tickerContent.children);
    if(originalItems.length === 0) return;
    
    // Calculate dimensions
    const itemHeight = originalItems[0].offsetHeight || 48;
    const tickerHeight = ticker.offsetHeight;
    const visibleCount = Math.ceil(tickerHeight / itemHeight) || 3;
    
    // Ensure we have enough items to fill visible area + buffer
    const totalNeeded = visibleCount + 2;
    const repeatTimes = Math.ceil(totalNeeded / originalItems.length) + 1;
    
    // Clone items to create seamless loop
    for(let i = 0; i < repeatTimes; i++){
      originalItems.forEach(item => {
        const clone = item.cloneNode(true);
        tickerContent.appendChild(clone);
      });
    }
    
    let currentIndex = 0;
    const totalOriginalItems = originalItems.length;
    
    // Set transition style
    tickerContent.style.transition = 'transform 0.6s ease-in-out';
    
    function scrollNext(){
      if(document.body.classList.contains('modal-open')) return;
      currentIndex++;
      const translateY = currentIndex * itemHeight;

      if(currentIndex >= totalOriginalItems){
        currentIndex = 0;
        tickerContent.style.transition = 'none';
        tickerContent.style.transform = 'translateY(0)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            tickerContent.style.transition = 'transform 0.6s ease-in-out';
          }, 50);
        });
      } else {
        tickerContent.style.transform = `translateY(-${translateY}px)`;
      }
    }

    setInterval(scrollNext, 2500);
  }, 200);
})();

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach((e)=>{
    if(e.isIntersecting){
      e.target.animate([
        {opacity:0, transform:'translateY(18px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:500, easing:'ease-out', fill:'forwards'});
      io.unobserve(e.target);
    }
  })
}, {threshold:.12});
document.querySelectorAll('section .card, section h2, .feature').forEach(el=>io.observe(el));

