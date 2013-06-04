#!/usr/bin/env python

from flask import Flask, render_template, redirect, request
from gevent.wsgi import WSGIServer
from gevent import queue
import gevent_subprocess as subprocess
import gevent


app = Flask(__name__)


# Instance queue. Starts out empty
q = queue.Queue()


# Handler for the webpage
@app.route('/')
def page_index():
    # Just a page the shows the form.
    return render_template('index.html')


# API handler for adding songs in the playlist
@app.route('/playlist', methods=['POST'])
def api_playlist():
    # TODO: Validate user input

    # Add the link submitted by the user without blocking.
    q.put_nowait(request.form.get('link', None))

    # Redirect immidiately.
    return redirect('/')


# Worker that plays the playlist
def player_worker():
    while True:
        # Fetch the most recent item in the queue.
        # Blocks the current greenlet until either
        # it gets a new item or timeout lapses
        try:

            # XXX: Raises queue.Empty exception after
            # timeout (thus the try block)
            pl_item = q.get(timeout=10)
            #print "QUEUE ITEM PICKED: %s" % pl_item

            # XXX: Not your usual subprocess. We're using
            # the gevent_subprocess module. Blocks only
            # this greenlet until the process (playlist
            # item) ends.
            subprocess.call(["vlc", "--play-and-exit", "--quiet", pl_item])

        except queue.Empty:
            # Resume loop
            continue


if __name__ == '__main__':

    # Web server thread to be spawned later
    server = WSGIServer(('0.0.0.0', 8000), app)
    server_thread = gevent.spawn(server.serve_forever)

    # Player thread to be spawned later
    player_thread = gevent.spawn(player_worker)

    # Start the threads
    gevent.joinall([server_thread, player_thread])
