#CLI for the youtube tayo server
import argparse


def parse():
    parser = argparse.ArgumentParser(description="YouTube Tayo")

    parser.add_argument('-f', '--fullscreen', default=False,
                        help='automatically fullscreens vlc when playing a video',
                        action="store_true")

    parser.add_argument('-p', '--port',
                        help='specify what port will the server run (default:8000)',
                        default=8000)

    return parser.parse_args()
