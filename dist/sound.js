/* Original synthesized 92 BPM hip-hop drums. No audio loads or starts on visit. */
(() => {
  const beatButton = document.querySelector('#beat-toggle');
  const voiceButton = document.querySelector('#narration-toggle');
  const stopButton = document.querySelector('#sound-stop');
  const status = document.querySelector('#sound-status');
  if (!beatButton || !voiceButton || !stopButton || !status) return;
  let context, master, noise, timer, step = 0, nextTime = 0, mode = 'off', generation = 0;
  const activeSources = new Set();
  const sixteenth = 60 / 92 / 4;
  const narration = '这里是 Gary 的 VectorDrive 二八零八，矢驱电机工程。'
    + '从四层电路板、焊接装配，到 STM 三二电流闭环和中文 CAN 上位机，把硬件和软件连成一套完整系统。'
    + '页面展示的照片、上位机截图和曲线，来自真实装配与实板记录。'
    + '短脉冲测试中，正负一百毫安目标的平均反馈接近目标。高速限压和持续带载能力，还在继续验证。'
    + '向下了解工程细节，也可以在 GitHub 查看源码、下载软件和复现实验。';

  function update(label) {
    status.textContent = label;
    beatButton.setAttribute('aria-pressed', String(mode === 'beat'));
    voiceButton.setAttribute('aria-pressed', String(mode === 'voice'));
  }

  function stop(label = '声音关闭') {
    generation++;
    mode = 'off';
    clearInterval(timer);
    timer = undefined;
    for (const source of activeSources) { try { source.stop(); } catch (_) {} }
    activeSources.clear();
    if (master && context) {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0, context.currentTime, .015);
    }
    if (context) context.suspend().catch(() => {});
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    update(label);
  }

  function initializeAudio() {
    if (context) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) throw new Error('Web Audio unavailable');
    context = new Audio();
    master = context.createGain();
    master.gain.value = 0;
    const limiter = context.createDynamicsCompressor();
    limiter.threshold.value = -12;
    limiter.ratio.value = 8;
    master.connect(limiter).connect(context.destination);
    noise = context.createBuffer(1, context.sampleRate, context.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }

  function oscillator(at, frequency, duration, amount, endFrequency) {
    const source = context.createOscillator();
    const envelope = context.createGain();
    source.type = 'sine';
    source.frequency.setValueAtTime(frequency, at);
    if (endFrequency) source.frequency.exponentialRampToValueAtTime(endFrequency, at + duration * .7);
    envelope.gain.setValueAtTime(.0001, at);
    envelope.gain.exponentialRampToValueAtTime(amount, at + .003);
    envelope.gain.exponentialRampToValueAtTime(.0001, at + duration);
    source.connect(envelope).connect(master);
    source.start(at);
    source.stop(at + duration + .01);
    activeSources.add(source);
    source.onended = () => { activeSources.delete(source); source.disconnect(); envelope.disconnect(); };
  }

  function percussion(at, duration, amount, frequency, type) {
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    source.buffer = noise;
    filter.type = type;
    filter.frequency.value = frequency;
    envelope.gain.setValueAtTime(amount, at);
    envelope.gain.exponentialRampToValueAtTime(.0001, at + duration);
    source.connect(filter).connect(envelope).connect(master);
    source.start(at);
    source.stop(at + duration + .01);
    activeSources.add(source);
    source.onended = () => { activeSources.delete(source); source.disconnect(); filter.disconnect(); envelope.disconnect(); };
  }

  function schedule() {
    if (mode !== 'beat') return;
    // After a delayed/background tick, discard missed beats instead of bursting.
    if (nextTime < context.currentTime) nextTime = context.currentTime + .02;
    while (nextTime < context.currentTime + .09) {
      const swing = step % 2 ? .014 : 0;
      const at = nextTime + swing;
      if ([0, 6, 8, 11, 14].includes(step)) oscillator(at, 145, .28, .85, 43);
      if (step === 4 || step === 12) {
        percussion(at, .14, .32, 1400, 'highpass');
        oscillator(at, 180, .09, .18);
      }
      if (step % 2 === 0 || step === 7 || step === 15) {
        percussion(at, step === 14 ? .10 : .035, step % 4 ? .12 : .19, 7500, 'highpass');
      }
      step = (step + 1) % 16;
      nextTime += sixteenth;
    }
  }

  beatButton.addEventListener('click', async () => {
    if (mode === 'beat') { stop(); return; }
    stop();
    const request = generation;
    try {
      initializeAudio();
      await context.resume();
      if (request !== generation) return;
      mode = 'beat';
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setValueAtTime(0, context.currentTime);
      master.gain.linearRampToValueAtTime(.16, context.currentTime + .12);
      step = 0;
      nextTime = context.currentTime + .03;
      schedule();
      timer = setInterval(schedule, 25);
      update('原创合成鼓点 / 92 BPM · 点击可关闭');
    } catch (_) { stop('浏览器暂不支持声音播放'); }
  });

  voiceButton.addEventListener('click', () => {
    if (mode === 'voice') { stop(); return; }
    stop();
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      update('当前浏览器不支持旁白');
      return;
    }
    const request = generation;
    const speech = new SpeechSynthesisUtterance(narration);
    speech.lang = 'zh-CN';
    speech.rate = .98;
    speech.volume = .7;
    const voices = speechSynthesis.getVoices();
    const chinese = voices.find(v => v.lang.toLowerCase() === 'zh-cn') || voices.find(v => v.lang.startsWith('zh'));
    if (chinese) speech.voice = chinese;
    speech.onend = () => { if (request === generation) stop('旁白结束 · 继续探索'); };
    speech.onerror = () => { if (request === generation) stop('旁白不可用，可以试听鼓点'); };
    mode = 'voice';
    update('正在讲述 / VectorDrive 工程');
    speechSynthesis.speak(speech);
  });

  stopButton.addEventListener('click', () => stop());
  document.addEventListener('visibilitychange', () => { if (document.hidden && mode !== 'off') stop(); });
  window.addEventListener('pagehide', () => stop());
})();
