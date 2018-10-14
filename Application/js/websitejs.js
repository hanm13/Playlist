$( document ).ready(function() {

  $('[data-toggle=confirmation]').confirmation({
    rootSelector: '[data-toggle=confirmation]',
    // other options
  });


  var playlists_obj = getPlaylistsAndInitDOM();

  $('#btn-add-new-playlist').click(function() {

    createEditAddModal("btn_save_newplaylist");


  });

  /*$('.search-bar .icon').on('click', function() {
    $(this).parent().toggleClass('active');
  });*/

  handlePlayListsSearch();

});

function handlePlayListsSearch(){


  $('#playlist-search-input').keyup(function(event){

    let search_value = $(this).val().toLowerCase();

    if(search_value.length > 2 || search_value.length == 0){


      $('#my_unorder_list > li').each(function() {

        let playlist_name = $(this).data("playlistname").toLowerCase();

        if(playlist_name.indexOf(search_value) != -1){

          $(this).removeClass("display-none");

        }else{

          $(this).addClass("display-none");

        }

       });
    }

    handlePlayListAutoComplete();

  });

}

function handlePlayListAutoComplete(){

  let namesArr = [];

  $('#my_unorder_list > li').each(function() {

    let playlist_name = $(this).data("playlistname").toLowerCase();
    namesArr.push(playlist_name);

  });

  $( "#playlist-search-input" ).autocomplete({
     source: namesArr
   });

}

/**

  @function isValidImage - Checks if the image src is valid(must have HTTPS, png, jpg)
  @param src - link to the image
  @return void

*/

function isValidImage(src){

  var isValid = /(https?:\/\/.*\.(?:png|jpg))/i.test(src);

   return isValid;

}

function isValidSongURL(name){

  var isValid = /(https?:\/\/.*\.(?:mp3))/i.test(name);

   return isValid;

}

function isValidInputName(name){

  var isValid = /^[a-zA-Z ]{2,30}$/.test(name);

   return isValid;

}

/**

  @function getPlaylistsAndInitDOM - Init the playlists to the DOM
  @param none
  @returns void

*/


function getPlaylistsAndInitDOM(){

  $('#my_unorder_list').html("");

  var url = "/playlist";

  $.get(url,function(playlistsobj,status_message){

    for (var i = 0; i < playlistsobj.data.length; i++) {

      createPlaylistAlbumToUL(playlistsobj.data[i]);

    }

    return playlistsobj;

  });

}

/**

  @function createPlaylistAlbumToUL - Adds playlist DIV to the listed playlists
  @param playlistsobj - Object: {"id":"0","name":"test","image":"http://"}
  @return - void

*/

function createPlaylistAlbumToUL(playlistsobj){


  var playlist_id = playlistsobj.id;
  var playlist_image = playlistsobj.image;
  var playlist_name = playlistsobj.name;

    var songsurl = "/playlist/" + playlist_id + "/songs";

  $('#my_unorder_list').append('<li class="playlistorder" data-playlistname="'+ playlist_name +'" id="playlistid'+ playlist_id + '" data-playlistid="' + playlist_id + '" >'+
    '<p class="name_of_title">' + playlist_name + '</p></li>');

   $('.name_of_title').circleType({radius: 120,positon: "relative"});

   $('#playlistid' + playlist_id).append('<img class="rounded-circle playlist-img" src="' + playlist_image + '">');
   $('#playlistid' + playlist_id).append('<button data-playlistid ="' + (playlist_id  ) + '" class="playlist-play-button"><i class="fab fa-youtube fa-3x"></i></button>');
   $('#playlistid' + playlist_id).append('<button data-playlistid ="' + (playlist_id ) + '" class="playlist-edit-button" data-toggle="modal" data-target="#addOrEditPlaylistMain"><i class="fa fa-edit fa-2x"></i></button>');
   $('#playlistid' + playlist_id).append('<button data-playlistid ="' + (playlist_id ) + '" class="playlist-delete-button"><i class="fa fa-times-circle fa-2x"></i></button>');

   $('.playlist-delete-button[data-playlistid="'+ (playlist_id ) +'"]').confirmation();

   $('.playlist-delete-button[data-playlistid="'+ (playlist_id ) +'"]').click(function(){

       deletePlaylist($(this).data("playlistid"));



   });

   $('.playlist-edit-button[data-playlistid="'+ (playlist_id ) +'"]').click(function(){

      $.get(songsurl,function(playlist_songs,status_message){

        createEditAddModal("btn_save_editplaylist");
        handleEditPlaylistSongs(playlist_id,playlist_name,playlist_image, playlist_songs);

       });

   });

   $('.playlist-play-button[data-playlistid="'+ (playlist_id ) +'"]').click(function(){

     $.get(songsurl,function(playlist_songs,status_message){

       createAudioPanel(playlistsobj,playlist_songs);

      });

    });

}

/**

  @function createAudioPanel creates Audio Panel with all elemnts needed
  @param playplist_play_button_el,playlistsobj
  @returns void

*/

function createAudioPanel(playlist_obj, playlist_songs){

  $('#audioBoxMain').html("");

  var playlistid = playlist_obj.id;

  $('#audioBoxMain').html("");
  $('#audioBoxMain').append("<div id='audioPanelContainer' class='container d-inline-flex p-2'><div id ='audioPanel' class='row'></div></div>");
  $('#audioBoxMain').attr("data-playlistid", playlist_obj.id);

  $('#audioPanel').append(`<div id="album-img-panel" class="playlist-audio-img-panel sm m-0">
      <img id="album-image" class="spin rounded-circle playlist-audio-img" src="${playlist_obj.image}">
    </div>`);

  $('#audioPanel').append(`<button data-playlistid ="' + (playlist_obj.id ) + '" class="audio-panel-playlist-edit-button" data-toggle="modal" data-target="#addOrEditPlaylistMain">
  <i class="far fa-edit fa-2x"></i></button>`);

  $('#audioPanel').append(`<button data-playlistid ="' + (playlist_obj.id ) + '" class="btn btn-default audio-panel-playlist-delete-button" data-toggle="confirmation">
    <i class="far fa-times-circle fa-2x"></i>
  </button>`);

  $('.audio-panel-playlist-delete-button').confirmation();

  $('.audio-panel-playlist-delete-button').click(function(){

      deletePlaylist($(this).data("playlistid"));



  });

  $('#album-img-panel').append('<button data-playlistid ="' + (playlist_obj.id ) + '" id="album-playlist-pause-button"><i class="far fa-pause-circle fa-3x"></i></button>');
  $('#album-img-panel').append('<button data-playlistid ="' + (playlist_obj.id ) + '" id="album-playlist-play-button" class="display-none"><i class="far fa-play-circle fa-3x"></i></button>');

  $('#album-playlist-pause-button').click(function(){

    pauseMusicPlaying();

  });

  $('#album-playlist-play-button').click(function(){

    rePlayMusicPlaying();

  });

  $('.audio-panel-playlist-edit-button').click(function(){

      createEditAddModal("btn_save_editplaylist");
      handleEditPlaylistSongs(playlist_obj.id,playlist_obj.name,playlist_obj.image,playlist_songs);

  });

  createPlaylistSongs(playlist_songs);

}

/**

  @function deletePlaylist - Sends AJAX request to delete playlist from the database and removes the playlist DIV from the playlists list.
  @param - playlist ID
  @returns - void

*/

function deletePlaylist(id){


  $.ajax({
      url: '/playlist/' + id,
      type: 'DELETE',
      success: function(result) {

          $('#audioBoxMain[data-playlistid="' + id + '"]').html("");


          //We remove the album element from the UL list.
          $('#playlistid' + id).remove();

      }
  });

}

/**

  @function pauseMusicPlaying - pauses the curent music playing and removes the spin effect
  @param - none
  @returns - void

*/

function pauseMusicPlaying(){
  $('#playlist-audio').trigger("pause");
  removeAlbumSpinEffect();
}

/**

  @function rePlayMusicPlaying - plays the curent music and adds the spin effect
  @param - none
  @returns - void

*/

function rePlayMusicPlaying(){
  $('#playlist-audio').trigger("play");
  addAlbumSpinEffect();
}

/**

  @function createPlaylistSongs creates audio element and appends songs content
  @param playlist_songs object
  @returns void

*/

function createPlaylistSongs(playlist_songs){

  var nextSongID = {id:0};

  $('#audioPanel').append("<div class='container' id='audioBoxes'><audio class='audioBox' data-musicplaying='" + nextSongID.id +"' autoplay='autoplay' controls id='playlist-audio'><source id='sourceplaylistsong' src='" + playlist_songs.data.songs[nextSongID.id].url + "' type='audio/mpeg'></audio></div>");

  $('#audioBoxes').append("<h4 id='nowPlaying'>NOW PLAYING: " + playlist_songs.data.songs[nextSongID.id].name + " </h4>");
  $("#audioBoxes").append("<ol class='scrollbar' id='songsNames'></ol>");

  for (var i = 0; i < playlist_songs.data.songs.length; i++) {
    $("#songsNames").append("<li class='songsli songs-opacity' data-songid=" + i + ">" + playlist_songs.data.songs[i].name + "</li>");
  }

  updateMusicPlaying(playlist_songs.data.songs[nextSongID.id].name,playlist_songs.data.songs[nextSongID.id].url,nextSongID.id);

  /*$('.songsli').hover(function() {
    $('#album-playlist-play-button').addClass('visible');
  }, function() { // If not hover:
    $('#album-playlist-play-button').removeClass('visible');
  });*/

  $('.songsli').hover(function() {

    var musicid = $(this).data("songid");

    if(musicid == $(".audioBox").data("musicplaying") && $('#playlist-audio').get(0).paused == false){

      $(this).removeClass("songs-opacity");
      $(this).addClass("lipausebullet");

    }else{

      $(this).removeClass("songs-opacity");
      $(this).addClass("liplaybullet");

    }

    $(this).addClass("songsli_nostyletype");

    $('.songsli').not('.songsli[data-songid="' + musicid +'"]').addClass("songs-opacity");
    $('.songsli').not('.songsli[data-songid="' + musicid +'"]').removeClass("liplaybullet");
    $('.songsli').not('.songsli[data-songid="' + musicid +'"]').removeClass("songsli_nostyletype");
  },function() {

    //Set back the play to the current song playing.
    $('.songsli[data-playing="1"]').removeClass("songs-opacity");
    $('.songsli[data-playing="1"]').addClass("songsli_nostyletype");
    $('.songsli[data-playing="1"]').addClass("liplaybullet");

    // Remove pause effect
    $(this).removeClass("lipausebullet");


    $('.songsli').not('.songsli[data-playing="1"]').addClass("songs-opacity");
    $('.songsli').not('.songsli[data-playing="1"]').removeClass("liplaybullet");
    $('.songsli').not('.songsli[data-playing="1"]').removeClass("songsli_nostyletype");
  });

  $('.songsli').click(function(){

    if($(this).data("songid") == $(".audioBox").data("musicplaying") && $('#playlist-audio').get(0).paused == false){

      pauseMusicPlaying();

    }else{

      var musicid = $(this).data("songid");

      if(musicid == $(".audioBox").data("musicplaying")){

        rePlayMusicPlaying();

      }else{

        updateMusicPlaying(playlist_songs.data.songs[$(this).data("songid")].name,playlist_songs.data.songs[$(this).data("songid")].url,$(this).data("songid"));

      }

    }



  });

  $('#playlist-audio').on('pause', function() {

    removeAlbumSpinEffect();

  });

  $('#playlist-audio').on('play', function() {

    addAlbumSpinEffect();

  });

  $('#playlist-audio').on('ended', function() {

    nextSongID.id += 1;

    handleSongEnded(nextSongID,playlist_songs);

  });

}

/**

  @function handleSongEnded updates the audio to play the next song of the playlist.
  @param Next Song ID, songs object
  @returns void

*/

function handleSongEnded(nextSongID,playlist_songs){

  console.log(nextSongID.id);

  if (nextSongID.id >= playlist_songs.data.songs.length) {

    nextSongID.id = 0;

  }

  updateMusicPlaying(playlist_songs.data.songs[nextSongID.id].name,playlist_songs.data.songs[nextSongID.id].url, nextSongID.id);


}

/**

  @function removeAlbumSpinEffect removes Album spin effect
  @param none
  @returns void

*/

function removeAlbumSpinEffect(){
  $('#album-image').removeClass("spin");
  $('#album-playlist-pause-button').addClass("invisible");
  $('#album-playlist-play-button').removeClass("invisible");
  $('#album-playlist-pause-button').addClass("display-none");
  $('#album-playlist-play-button').removeClass("display-none");
}

/**

  @function addAlbumSpinEffect adds Album spin effect
  @param none
  @returns void

*/

function addAlbumSpinEffect(){
  $('#album-image').addClass("spin");
  $('#album-playlist-pause-button').removeClass("invisible");
  $('#album-playlist-play-button').addClass("invisible");
  $('#album-playlist-pause-button').removeClass("display-none");
  $('#album-playlist-play-button').addClass("display-none");
}

/**

  @function updateMusicPlaying updates the audiobox to play the requested music
  @param music_name,music_url, musicid
  @returns void

*/


function updateMusicPlaying(music_name,music_url, musicid){

  addAlbumSpinEffect();

  $("title").html("PLAYING: " + music_name);

  $('#nowPlaying').html("NOW PLAYING: " + music_name);

  $(".audioBox").children().attr("src", music_url);

  $(".audioBox").load();

  $(".audioBox").data("musicplaying", musicid);

  $(".audioBox").trigger("play");

  $('li[data-songid="' + musicid +'"]').removeClass("songs-opacity");
  $('li[data-songid="' + musicid +'"]').addClass("liplaybullet");
  $('li[data-songid="' + musicid +'"]').addClass("songsli_nostyletype");
  $('li[data-songid="' + musicid +'"]').attr("data-playing","1");


  $('.songsli').not('li[data-songid="' + musicid +'"]').addClass("songs-opacity");
  $('.songsli').not('li[data-songid="' + musicid +'"]').removeClass("liplaybullet");
  $('.songsli').not('li[data-songid="' + musicid +'"]').removeClass("songsli_nostyletype");
  $('.songsli').not('li[data-songid="' + musicid +'"]').attr("data-playing","0");

}

function getPlaylistsObjByID(id){

  var url = "http://playlist.combinecontrol.com/playlist";

  $.get(url,function(obj,status_message){

    for (var i = 0; i < obj.data.length; i++) {

      if(i == id){

        return obj.data[id];

      }

    }
  });

}

function createEditAddModal(button){

$('#addEditModals').html("");
$('.modal-backdrop').remove();

let title = (button=="btn_save_newplaylist") ? "Add New Playlist" : "Update Playlist";
let title2 = (button=="btn_save_newplaylist") ? "Add Playlist Songs" : "Edit Playlist Songs";

$('#addEditModals').append(`

    <div class="modal fade" id="addOrEditPlaylistMain" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content modal-ku">
          <div class="modal-header m-0">
            <h4 class="modal-title m-0">${title}</h4>
            <div class="modal-form-errors"></div>
          </div>
          <div class="modal-body m-0">
            <form class="w-50 m-0 d-inline-block">
              <div class="form-group m-0">
                <label for="exampleInputEmail1">Playlist Name</label>
                <input type="text" class="form-control input-playlist-name" placeholder="e.g. Blood Sugar">
              </div>
              <div class="form-group m-0">
                <label for="exampleInputEmail1">Playlist Image URL</label>
                <input type="text" class="form-control input-playlist-image-url" placeholder="https://">
              </div>
            </form>
            <div class="d-inline position-absolute p-3 div-img-preview"><img class="playlist-img-preview rounded float-right" src="https://icons.iconarchive.com/icons/ccard3dev/dynamic-yosemite/128/Preview-icon.png"></img></div>
          </div>
          <div class="modal-footer m-0 d-inline w-50">
            <button type="button" class="btn btn-default btn-next float-right">Next</button>
            <button type="button" class="btn btn-default float-left btn-reset-fields">RESET FIELDS</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="addOrEditPlaylistSave" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content modal-ku">
          <div class="modal-header m-0">
            <h4 class="modal-title">${title2}</h4>
            <div class="modal-form-errors"></div>
          </div>
          <div class="modal-body p-0">
            <form class="form-inline form_songs">
            </form>
          </div>
          <div class="modal-footer m-0 d-inline">
            <button type="button" class="btn btn-default btn-add-another-song float-left"><i class="fas fa-plus-square"></i> Add another song</button>
            <button type="submit" id="${button}" class="btn btn-default float-right">FINISH & SAVE</button>
          </div>
        </div>
      </div>
    </div>

  `);

  handleModal();

  if(button=="btn_save_newplaylist"){
    handleAddAnotherSong("","",5);
  }

  $('#addOrEditPlaylistMain').modal("toggle");

}

function handleModal(){

  $("div[id^='addOrEditPlaylist']").each(function(){

      var currentModal = $(this);

      //click next
      currentModal.find('.btn-next').click(function(){

        let playlist_image_url_el = $(".input-playlist-image-url");
        let playlist_name_el = $(".input-playlist-name");

        let errorsArr = {
          "errors" : [],
        };

        if( !isValidImage($(playlist_image_url_el).val() ) ){
          errorsArr.errors.push("Invalid Playlist Image URL,\n HTTPS and PNG/JPG Only!");
          $(playlist_image_url_el).addClass("errorClass");
        }else{

          $(playlist_image_url_el).removeClass("errorClass");

        }

       if( !isValidInputName($(playlist_name_el).val() ) ){
         errorsArr.errors.push("Invalid Playlist Name - A-Z a-z only!");
         $(playlist_name_el).addClass("errorClass");
       }else{

         $(playlist_name_el).removeClass("errorClass");

       }

       if (errorsArr.errors.length == 0){
         currentModal.modal('hide');
         currentModal.closest("div[id^='addOrEditPlaylist']").nextAll("div[id^='addOrEditPlaylist']").first().modal('show');
       }

       updateModalFormErrors(errorsArr);


      });

      //click prev
      currentModal.find('.btn-prev').click(function(){
        currentModal.modal('hide');
        currentModal.closest("div[id^='addOrEditPlaylist']").prevAll("div[id^='addOrEditPlaylist']").first().modal('show');
      });

    });

    $(".input-playlist-image-url").keyup(function(e) {

      var img_src = $(this).val();

      if(isValidImage(img_src)){

        $(".playlist-img-preview").attr("src",img_src);

      }


    });


    $('.btn-add-another-song').click(function() {

      handleAddAnotherSong();


    });

    $('.btn-reset-fields').click(function() {

      $('.input-playlist-name').val("");
      $('.input-playlist-image-url').val("");

      $(".playlist-img-preview").attr("src","http://icons.iconarchive.com/icons/ccard3dev/dynamic-yosemite/128/Preview-icon.png");



  });

  //

  handleModalAddPlayListClick();
  handleModalUpdatePlayListClick();

}

function updateModalFormErrors(errorsArr){

  $(`.modal-form-errors`).html("");

  for (var i = 0; i < errorsArr.errors.length; i++) {

    $(`.modal-form-errors`).append("<p class='m-0 text-warning'> * " + errorsArr.errors[i] + "</p>");
  }

}

function handleModalAddPlayListClick(){

  $('#btn_save_newplaylist').click(function(event){

    let songsErrorsArr = {"errors":[]};
    validateSongsInputs($(this),songsErrorsArr);
    if(songsErrorsArr.errors.length != 0){return}

    var playlist_obj = {};
    playlist_name = $('.input-playlist-name').val();
    playlist_image = $('.input-playlist-image-url').val();

    playlist_obj['name'] = playlist_name;
    playlist_obj['image'] = playlist_image;
    playlist_obj['songs'] = [];

    playlist_obj['songs'] = getSongsObjArrayFromSongsDiv();

    $.post( "/playlist",playlist_obj, function( data ) {

      playlist_obj.id = data.data.id;

      createPlaylistAlbumToUL(playlist_obj);

    });

  });

}

function getSongsObjArrayFromSongsDiv(){

  let tempArray = [];

  $('.songs-div').each(function(){

    var input_song_name_el_val = $(this).children(':nth-child(2)').children(':nth-child(2)').val();
    var input_song_url_el_val = $(this).children().children(':nth-child(2)').val();

    if(input_song_name_el_val == "" || input_song_url_el_val == "" || input_song_name_el_val == undefined || input_song_url_el_val == undefined){return}

      var song = {

        "name" : input_song_name_el_val,
        "url" : input_song_url_el_val,

      };
      tempArray.push(song);

  });


  return tempArray;

}

function validateSongsInputs(save_btn,songsErrorsArr){

  let inserted_songs = 0;
  let errors = {name:false, url:false};

  $('.songs-div').each(function(){

    var input_song_name_el = $(this).children(':nth-child(2)').children(':nth-child(2)');
    var input_song_url_el = $(this).children().children(':nth-child(2)');

    var input_song_name_el_val = input_song_name_el.val();
    var input_song_url_el_val = input_song_url_el.val();

    if((input_song_name_el_val == "" || input_song_name_el_val == undefined) && (input_song_url_el_val == "" || input_song_url_el_val == undefined) ){return}

    if(!isValidInputName(input_song_name_el_val)){

      errors["name"] == true;

      // Do mark LI border red func;

      if(!$(input_song_name_el).hasClass("errorClass")){
        $(input_song_name_el).addClass("errorClass");
      }


    }else{
      // Do mark LI border blue func / remove red border;
      if($(input_song_name_el).hasClass("errorClass")){
        $(input_song_name_el).removeClass("errorClass");
      }

    }

    if(!isValidSongURL(input_song_url_el_val)){


      errors["url"] = true;

      // Do mark LI border red func;

      if(!$(input_song_url_el).hasClass("errorClass")){
        $(input_song_url_el).addClass("errorClass");
      }

    }else{

      // Do mark LI border blue func / remove red border;

      if($(input_song_url_el).hasClass("errorClass")){
        $(input_song_url_el).removeClass("errorClass");
      }

    }

    inserted_songs++;


  });

  if(errors.name == true){

    songsErrorsArr.errors.push(`Invalid song name, A-Z - a-z only!`);

  }

  if(errors.url == true){

    songsErrorsArr.errors.push(`Invalid song URL, HTTPS, MP3 only!`);

  }

  if(inserted_songs == 0){

    songsErrorsArr.errors.push("You must add at least one song!");

  }

  if(songsErrorsArr.errors.length == 0){
    save_btn.attr("data-dismiss","modal");
  }

  updateModalFormErrors(songsErrorsArr);

}

function handleModalUpdatePlayListClick(){


  $('#btn_save_editplaylist').click(function(event){

    let songsErrorsArr = {"errors":[]};
    validateSongsInputs($(this),songsErrorsArr);
    if(songsErrorsArr.errors.length != 0){return}

    var playlist_obj = {};
    playlist_name = $('.input-playlist-name').val();
    playlist_image = $('.input-playlist-image-url').val();

    playlist_obj['name'] = playlist_name;
    playlist_obj['image'] = playlist_image;
    playlist_obj['songs'] = [];

    playlist_obj['songs'] = getSongsObjArrayFromSongsDiv();

    if(songsErrorsArr.errors.length != 0){return}

    let songs_obj = {"songs" : playlist_obj['songs']};
    let playlist_id = $("#addOrEditPlaylistMain").data("playlistid");

    if(playlist_name != "" && playlist_image != "" && playlist_name != undefined && playlist_image != undefined){

      let info_obj = {

        "name":playlist_name,
        "image":playlist_image,

      };

      $.post( "/playlist/" + playlist_id, info_obj, function( data ) {

        getPlaylistsAndInitDOM();

      });

      }


    if(playlist_obj['songs'].length > 0){

      $.post( "/playlist/" + playlist_id + "/songs",songs_obj, function( data ) {

        if($('#audioBoxMain').attr("data-playlistid") == playlist_id){

          createAudioPanel(playlist_obj,{"data":songs_obj});

        }

      });

    }

  });

}

/**

@function handleEditPlaylistSongs - creates the songs to the songs menu

*/

function handleEditPlaylistSongs(id,name,url,playlistsongs){

  $('.input-playlist-name').val(name);
  $('.input-playlist-image-url').val(url);

  playlistsongs = playlistsongs.data.songs;

  $('#addOrEditPlaylistMain').attr("data-playlistid", id);

  for (var i = 0; i < playlistsongs.length; i++) {

    handleAddAnotherSong(playlistsongs[i].url,playlistsongs[i].name);

  }

}

function resetModalSongsList(number=5){

  $('.form_songs').html("");

  for (var i = 0; i < number; i++) {
    handleAddAnotherSong();
  }

}


function handleAddAnotherSong(song_url="",song_name="",amount=1){

  for (var i = 0; i < amount; i++) {

    $('.form_songs').append(`

      <div class="form-group songs-div">
        <div class="form-group">
          <label for="new_song_url" class="p-1">Song URL:</label>
          <input type="text" class="form-control" class="new_song_url" value="${song_url}">
        </div>
        <div class="form-group">
          <label for="new_song_name" class="m-0 p-1">Name:</label>
          <input type="text" class="form-control w-50" class="new_song_name" value="${song_name}">
        </div>
      </div>

      `);
  }


}

function readURL(input,imageClass) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $(imageClass).attr('src', e.target.result);
      $('#image_hidden_input').val(e.target.result);
    }

    reader.readAsDataURL(input.files[0]);

  }
}
