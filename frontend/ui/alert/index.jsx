import * as react         from 'react';
import * as lucide        from 'lucide-react';
import * as ui_iconbutton from '@/ui/iconbutton';
import './index.css';

/**
 * Dismissible alert / error banner (workspace-style).
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children  Message body
 * @param {Function} [props.onClose]  When set, shows a dismiss button
 * @param {string} [props.className]
 * @param {string|false} [props.prefix='Error: ']  Leading label; pass false/'' to omit
 */
export function Alert({
  children,
  onClose = undefined,
  className = '',
  prefix = 'Error: ',
}) {
  if (children == null || children === false) return null;

  return (
    <div className={`ui-alert${className ? ` ${className}` : ''}`} role="alert">
      <span className="ui-alert_text">
        {prefix ? <span className="ui-alert_prefix">{prefix}</span> : null}
        {children}
      </span>
      {typeof onClose === 'function' ? (
        <ui_iconbutton.IconButton
          className="ui-alert_close"
          icon={lucide.X}
          iconProps={{ size: 14, strokeWidth: 2.5 }}
          title="Dismiss"
          onClick={onClose}
        />
      ) : null}
    </div>
  );
}
