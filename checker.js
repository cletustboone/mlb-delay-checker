var Inotify    = require('inotify').Inotify,
  util         = require('util'),
  EventEmitter = require('events').EventEmitter,
  moment       = require('moment'),
  inotify      = new Inotify(),
  fs           = require('fs'),
  targetDir    = process.env.TARGET_DIR || '/home/sportsnetwork',
  patt         = /datetime=\"([\d]{2}\/[\d]{2}\/[\d]{2} [\d]{2}:[\d]{2}:[\d]{2})\"/i,
  checker;

// Constructor
var Checker = function( options ) {

  if ( !( this instanceof Checker ) ) {

    return new Checker( options );

  }

  this.options = options;
  this.wd      = inotify.addWatch({

    path     : targetDir,
    callback : this.watchHandler

  });

  this.on( 'file_ready', this.readPartial );

}

// Checker is an event emitter
util.inherits( Checker, EventEmitter );

/**
  *
  * Read the first few bytes of the file. Enough to get the DateTime attribute.
  * Once we have the first few bytes, parse the string to find the value of DateTime.
  *
  */
Checker.prototype.readPartial = function( fileName ) {

  var now = moment().utc(), rs;

  if ( fileName.indexOf('AA') < 0 ) return;

  rs = fs.createReadStream( targetDir + '/' + fileName, { encoding : 'utf8', start : 0, end : 512 } );
  rs.on( 'data', this.parseDateTime );

  return;

}

Checker.prototype.parseDateTime = function( data ) {

  try {

    var dateTime = moment( patt.exec( data )[1], "MM/DD/YY HH:mm:ss" ),
      now        = moment();

    this.calculateDelay();

  } catch( e ) {

    this.logProblemReadingDateTime( data );

  }

}

/**
  *
  * Logs the create time stamp and the arrival time
  *
  */
Checker.prototype.logDelay = function( createTime, arrivalTime ) {



}

/**
  *
  * Sometimes the file gets removed from the directory by the parser before we have a chance to read the DateTime attribute.
  * In those cases, just log and move on.
  *
  */
Checker.prototype.logProblemReadingDateTime = function( data ) {

  console.log( "ERROR PARSING DateTime" );
  console.log( content );
  return;

}

/**
  *
  * Listens for the event that fires when files finish writing IN_CLOSE_WRITE.
  * Only acts on filenames that start with AA, so we're only interested in delays of live game files.
  *
  */
Checker.prototype.watchHandler = function( event ) {

  var mask = event.mask, type;

  event.name ? type = event.name : '';

  // Examine pitch/play files when they are done writing to disk.
  if ( mask & Inotify.IN_CLOSE_WRITE && type.indexOf('AA') >= 0 ) {

    this.emit( 'file_ready', type );

  }

}

// Instantiate the monitor
checker = new Checker;