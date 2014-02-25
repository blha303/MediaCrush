#!/bin/bash
sudo apt-get update -qq
sudo apt-get install -qq imagemagick tidy libjpeg-progs optipng libmp3lame-dev nodejs \
  autoconf automake build-essential git libass-dev libgpac-dev \
  libsdl1.2-dev libtheora-dev libtool libva-dev libvdpau-dev libvorbis-dev libx11-dev \
  libxext-dev libxfixes-dev pkg-config texi2html zlib1g-dev libvpx-dev libx264-dev

wget http://blha303.com.au/mediacrushdeps.tgz
tar zxf mediacrushdeps.tgz

cd yasm-1.2.0
sudo make install
cd ..

cd fdk-aac
sudo make install
cd ..

cd ffmpeg
sudo make install
cd ..

ffmpeg --version
