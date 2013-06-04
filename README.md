YTQueue
=======

Host a Youtube playlist queue at work!

```
Save bandwidth!

Be united!

Share music with your coworkers.
```


Requirements
------------

Install the requirements using your favorite package
manager.

```
python
vlc  # You should also have the vlc cli tool
libevent  # Should this still be needed by gevent.
```


Installation
------------

Clone the repo

```
$ git clone git://github.com/jpanganiban/ytqueue.git
```

Install the requirements

```
$ pip install -r requirements.txt
```


Running
-------

Start up a terminal

```
$ cd <path to ytqueue>
$ python ytqueue.py
```

Open your browser and navigate to `localhost:8000`.

Your co-workers in the same network should also be able to view
the page as well by navigating to `youripaddress:8000`.

To see your ip address, run `ifconfig` or `ip addr` in your
favorite terminal emulator.


Contributing
------------

Fork it up, write your changes, submit a pull request and 
write a 1500 word essay on why should I include your changes. Jk.
