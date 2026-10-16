/**
 * Server-rendered intro overlay. It paints in the first frame and is hidden by CSS unless the pre-paint script chose
 * an intro mode. Decorative: aria-hidden. It has no buttons: the video always plays muted, from start to end.
 *
 * The <video> deliberately has NO source here. runtime.ts picks the file (Mobile for portrait screens, PC for
 * everything else) and only then starts the download, so visitors who skip the intro never fetch ~4.5 MB.
 */
export function Intro() {
  return (
    <>
      <div id="intro" className="intro" data-state="idle" aria-hidden="true">
        <video id="intro-video" className="intro__video" muted playsInline preload="none" tabIndex={-1} disablePictureInPicture disableRemotePlayback />
      </div>
    </>
  );
}
