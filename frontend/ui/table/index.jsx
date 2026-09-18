import './index.css';

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.wrapClassName]
 */
export function Table({ children, className = '', wrapClassName = '' }) {
  return (
    <div className={`ui-table-wrap${wrapClassName ? ` ${wrapClassName}` : ''}`}>
      <table className={`ui-table${className ? ` ${className}` : ''}`}>
        {children}
      </table>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {number} [props.colSpan]
 * @param {import('react').ReactNode} [props.icon]
 * @param {import('react').ReactNode} props.children
 */
export function TableEmpty({ colSpan = 4, icon = null, children }) {
  return (
    <tr className="ui-table-empty">
      <td colSpan={colSpan}>
        <div className="ui-table-empty-inner">
          {icon}
          <span>{children}</span>
        </div>
      </td>
    </tr>
  );
}
