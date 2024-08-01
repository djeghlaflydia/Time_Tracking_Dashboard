// Selecting the elements
const dailyLink = document.getElementById('daily');
const weeklyLink = document.getElementById('weekly');
const monthlyLink = document.getElementById('monthly');
const changeLabels = document.querySelectorAll('.change');
let maxTime = 86400000; // Default to 24h
dailyLink.classList.add('active');

// Update the text and maxTime based on the active link
const updateLabelsAndMaxTime = () => {
  changeLabels.forEach(label => {
    if (dailyLink.classList.contains('active')) {
      label.textContent = "Yesterday-";
      maxTime = 86400000; // 24 h
    } else if (weeklyLink.classList.contains('active')) {
      label.textContent = "Last Week-";
      maxTime = 168 * 3600000; // 168 h
    } else if (monthlyLink.classList.contains('active')) {
      label.textContent = "Last Month-";
      maxTime = 720 * 3600000; // 720 h
    }
  });
  localStorage.setItem('maxTime', maxTime); // Save maxTime in localStorage
};
updateLabelsAndMaxTime();

// Function to activate a link
const activateLink = (link) => {
  // Remove 'active' class from all links
  dailyLink.classList.remove('active');
  weeklyLink.classList.remove('active');
  monthlyLink.classList.remove('active');

  // Add 'active' class to the clicked link
  link.classList.add('active');

  // Update labels and maxTime based on the active link
  updateLabelsAndMaxTime();

  // Restart the background timers with the new max time if running
  if (WbackgroundRunning) {
    startBackgroundWorkTimer();
  }
  if (ExbackgroundRunning) {
    startBackgroundExerciceTimer();
  }
  if (PlbackgroundRunning) {
    startBackgroundPlayTimer();
  }
  if (SobackgroundRunning) {
    startBackgroundSocielTimer();
  }
  if (StbackgroundRunning) {
    startBackgroundStudyTimer();
  }
  if (SCbackgroundRunning) {
    startBackgroundSelfTimer();
  }
};

// Event listeners for each link
dailyLink.onclick = () => activateLink(dailyLink);
weeklyLink.onclick = () => activateLink(weeklyLink);
monthlyLink.onclick = () => activateLink(monthlyLink);


// Utility function to format time
function formatTime(time) {
  let hours = Math.floor(time / (1000 * 60 * 60));
  let minutes = Math.floor((time / (1000 * 60)) % 60);
  let seconds = Math.floor((time / 1000) % 60);

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}



// Work functionality
const Wdisplay = document.getElementById("HWork");
let Wchange = document.getElementById('Wchange');
let Wtimer = null;
let WstartTime = 0;
let WelapsedTime = 0;
let WisRunning = false;
let WbackgroundTimer = null;
let WbackgroundRunning = false;

function restoreWorkState() {
  const savedW = localStorage.getItem('W');
  const savedWIsRunning = localStorage.getItem('WIsRunning');
  const savedWStartTime = localStorage.getItem('WStartTime');
  const savedWChange = localStorage.getItem('WChange');
  const savedMaxTime = localStorage.getItem('maxTime');

  if (savedW !== null) {
    WelapsedTime = parseInt(savedW, 10);
    Wdisplay.textContent = formatTime(WelapsedTime);
  }

  if (savedWIsRunning === 'true') {
    WstartTime = parseInt(savedWStartTime, 10);
    Wtimer = setInterval(updateWork, 1000);
    WisRunning = true;
    maxTime = savedMaxTime ? parseInt(savedMaxTime, 10) : 86400000;
    startBackgroundWorkTimer(); // Start the background timer
  }
  if (savedWChange !== null) {
    Wchange.textContent = savedWChange;
  }
}

function startWork() {
  if (!WisRunning) {
    WstartTime = Date.now() - WelapsedTime;
    Wtimer = setInterval(updateWork, 1000);
    WisRunning = true;
    localStorage.setItem('WIsRunning', 'true');
    localStorage.setItem('WStartTime', WstartTime);
    localStorage.setItem('maxTime', maxTime);
    startBackgroundWorkTimer();
  }
}

function stopWork() {
  if (WisRunning) {
    clearInterval(Wtimer);
    WisRunning = false;
    localStorage.setItem('WIsRunning', 'false');
    localStorage.setItem('WStartTime', WstartTime);
  }
}

function resetWork() {
  stopWork();
  WelapsedTime = 0;
  Wdisplay.textContent = "00:00:00";
  localStorage.setItem('W', WelapsedTime);
  localStorage.setItem('WStartTime', 0);
  clearTimeout(WbackgroundTimer); // Stop any existing background timer
  WbackgroundRunning = false;
}

function updateWork() {
  const currentTime = Date.now();
  WelapsedTime = currentTime - WstartTime;
  Wdisplay.textContent = formatTime(WelapsedTime);
  localStorage.setItem('W', WelapsedTime);

  if (WelapsedTime >= maxTime) {
    updateLabelWithWorkTime();
    resetWork(); // Reset both timers
    startBackgroundWorkTimer(); // Automatically restart
  }
}

function updateLabelWithWorkTime() {
    const workTime = Wdisplay.textContent.split(':')[0]; // Get hours only
    Wchange.textContent = workTime;
    localStorage.setItem('WChange', workTime);
  }

function startBackgroundWorkTimer() {
  if (WbackgroundRunning) return;

  // Calculate remaining time until maxTime is reached
  const remainingTime = maxTime - WelapsedTime;

  // Set a timeout to stop the timer when maxTime is reached
  WbackgroundTimer = setTimeout(() => {
    updateLabelWithWorkTime();
    resetWork(); // Reset both timers
  }, remainingTime);

  WbackgroundRunning = true;
}

document.getElementById('WSelect').addEventListener('change', function() {
  const selectedValue = this.value;

  if (selectedValue === 'enable') {
    startWork();
  } else if (selectedValue === 'disable') {
    stopWork(); // Pause the foreground timer
  } else if (selectedValue === 'reset') {
    resetWork(); // Reset both foreground and background timers
  }
});



// Exercice functionality
const Exdisplay = document.getElementById("HExercice");
let Exchange = document.getElementById('ExChange');
let Extimer = null;
let ExstartTime = 0;
let ExelapsedTime = 0;
let ExisRunning = false;
let ExbackgroundTimer = null;
let ExbackgroundRunning = false;

function restoreExerciceState() {
  const savedEx = localStorage.getItem('Ex');
  const savedExIsRunning = localStorage.getItem('ExIsRunning');
  const savedExStartTime = localStorage.getItem('ExStartTime');
  const savedExChange = localStorage.getItem('ExChange');
  const savedExMaxTime = localStorage.getItem('maxTime');

  if (savedEx !== null) {
    ExelapsedTime = parseInt(savedEx, 10);
    Exdisplay.textContent = formatTime(ExelapsedTime);
  }

  if (savedExIsRunning === 'true') {
    ExstartTime = parseInt(savedExStartTime, 10);
    Extimer = setInterval(updateExercice, 1000);
    ExisRunning = true;
    maxTime = savedExMaxTime ? parseInt(savedExMaxTime, 10) : 86400000;
    startBackgroundExerciceTimer(); // Start the background timer
  }

  if (savedExChange !== null) {
    Exchange.textContent = savedExChange;
  }
}

function startExercice() {
  if (!ExisRunning) {
    ExstartTime = Date.now() - ExelapsedTime;
    Extimer = setInterval(updateExercice, 1000);
    ExisRunning = true;
    localStorage.setItem('ExIsRunning', 'true');
    localStorage.setItem('ExStartTime', ExstartTime);
    localStorage.setItem('maxTime', maxTime);
    startBackgroundExerciceTimer();
  }
}

function stopExercice() {
  if (ExisRunning) {
    clearInterval(Extimer);
    ExisRunning = false;
    localStorage.setItem('ExIsRunning', 'false');
    localStorage.setItem('ExStartTime', ExstartTime);
  }
}

function resetExercice() {
  stopExercice();
  ExelapsedTime = 0;
  Exdisplay.textContent = "00:00:00";
  localStorage.setItem('Ex', ExelapsedTime);
  localStorage.setItem('ExStartTime', 0);
  clearTimeout(ExbackgroundTimer); // Stop any existing background timer
  ExbackgroundRunning = false;
}

function updateExercice() {
  const currentTime = Date.now();
  ExelapsedTime = currentTime - ExstartTime;
  Exdisplay.textContent = formatTime(ExelapsedTime);
  localStorage.setItem('Ex', ExelapsedTime);

  if (ExelapsedTime >= maxTime) {
    updateLabelWithExerciceTime();
    resetExercice(); // Reset both timers
    startBackgroundExerciceTimer(); // Automatically restart
  }
}

function updateLabelWithExerciceTime() {
    const exerciceTime = Exdisplay.textContent.split(':')[0]; // Get hours only
    Exchange.textContent = exerciceTime;
    localStorage.setItem('ExChange', exerciceTime);
  }

function startBackgroundExerciceTimer() {
  if (ExbackgroundRunning) return;

  // Calculate remaining time until maxTime is reached
  const remainingTime = maxTime - ExelapsedTime;

  // Set a timeout to stop the timer when maxTime is reached
  ExbackgroundTimer = setTimeout(() => {
    updateLabelWithExerciceTime();
    resetExercice(); // Reset both timers
  }, remainingTime);

  ExbackgroundRunning = true;
}

document.getElementById('ExSelect').addEventListener('change', function() {
  const selectedValue = this.value;

  if (selectedValue === 'enable') {
    startExercice();
  } else if (selectedValue === 'disable') {
    stopExercice(); // Pause the foreground timer
  } else if (selectedValue === 'reset') {
    resetExercice(); // Reset both foreground and background timers
  }
});



// Play functionality
const Pldisplay = document.getElementById("HPlay");
let Plchange = document.getElementById('PlChange');
let Pltimer = null;
let PlstartTime = 0;
let PlelapsedTime = 0;
let PlisRunning = false;
let PlbackgroundTimer = null;
let PlbackgroundRunning = false;

function restorePlayState() {
  const savedPl = localStorage.getItem('Pl');
  const savedPlIsRunning = localStorage.getItem('PlIsRunning');
  const savedPlStartTime = localStorage.getItem('PlStartTime');
  const savedPlChange = localStorage.getItem('PlChange');
  const savedPlMaxTime = localStorage.getItem('maxTime');

  if (savedPl !== null) {
    PlelapsedTime = parseInt(savedPl, 10);
    Pldisplay.textContent = formatTime(PlelapsedTime);
  }

  if (savedPlIsRunning === 'true') {
    PlstartTime = parseInt(savedPlStartTime, 10);
    Pltimer = setInterval(updatePlay, 1000);
    PlisRunning = true;
    maxTime = savedPlMaxTime ? parseInt(savedPlMaxTime, 10) : 86400000;
    startBackgroundPlayTimer(); // Start the background timer
  }

  if (savedPlChange !== null) {
    Plchange.textContent = savedPlChange;
  }
}

function startPlay() {
  if (!PlisRunning) {
    PlstartTime = Date.now() - PlelapsedTime;
    Pltimer = setInterval(updatePlay, 1000);
    PlisRunning = true;
    localStorage.setItem('PlIsRunning', 'true');
    localStorage.setItem('PlStartTime', PlstartTime);
    localStorage.setItem('maxTime', maxTime);
    startBackgroundPlayTimer();
  }
}

function stopPlay() {
  if (PlisRunning) {
    clearInterval(Pltimer);
    PlisRunning = false;
    localStorage.setItem('PlIsRunning', 'false');
    localStorage.setItem('PlStartTime', PlstartTime);
  }
}

function resetPlay() {
  stopPlay();
  PlelapsedTime = 0;
  Pldisplay.textContent = "00:00:00";
  localStorage.setItem('Pl', PlelapsedTime);
  localStorage.setItem('PlStartTime', 0);
  clearTimeout(PlbackgroundTimer); // Stop any existing background timer
  PlbackgroundRunning = false;
}

function updatePlay() {
  const currentTime = Date.now();
  PlelapsedTime = currentTime - PlstartTime;
  Pldisplay.textContent = formatTime(PlelapsedTime);
  localStorage.setItem('Pl', PlelapsedTime);

  if (PlelapsedTime >= maxTime) {
    updateLabelWithPlayTime();
    resetPlay(); // Reset both timers
    startBackgroundPlayTimer(); // Automatically restart
  }
}

function updateLabelWithPlayTime() {
    const playTime = Pldisplay.textContent.split(':')[0]; // Get hours only
    Plchange.textContent = playTime;
    localStorage.setItem('PlChange', playTime);
  }

function startBackgroundPlayTimer() {
  if (PlbackgroundRunning) return;

  // Calculate remaining time until maxTime is reached
  const remainingTime = maxTime - PlelapsedTime;

  // Set a timeout to stop the timer when maxTime is reached
  PlbackgroundTimer = setTimeout(() => {
    updateLabelWithPlayTime();
    resetPlay(); // Reset both timers
  }, remainingTime);

  PlbackgroundRunning = true;
}

document.getElementById('PlSelect').addEventListener('change', function() {
  const selectedValue = this.value;

  if (selectedValue === 'enable') {
    startPlay();
  } else if (selectedValue === 'disable') {
    stopPlay(); // Pause the foreground timer
  } else if (selectedValue === 'reset') {
    resetPlay(); // Reset both foreground and background timers
  }
});



// Sociel functionality
const Sodisplay = document.getElementById("HSociel");
let Sochange = document.getElementById('SoChange');
let Sotimer = null;
let SostartTime = 0;
let SoelapsedTime = 0;
let SoisRunning = false;
let SobackgroundTimer = null;
let SobackgroundRunning = false;

function restoreSocielState() {
  const savedSo = localStorage.getItem('So');
  const savedSoIsRunning = localStorage.getItem('SoIsRunning');
  const savedSoStartTime = localStorage.getItem('SoStartTime');
  const savedSoChange = localStorage.getItem('SoChange');
  const savedSoMaxTime = localStorage.getItem('maxTime');

  if (savedSo !== null) {
    SoelapsedTime = parseInt(savedSo, 10);
    Sodisplay.textContent = formatTime(SoelapsedTime);
  }

  if (savedSoIsRunning === 'true') {
    SostartTime = parseInt(savedSoStartTime, 10);
    Sotimer = setInterval(updateSociel, 1000);
    SoisRunning = true;
    maxTime = savedSoMaxTime ? parseInt(savedSoMaxTime, 10) : 86400000;
    startBackgroundSocielTimer(); // Start the background timer
  }

  if (savedSoChange !== null) {
    Sochange.textContent = savedSoChange;
  }
}

function startSociel() {
  if (!SoisRunning) {
    SostartTime = Date.now() - SoelapsedTime;
    Sotimer = setInterval(updateSociel, 1000);
    SoisRunning = true;
    localStorage.setItem('SoIsRunning', 'true');
    localStorage.setItem('SoStartTime', SostartTime);
    localStorage.setItem('maxTime', maxTime);
    startBackgroundSocielTimer();
  }
}

function stopSociel() {
  if (SoisRunning) {
    clearInterval(Sotimer);
    SoisRunning = false;
    localStorage.setItem('SoIsRunning', 'false');
    localStorage.setItem('SoStartTime', SostartTime);
  }
}

function resetSociel() {
  stopSociel();
  SoelapsedTime = 0;
  Sodisplay.textContent = "00:00:00";
  localStorage.setItem('So', SoelapsedTime);
  localStorage.setItem('SoStartTime', 0);
  clearTimeout(SobackgroundTimer); // Stop any existing background timer
  SobackgroundRunning = false;
}

function updateSociel() {
  const currentTime = Date.now();
  SoelapsedTime = currentTime - SostartTime;
  Sodisplay.textContent = formatTime(SoelapsedTime);
  localStorage.setItem('So', SoelapsedTime);

  if (SoelapsedTime >= maxTime) {
    updateLabelWithSocielTime();
    resetSociel(); // Reset both timers
    startBackgroundSocielTimer(); // Automatically restart
  }
}

function updateLabelWithSocielTime() {
    const socielTime = Sodisplay.textContent.split(':')[0]; // Get hours only
    Sochange.textContent = socielTime;
    localStorage.setItem('SoChange', socielTime);
}

function startBackgroundSocielTimer() {
  if (SobackgroundRunning) return;

  // Calculate remaining time until maxTime is reached
  const remainingTime = maxTime - SoelapsedTime;

  // Set a timeout to stop the timer when maxTime is reached
  SobackgroundTimer = setTimeout(() => {
    updateLabelWithSocielTime();
    resetSociel(); // Reset both timers
  }, remainingTime);

  SobackgroundRunning = true;
}

document.getElementById('SoSelect').addEventListener('change', function() {
  const selectedValue = this.value;

  if (selectedValue === 'enable') {
    startSociel();
  } else if (selectedValue === 'disable') {
    stopSociel(); // Pause the foreground timer
  } else if (selectedValue === 'reset') {
    resetSociel(); // Reset both foreground and background timers
  }
});



// Study functionality
const Stdisplay = document.getElementById("HStudy");
let Stchange = document.getElementById('StChange');
let Sttimer = null;
let StstartTime = 0;
let StelapsedTime = 0;
let StisRunning = false;
let StbackgroundTimer = null;
let StbackgroundRunning = false;

function restoreStudyState() {
  const savedSt = localStorage.getItem('St');
  const savedStIsRunning = localStorage.getItem('StIsRunning');
  const savedStStartTime = localStorage.getItem('StStartTime');
  const savedStChange = localStorage.getItem('StChange');
  const savedStMaxTime = localStorage.getItem('maxTime');

  if (savedSt !== null) {
    StelapsedTime = parseInt(savedSt, 10);
    Stdisplay.textContent = formatTime(StelapsedTime);
  }

  if (savedStIsRunning === 'true') {
    StstartTime = parseInt(savedStStartTime, 10);
    Sttimer = setInterval(updateStudy, 1000);
    StisRunning = true;
    maxTime = savedStMaxTime ? parseInt(savedStMaxTime, 10) : maxTime;
    startBackgroundStudyTimer(); // Start the background timer
  }

  if (savedStChange !== null) {
    Stchange.textContent = savedStChange;
  }
}

function startStudy() {
  if (!StisRunning) {
    StstartTime = Date.now() - StelapsedTime;
    Sttimer = setInterval(updateStudy, 1000);
    StisRunning = true;
    localStorage.setItem('StIsRunning', 'true');
    localStorage.setItem('StStartTime', StstartTime);
    localStorage.setItem('maxTime', maxTime);
    startBackgroundStudyTimer();
  }
}

function stopStudy() {
  if (StisRunning) {
    clearInterval(Sttimer);
    StisRunning = false;
    localStorage.setItem('StIsRunning', 'false');
    localStorage.setItem('StStartTime', StstartTime);
  }
}

function resetStudy() {
  stopStudy();
  StelapsedTime = 0;
  Stdisplay.textContent = "00:00:00";
  localStorage.setItem('St', StelapsedTime);
  localStorage.setItem('StStartTime', 0);
  clearTimeout(StbackgroundTimer); // Stop any existing background timer
  StbackgroundRunning = false;
}

function updateStudy() {
  const currentTime = Date.now();
  StelapsedTime = currentTime - StstartTime;
  Stdisplay.textContent = formatTime(StelapsedTime);
  localStorage.setItem('St', StelapsedTime);

  if (StelapsedTime >= maxTime) {
    updateLabelWithStudyTime();
    resetStudy(); // Reset both timers
    startBackgroundStudyTimer(); // Automatically restart
  }
}

function updateLabelWithStudyTime() {
    const studyTime = Stdisplay.textContent.split(':')[0]; // Get hours only
    Stchange.textContent = studyTime;
    localStorage.setItem('StChange', studyTime);
}

function startBackgroundStudyTimer() {
  if (StbackgroundRunning) return;

  // Calculate remaining time until maxTime is reached
  const remainingTime = maxTime - StelapsedTime;

  // Set a timeout to stop the timer when maxTime is reached
  StbackgroundTimer = setTimeout(() => {
    updateLabelWithStudyTime();
    resetStudy(); // Reset both timers
  }, remainingTime);

  StbackgroundRunning = true;
}

document.getElementById('Stselect').addEventListener('change', function() {
  const selectedValue = this.value;

  if (selectedValue === 'enable') {
    startStudy();
  } else if (selectedValue === 'disable') {
    stopStudy(); // Pause the foreground timer
  } else if (selectedValue === 'reset') {
    resetStudy(); // Reset both foreground and background timers
  }
});


// Self Care functionality
const SCdisplay = document.getElementById("HSelf");
let SCchange = document.getElementById('SCChange');
let SCtimer = null;
let SCstartTime = 0;
let SCelapsedTime = 0;
let SCisRunning = false;
let SCbackgroundTimer = null;
let SCbackgroundRunning = false;

function restoreSelfState() {
  const savedSC = localStorage.getItem('SC');
  const savedSCIsRunning = localStorage.getItem('SCIsRunning');
  const savedSCStartTime = localStorage.getItem('SCStartTime');
  const savedSCChange = localStorage.getItem('SCChange');
  const savedSCMaxTime = localStorage.getItem('maxTime');

  if (savedSC !== null) {
    SCelapsedTime = parseInt(savedSC, 10);
    SCdisplay.textContent = formatTime(SCelapsedTime);
  }

  if (savedSCIsRunning === 'true') {
    SCstartTime = parseInt(savedSCStartTime, 10);
    SCtimer = setInterval(updateSelf, 1000);
    SCisRunning = true;
    maxTime = savedSCMaxTime ? parseInt(savedSCMaxTime, 10) : maxTime;
    startBackgroundSelfTimer(); // Start the background timer
  }

  if (savedSCChange !== null) {
    SCchange.textContent = savedSCChange;
  }
}

function startSelf() {
  if (!SCisRunning) {
    SCstartTime = Date.now() - SCelapsedTime;
    SCtimer = setInterval(updateSelf, 1000);
    SCisRunning = true;
    localStorage.setItem('SCIsRunning', 'true');
    localStorage.setItem('SCStartTime', SCstartTime);
    localStorage.setItem('maxTime', maxTime);
    startBackgroundSelfTimer();
  }
}

function stopSelf() {
  if (SCisRunning) {
    clearInterval(SCtimer);
    SCisRunning = false;
    localStorage.setItem('SCIsRunning', 'false');
    localStorage.setItem('SCStartTime', SCstartTime);
  }
}

function resetSelf() {
  stopSelf();
  SCelapsedTime = 0;
  SCdisplay.textContent = "00:00:00";
  localStorage.setItem('SC', SCelapsedTime);
  localStorage.setItem('SCStartTime', 0);
  clearTimeout(SCbackgroundTimer); // Stop any existing background timer
  SCbackgroundRunning = false;
}

function updateSelf() {
  const currentTime = Date.now();
  SCelapsedTime = currentTime - SCstartTime;
  SCdisplay.textContent = formatTime(SCelapsedTime);
  localStorage.setItem('SC', SCelapsedTime);

  if (SCelapsedTime >= maxTime) {
    updateLabelWithSelfTime();
    resetSelf(); // Reset both timers
    startBackgroundSelfTimer(); // Automatically restart
  }
}

function updateLabelWithSelfTime() {
    const selfTime = SCdisplay.textContent.split(':')[0]; // Get hours only
    SCchange.textContent = selfTime;
    localStorage.setItem('SCChange', selfTime);
}

function startBackgroundSelfTimer() {
  if (SCbackgroundRunning) return;

  // Calculate remaining time until maxTime is reached
  const remainingTime = maxTime - SCelapsedTime;

  // Set a timeout to stop the timer when maxTime is reached
  SCbackgroundTimer = setTimeout(() => {
    updateLabelWithSelfTime();
    resetSelf(); // Reset both timers
  }, remainingTime);

  SCbackgroundRunning = true;
}

document.getElementById('SCSelect').addEventListener('change', function() {
  const selectedValue = this.value;

  if (selectedValue === 'enable') {
    startSelf();
  } else if (selectedValue === 'disable') {
    stopSelf(); // Pause the foreground timer
  } else if (selectedValue === 'reset') {
    resetSelf(); // Reset both foreground and background timers
  }
});


// Restore state on page load
restoreWorkState();
restoreExerciceState();
restorePlayState();
restoreSocielState();
restoreStudyState();
restoreSelfState();