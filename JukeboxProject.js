class Song {
  constructor(permalink_url) {
    this.loaded = false;
    this.dataCallback = this.dataCallback.bind(this);
    this.streamCallback = this.streamCallback.bind(this);
    SC.resolve(permalink_url).then(this.dataCallback);
  }

  dataCallback(data) {
    this.data = data;
    this.song_id = data.id;
    this.name = data.title;
    this.track_page_url = data.permalink_url;
    this.track_description = data.description;
    this.artwork_url = data.artwork_url;
    this.genre = data.genre;
    this.artist_name = data.user.username;
    this.artist_profile_url = data.user.permalink_url;

    SC.stream(`/tracks/${this.song_id}`).then(this.streamCallback);
    refreshSongList(jukebox);
    refreshSongDetail(jukebox);
  }

  streamCallback(audio) {
    this.audio = audio;
    // check for errors?
    this.loaded = true;
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.seek(0);
  }
}

class Jukebox {
  constructor(songlist) {
    this.songlist = songlist;
    this.currentSongIndex = 0;
  }

  play() {
    this.currentSong().play();
  }

  pause() {
    this.currentSong().pause();
  }

  stop() {
    this.currentSong().stop();
  }

  nextTrack() {
    if (this.currentSongIndex < this.songlist.length - 1) {
      this.stop();
      this.currentSongIndex++;
      this.play();
    }
  }

  prevTrack() {
    if (this.currentSongIndex > 0) {
      this.stop();
      this.currentSongIndex--;
      this.play();
    }
  }

  playRandomSong() {
    this.stop();
    this.currentSongIndex = Math.floor(Math.random() * this.songlist.length);
    this.play();
  }

  currentSong() {
    return this.songlist[this.currentSongIndex];
  }
}

SC.initialize({ client_id: 'fd4e76fc67798bfa742089ed619084a6' });
let jukebox = new Jukebox([
  new Song ('https://soundcloud.com/lisapegher/full-tilt-firehouse?in=lisapegher/sets/controlled-chaos-live-at-the-firehouse-in-brooklyn'),
  new Song ('https://soundcloud.com/lisapegher/fire-firehouse?in=lisapegher/sets/controlled-chaos-live-at-the-firehouse-in-brooklyn'),
  new Song('https://soundcloud.com/lisapegher/new-socks-firehouse'),
  new Song ('https://soundcloud.com/lisapegher/snare-chaos-firehouse?in=lisapegher/sets/controlled-chaos-live-at-the-firehouse-in-brooklyn')
]);

function refreshSongList(jb) {
  let elListo = document.getElementById('song_list');

  // clear the current list of songs
  while (elListo.firstChild) {
    elListo.removeChild(elListo.firstChild);
  }

  // adds all the songs that are in the Jukebox (which is the jb parameter)
  for (let i=0; i<jb.songlist.length; i++) {
    let listItem = document.createElement("LI");
    let text = document.createTextNode(jb.songlist[i].name);
    listItem.appendChild(text);
    elListo.appendChild(listItem);
  }
}

function refreshSongDetail(jb) {
  const song = jb.currentSong();
  let elArtworko = document.getElementById('artwork_image');
  let elGenre = document.getElementById('genre');
  let elLinko = document.getElementById('artist_link');
  let elTracknameo = document.getElementById('track_name');

  elArtworko.src = song.artwork_url;
  elGenre.innerText = song.genre;
  elTracknameo.innerText = song.name;
  elLinko.innerText = song.artist_name;
  elLinko.href = song.artist_profile_url;
}
