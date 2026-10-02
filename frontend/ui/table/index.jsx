import './index.css';

/**
 * Data table.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.wrapClassName]
 */
export function Table({ 
  children, 
  className = '', 
  wrapClassName = '' 
}) {
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
export function TableEmpty({ 
  colSpan = 4, 
  icon = null, 
  children 
}) {
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

/**
 * Cell title with optional link and muted sub-line.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.href]  Opens in a new tab when set
 * @param {import('react').ReactNode} [props.sub]
 */
export function TableTitle({
  children,
  href = undefined,
  sub = undefined
}) {
  return (
    <>
      {href ? (
        <a className="ui-table-title" href={href} target="_blank" rel="noreferrer">{children}</a>
      ) : (
        <div className="ui-table-title">{children}</div>
      )}
      {sub ? <div className="ui-table-sub">{sub}</div> : null}
    </>
  );
}

/**
 * Right-aligned actions cell (buttons).
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function TableActions({ children }) {
  return (
    <td className="ui-table-actions">
      <div className="ui-table-actions-inner">{children}</div>
    </td>
  );
}

/**
 * Declarative table: header, rows and empty state in one place.
 * Include an empty string in `head` for an actions column.
 *
 * @template T
 * @param {Object} props
 * @param {import('react').ReactNode[]} props.head
 * @param {T[]} props.rows
 * @param {(row: T) => string} props.rowKey
 * @param {(row: T) => import('react').ReactNode} props.renderRow  Return the <td> cells
 * @param {{ icon?: import('react').ReactNode, text: import('react').ReactNode }} props.empty
 * @param {string} [props.className]
 */
export function DataTable({
  head,
  rows,
  rowKey,
  renderRow,
  empty,
  className = ''
}) {
  return (
    <Table className={className}>
      <thead>
        <tr>
          {head.map((h, i) => <th key={i}>{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <TableEmpty colSpan={head.length} icon={empty.icon}>{empty.text}</TableEmpty>
        ) : (
          rows.map((row) => <tr key={rowKey(row)}>{renderRow(row)}</tr>)
        )}
      </tbody>
    </Table>
  );
}
