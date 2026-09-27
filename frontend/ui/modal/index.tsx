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
