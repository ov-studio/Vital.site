'use client';
import * as ui_iconbutton from '../iconbutton';
import * as lucide        from 'lucide-react';
import * as react         from 'react';
import * as react_dom     from 'react-dom';
import './index.css';

function use_scroll_lock(active) {
  react.useEffect(() => {
    if (!active || typeof document === 'undefined') return;
    const html = document.documentElement;
    const prev_ov = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prev_ov;
    };
  }, [active]);
}

/**
 * Shared modal shell — portal overlay, frame, media slot, body.
 *
 * @param {Object} props
 * @param {boolean} [props.closing]  Exit animation
 * @param {() => void} props.onClose
 * @param {import('react').ReactNode} [props.controls]  Top-right controls (share/close)
 * @param {import('react').ReactNode} [props.media]  Banner / player above body
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]  Overlay class
 * @param {string} [props.frameClassName]  Frame class
 * @param {string} [props.labelledBy]  aria-labelledby
 * @param {string} [props.label]  aria-label
 * @param {number | string} [props.maxWidth=780]
 * @param {boolean} [props.showClose=true]  Default close control when controls unset
 */
export function Modal({
  closing = false,
  onClose,
  controls,
  media,
  children,
  className = '',
  frameClassName = '',
  labelledBy,
  label,
  maxWidth = 780,
  showClose = true
}) {
  use_scroll_lock(true);

  react.useEffect(() => {
    function on_key(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', on_key);
    return () => window.removeEventListener('keydown', on_key);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const max_w = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  const default_controls = showClose ? (
    <ui_iconbutton.IconButton
      className="ui-modal-close"
      icon={lucide.X}
      iconProps={{ size: 14, strokeWidth: 2.5 }}
      onClick={onClose}
    />
  ) : null;

  return react_dom.createPortal(
    <div
      className={`ui-modal-overlay${closing ? ' closing' : ''}${className ? ` ${className}` : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`ui-modal-frame${closing ? ' closing' : ''}${frameClassName ? ` ${frameClassName}` : ''}`}
        style={{ maxWidth: max_w }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-label={label}
      >
        <div className="ui-modal">
          <div className="ui-modal-controls">
            {controls ?? default_controls}
          </div>
          {media}
          <div className="ui-modal-body">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Shared modal meta — author / version / title / tagline (+ optional divider).
 *
 * @param {Object} props
 * @param {string} [props.author]
 * @param {string} [props.authorHref]  Author link when set
 * @param {string} [props.version]  e.g. "v1.0.0"
 * @param {string} [props.title]
 * @param {string} [props.tagline]
 * @param {boolean} [props.divider=true]  Show divider under meta
 * @param {string} [props.titleClassName]  Extra class on title (e.g. wrap)
 */
export function ModalHeader({
  author,
  authorHref,
  version,
  meta,
  value,
  title,
  tagline,
  divider = true,
  titleClassName = ''
}) {
  const left = meta !== undefined ? meta : author;
  const right = value !== undefined ? value : version;
  const has_eyebrow = left != null || right != null;

  return (
    <>
      {has_eyebrow ? (
        <div className="ui-modal-eyebrow">
          {left != null ? (
            <span className="ui-modal-author">
              {typeof left === 'string' && authorHref ? (
                <a href={authorHref} target="_blank" rel="noreferrer">
                  {left}
                </a>
              ) : (
                left
              )}
            </span>
          ) : (
            <span />
          )}
          {right != null ? <span className="ui-modal-version">{right}</span> : null}
        </div>
      ) : null}

      {title?.trim() ? (
        <div className={`ui-modal-name${titleClassName ? ` ${titleClassName}` : ''}`}>
          {title.trim()}
        </div>
      ) : null}
      {tagline?.trim() ? <div className="ui-modal-tagline">{tagline.trim()}</div> : null}
      {divider ? <hr className="ui-modal-divider" /> : null}
    </>
  );
}

/**
 * Scrollable description region inside the modal body.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export function ModalBody({
  children,
  className = ''
}) {
  return (
    <div className={`ui-modal-desc-scroll${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

/**
 * Footer slot under the description — tags, actions, errors.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export function ModalFooter({
  children,
  className = ''
}) {
  return (
    <div className={`ui-modal-footer${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

/**
 * Action row (primary / secondary buttons). Secondary is pushed right.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export function ModalActions({
  children,
  className = ''
}) {
  return (
    <div className={`ui-modal-actions${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
