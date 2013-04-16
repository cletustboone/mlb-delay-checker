var Inotify = require('inotify').Inotify;
  moment    = require('moment'),
  inotify   = new Inotify(),
  fs        = require('fs'),
  targetDir = process.env.TARGET_DIR || '/home/sportsnetwork',
  patt      = /datetime=\"([\d]{2}\/[\d]{2}\/[\d]{2} [\d]{2}:[\d]{2}:[\d]{2})\"/i;

var readDateTime = function( fileName ) {

  var now = moment().utc(), rs;

  if ( fileName.indexOf('AA') < 0 ) return;

  rs = fs.createReadStream( targetDir + '/' + fileName, { encoding : 'utf8', start : 0, end : 512 } );

  /* Check out the stream data */
  rs.on( 'data', function( data ) {

    var dateTime = patt.exec( data )[1];

    if ( dateTime ) {

      console.log( dateTime );
      dateTime = moment( dateTime, "MM/DD/YY HH:mm:ss" );
      var now  = moment();
      console.log( dateTime.format("h:mm:ss A"), now.format("h:mm:ss A") );

    }


  });

  return;

}

var handler = function( event ) {

  var mask = event.mask, type;

  event.name ? type = event.name : '';

  // Examine pitch/play files when they are done writing to disk.
  if ( mask & Inotify.IN_CLOSE_WRITE && type.indexOf('AA') >= 0 ) {

    readDateTime( type );

  }

}

var wd = inotify.addWatch({

  path     : targetDir,
  callback : handler

});