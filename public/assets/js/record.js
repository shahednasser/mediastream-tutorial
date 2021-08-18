//initialize elements we'll use
const recordButton = document.getElementById('recordButton');
const recordButtonImage = recordButton.firstElementChild;
const recordedAudioContainer = document.getElementById('recordedAudioContainer');
const saveAudioButton = document.getElementById('saveButton');
const discardAudioButton = document.getElementById('discardButton');

let chunks = []; //will be used later to record audio
let mediaRecorder = null; //will be used later to record audio

function record () {
  //check if browser supports getUserMedia
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    //browser supports getUserMedia
    //change image in button
    recordButtonImage.src = `/images/${mediaRecorder && mediaRecorder.state === 'recording' ? 'microphone' : 'stop'}.png`;
    if (!mediaRecorder) {
      //start recording
      navigator.mediaDevices.getUserMedia ({
        audio: true
      })
      .then(function(stream) {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        mediaRecorder.ondataavailable = mediaRecorderDataAvailable;
        mediaRecorder.onstop = mediaRecorderStop;
      })
      .catch(function(err) {
        alert('The following error occurred: ' + err);
        //change image in button
        recordButtonImage.src = `/images/microphone.png`;
      });
    } else {
      //stop recording
      mediaRecorder.stop();
    }
  } else {
    //browser does not support getUserMedia
    alert('Your browser does not support recording!');
  }
}

function mediaRecorderDataAvailable (e) {
  chunks.push(e.data);
}

function mediaRecorderStop () {
  //check if there are any previous recordings and remove them
  if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
    recordedAudioContainer.firstElementChild.remove();
  }
  const audioElm = document.createElement('audio');
  audioElm.setAttribute('controls', ''); //add controls
  const blob = new Blob(chunks, { 'type' : 'audio/mp3' });
  const audioURL = window.URL.createObjectURL(blob);
  audioElm.src = audioURL;
  //show audio
  recordedAudioContainer.insertBefore(audioElm, recordedAudioContainer.firstElementChild);
  recordedAudioContainer.classList.add('d-flex');
  recordedAudioContainer.classList.remove('d-none');
  //reset to default
  mediaRecorder = null;
  chunks = [];
}

recordButton.addEventListener('click', record);

function saveRecording () {
  //TODO upload recording to the server
}

saveAudioButton.addEventListener('click', saveRecording);

function discardRecording () {
  if (confirm('Are you sure you want to discard the recording?')) {
    //discard audio just recorded
    if (recordedAudioContainer.firstElementChild.tagName === 'AUDIO') {
      recordedAudioContainer.firstElementChild.remove();
      //hide recordedAudioContainer
      recordedAudioContainer.classList.add('d-none');
      recordedAudioContainer.classList.remove('d-flex');
    }
  }
}

discardAudioButton.addEventListener('click', discardRecording);