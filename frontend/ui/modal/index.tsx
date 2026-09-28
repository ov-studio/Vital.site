'use client';
import * as ui_iconbutton from '@/ui/iconbutton';
import * as lucide        from 'lucide-react';
import * as react         from 'react';
import * as react_dom     from 'react-dom';
import './index.css';

export interface ModalProps {
  closing?:        boolean;
  onClose:         () => void;
  controls?:       react.ReactNode;
  media?:          react.ReactNode;
  children:        react.ReactNode;
  className?:      string;
  frameClassName?: string;
  labelledBy?:     string;
  label?:          string;
  maxWidth?:       number | string;
  showClose?:      boolean;
}

export interface ModalHeaderProps {
  author?:         string;
  authorHref?:     string;
  version?:        string;
  title?:          string;
  tagline?:        string;
  divider?:        boolean;
  titleClassName?: string;
}

function use_scroll_lock(active: boolean) {
  react.useEffect(() => {
    if (!active || typeof document === 'undefined') return;

    const sw = window.innerWidth - document.documentElement.clientWidth;
    if (sw <= 0) {
      const prev = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = prev;
      };
    }

    const fixed: { el: HTMLElement; prev: string }[] = [];
    document
      .querySelectorAll<HTMLElement>('nav, header, [data-fixed], .ui-modal-overlay')
      .forEach((el) => {
        const s = getComputedStyle(el);
        if (s.position === 'fixed' || s.position === 'sticky') {
          fixed.push({ el, prev: el.style.paddingRight });
          el.style.paddingRight = `${(parseFloat(s.paddingRight) || 0) + sw}px`;
        }
      });

    const prev_ov = document.documentElement.style.overflow;
    const prev_pr = document.body.style.paddingRight;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.paddingRight = `${sw}px`;

    return () => {
      document.documentElement.style.overflow = prev_ov;
      document.body.style.paddingRight = prev_pr;
      fixed.forEach(({ el, prev }) => {
        el.style.paddingRight = prev;
      });
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
  showClose = true,
}: ModalProps) {
  use_scroll_lock(true);

  react.useEffect(() => {
    function on_key(e: KeyboardEvent) {
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
  title,
  tagline,
  divider = true,
  titleClassName = '',
}: ModalHeaderProps) {
  const has_eyebrow = Boolean(author || version);

  return (
    <>
      {has_eyebrow ? (
        <div className="ui-modal-eyebrow">
          {author ? (
            <span className="ui-modal-author">
              {authorHref ? (
                <a href={authorHref} target="_blank" rel="noreferrer">
                  {author}
                </a>
              ) : (
                author
              )}
            </span>
          ) : (
            <span />
          )}
          {version ? <span className="ui-modal-version">{version}</span> : null}
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
  className = '',
}: {
  children: react.ReactNode;
  className?: string;
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
  className = '',
}: {
  children: react.ReactNode;
  className?: string;
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
  className = '',
}: {
  children: react.ReactNode;
  className?: string;
}) {
  return (
    <div className={`ui-modal-actions${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}
