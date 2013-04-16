TSN Delay Checker
=================

Monitors the landing directory of [The Sports Network's](http://www.sportsnetwork.com) XML files and checks the DateTime attribute of the real-time MLB files to make sure that this time is not too far behind the current time.

The need for this arose when we figured out that they do not keep any FTP logs of when files are actually transmitted to clients, but they do keep logs of when files are created in their system. This file-create timestamp is added to the actual data file in the DateTime attribute at the top level node of pitch and play files.  We were experiencing long delays between when the file was being created in their system and when it showed up on our server. This will track any delays and notify of us of problems.