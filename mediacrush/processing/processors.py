from mediacrush.processing.processor import Processor
from mediacrush.processing.invocation import Invocation
from mediacrush.config import _cfg
import os

copy = "cp {0} {1}.{extension}"

class VideoProcessor(Processor):
    time = 6000
    outputs = ['mp4', 'webm', 'ogv']
    extras = ['png']

    def sync(self):
        self._execute(copy)
        map_string = ''
        if self.extra['has_video']:
            self._execute("ffmpeg -y -i {0} -vframes 1 -map 0:v:0 {1}.png")
            map_string += ' -map 0:v:0'
        if self.extra['has_audio']:
            map_string += ' -map 0:a:0'
        self._execute("ffmpeg -y -i {0} -vcodec libx264 -pix_fmt yuv420p -vf scale=trunc(in_w/2)*2:trunc(in_h/2)*2" + map_string  + " {1}.mp4")
        self._execute("ffmpeg -y -i {0} -c:v libvpx -c:a libvorbis -pix_fmt yuv420p -quality good -b:v 2M -crf 5" + map_string + " {1}.webm")

    def async(self):
        map_string = ''
        if self.extra['has_video']:
            map_string += ' -map 0:v:0'
        if self.extra['has_audio']:
            map_string += ' -map 0:a:0'
        self._execute("ffmpeg -y -i {0} -q 5 -pix_fmt yuv420p -acodec libvorbis -vcodec libtheora" + map_string + " {1}.ogv")
        # Extract extra streams if present
        fonts = []
        if self.extra['has_fonts'] or stream.extra['has_subtitles']:
            for stream in self.extra['streams']:
                if stream['type'] == 'font':
                    # Note that ffmpeg returns a nonzero exit code when dumping attachments because there's technically no output file
                    # -dump_attachment is a mechanism completely removed from the rest of the ffmpeg workflow
                    self._execute("ffmpeg -y -dump_attachment:" + str(stream["index"]) + ' {1}_attachment_' + stream["extra"] + ' -i {0}', ignoreNonZero=True)
                    fonts.append(stream)
                elif stream['type'] == 'subtitle':
                    extension = None
                    if stream['extra']['codec_name'] == 'ssa':
                        extension = '.ass'
                    elif stream['extra']['codec_name'] == 'srt':
                        extension = '.srt'
                    elif stream['extra']['codec_name'] == 'vtt':
                        extension = '.vtt'
                    if extension != None:
                        self._execute("ffmpeg -y -i {0} -map 0:s:0 {1}" + extension)
        # Examine font files and construct some CSS to import them
        css = ''
        for font in fonts:
            command = Invocation('otfinfo --info {0}')
            command(os.path.join(_cfg("storage_folder"), '%s_attachment_%s' % (self.f.hash, font["extra"])))
            command.run()
            output = command.stdout[0].split('\n')
            family = None
            subfamily = None
            for line in output:
                if line.startswith('Family:'):
                    family = line[7:].strip(' \t')
                if line.startswith('Subfamily:'):
                    subfamily = line[10:].strip(' \t')
            css += '@font-face{font-family: "%s";' % family
            css += 'src:url("/%s_attachment_%s");' % (self.f.hash, font["extra"])
            if subfamily == 'SemiBold':
                css += 'font-weight: 600;'
            elif subfamily == 'Bold':
                css += 'font-weight: bold;'
            elif subfamily == 'Italic':
                css += 'font-style: italic;'
            css += '}'
        css_file = open(os.path.join(_cfg("storage_folder"), '%s_fonts.css' % self.f.hash), 'w')
        css_file.write(css)
        css_file.close()

class AudioProcessor(Processor):
    time = 300
    outputs = ['mp3', 'ogg']

    def sync(self):
        self._execute(copy)
        self._execute("ffmpeg -y -i {0} -acodec libmp3lame -q:a 0 -map 0:a:0 {1}.mp3")

    def async(self):
        self._execute("ffmpeg -y -i {0} -acodec libvorbis -q:a 10 -map 0:a:0 {1}.ogg")

class ImageProcessor(Processor):
    time = 60
    outputs = ['png']

    def sync(self):
        self._execute(copy)
        self._execute("convert {0} {1}.png")

# We have some special optimizations for specific filetypes
# These customized processors follow

class PNGProcessor(Processor):
    time = 120
    outputs = ['png']

    def sync(self):
        self._execute(copy)

    def async(self):
        self._execute("optipng -o5 {1}")

class JPEGProcessor(Processor):
    time = 5
    outputs = []

    def sync(self):
        self._execute(copy)
        self._execute("jhead -purejpg {0}")

class SVGProcessor(Processor):
    time = 5
    outputs = []

    def sync(self):
        self._execute(copy)
        self._execute("tidy -asxml -xml --hide-comments 1 --wrap 0 --quiet --write-back 1 {0}")

class DefaultProcessor(Processor):
    time = 5

    def sync(self):
        self._execute(copy)

processor_table = {
    'video': VideoProcessor,
    'audio': AudioProcessor,
    'image': ImageProcessor,
    'image/png': PNGProcessor,
    'image/jpeg': JPEGProcessor,
    'image/svg+xml': SVGProcessor,
    'default': DefaultProcessor,
}

def get_processor(processor):
    return processor_table.get(processor, DefaultProcessor)
