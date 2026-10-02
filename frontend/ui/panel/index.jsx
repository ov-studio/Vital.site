import { Search as SearchIcon } from 'lucide-react';
import { Tabs } from '../tabs';
import { Search } from '../search';
import './index.css';

/**
 * Bordered content panel.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export function Panel({
  children,
  className = ''
}) {
  return (
    <div className={`ui-panel${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

/**
 * Panel with a tab strip + optional search above its content (usually a table).
 *
 * @param {Object} props
 * @param {string} props.value  Active tab id
 * @param {(id: string) => void} props.onChange
 * @param {{ id: string, label: string, icon?: import('react').ReactNode }[]} props.tabs
 * @param {string} [props.ariaLabel]
 * @param {string} [props.query]  Search value (search is shown when onQuery is set)
 * @param {(value: string) => void} [props.onQuery]
 * @param {string} [props.placeholder]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export function TabPanel({
  value,
  onChange,
  tabs,
  ariaLabel = 'Tabs',
  query = '',
  onQuery = undefined,
  placeholder = 'Search name or author…',
  className = '',
  children
}) {
  return (
    <Panel className={className}>
      <div className="ui-panel-head">
        <Tabs value={value} onChange={onChange} items={tabs} ariaLabel={ariaLabel}/>
        {onQuery && (
          <Search
            className="ui-panel-search"
            placeholder={placeholder}
            value={query}
            onChange={onQuery}
            icon={<SearchIcon size={14} strokeWidth={2}/>}
          />
        )}
      </div>
      {children}
    </Panel>
  );
}
