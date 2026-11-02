/* Project-only, click-to-load official music player and optional narration. */
(() => {
  const musicButton = document.querySelector('#music-toggle');
  const voiceButton = document.querySelector('#narration-toggle');
  const stopButton = document.querySelector('#sound-stop');
  const status = document.querySelector('#sound-status');
  const player = document.querySelector('#music-player');
  const frameHost = document.querySelector('#music-frame');
  if (!musicButton || !voiceButton || !stopButton || !status || !player || !frameHost) return;
  let mode = 'off', generation = 0;
  const narration = '这里是 Gary 的 VectorDrive 二八零八，矢驱电机工程。'
    + '从四层电路板、焊接装配，到 STM 三二电流闭环和中文 CAN 上位机，把硬件和软件连成一套完整系统。'
    + '页面展示的照片、上位机截图和曲线，来自真实装配与实板记录。'
    + '短脉冲测试中，正负一百毫安目标的平均反馈接近目标。高速限压和持续带载能力，还在继续验证。'
    + '向下了解工程细节，也可以在 GitHub 查看源码、下载软件和复现实验。';

  function update(label) {
    status.textContent = label;
    musicButton.setAttribute('aria-pressed', String(mode === 'music'));
    musicButton.setAttribute('aria-expanded', String(mode === 'music'));
    voiceButton.setAttribute('aria-pressed', String(mode === 'voice'));
  }

  function stop(label = '音乐与旁白 · 点击开启') {
    generation++;
    mode = 'off';
    frameHost.replaceChildren(); // Removing the player also stops its media.
    player.hidden = true;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    update(label);
  }

  musicButton.addEventListener('click', () => {
    if (mode === 'music') { stop(); return; }
    stop();
    const frame = document.createElement('iframe');
    frame.src = 'https://open.spotify.com/embed/track/6YbhspuOar1D9WSSnfe7ds?theme=0';
    frame.title = 'Young, Wild & Free (feat. Bruno Mars) — Spotify 官方播放器';
    frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.height = '152';
    frame.width = '100%';
    frameHost.append(frame);
    player.hidden = false;
    mode = 'music';
    update('Young, Wild & Free · 点击播放器播放');
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
    speech.onerror = () => { if (request === generation) stop('当前浏览器的旁白暂不可用'); };
    mode = 'voice';
    update('正在讲述 / VectorDrive 工程');
    speechSynthesis.speak(speech);
  });

  stopButton.addEventListener('click', () => stop());
  document.addEventListener('visibilitychange', () => { if (document.hidden && mode !== 'off') stop(); });
  window.addEventListener('pagehide', () => stop());
})();
