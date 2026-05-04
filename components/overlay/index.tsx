import './index.css';

interface OverlayProps {
  vignette?: boolean;
}

export function Overlay({ vignette = true }: OverlayProps) {
  return (
    <>
      {vignette && <div id="vignette" />}
      <div id="cur"><div id="cur-inner" /></div>
      <div id="cur-outer" />
    </>
  );
}