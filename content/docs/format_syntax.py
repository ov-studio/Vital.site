import re
import os
import glob

def split_params(s):
    """Split string s by commas that are not inside {}, [], or quotes."""
    parts = []
    current = []
    brace_level = 0
    bracket_level = 0
    in_single_quote = False
    in_double_quote = False
    escape = False
    for ch in s:
        if escape:
            escape = False
            current.append(ch)
            continue
        if ch == '\\':
            escape = True
            current.append(ch)
            continue
        if ch == "'" and not in_double_quote:
            in_single_quote = not in_single_quote
            current.append(ch)
            continue
        if ch == '"' and not in_single_quote:
            in_double_quote = not in_double_quote
            current.append(ch)
            continue
        if ch == '{' and not (in_single_quote or in_double_quote):
            brace_level += 1
            current.append(ch)
            continue
        if ch == '}' and not (in_single_quote or in_double_quote):
            brace_level -= 1
            current.append(ch)
            continue
        if ch == '[' and not (in_single_quote or in_double_quote):
            bracket_level += 1
            current.append(ch)
            continue
        if ch == ']' and not (in_single_quote or in_double_quote):
            bracket_level -= 1
            current.append(ch)
            continue
        if ch == ',' and brace_level == 0 and bracket_level == 0 and not (in_single_quote or in_double_quote):
            parts.append(''.join(current).strip())
            current = []
            continue
        current.append(ch)
    if current:
        parts.append(''.join(current).strip())
    return parts

def format_lua_call(code):
    """Format a Lua function call line to have each param on new line."""
    # Find the first '(' and matching ')'
    # We'll assume the line contains a function call.
    # Find index of first '('
    open_paren = code.find('(')
    if open_paren == -1:
        return code  # no parentheses, return as is
    # Find matching closing parenthesis
    paren_level = 0
    close_paren = -1
    for i in range(open_paren, len(code)):
        ch = code[i]
        if ch == '(':
            paren_level += 1
        elif ch == ')':
            paren_level -= 1
            if paren_level == 0:
                close_paren = i
                break
    if close_paren == -1:
        return code  # unbalanced parentheses
    prefix = code[:open_paren+1]  # includes '('
    suffix = code[close_paren:]   # includes ')'
    params_str = code[open_paren+1:close_paren]
    # Split parameters
    params = split_params(params_str)
    if not params:
        # No parameters, just return original
        return code
    # Build formatted string
    indented = '    '  # 4 spaces
    lines = []
    for i, param in enumerate(params):
        line = indented + param
        if i < len(params) - 1:
            line += ','
        lines.append(line)
    formatted = prefix + '\n' + '\n'.join(lines) + '\n' + suffix
    # Replace the original call with formatted
    return code[:open_paren+1] + '\n' + '\n'.join(lines) + '\n' + suffix

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    # Pattern to find ### Syntax section and the following lua code block
    # We'll use regex with DOTALL to capture across lines
    pattern = r'(### Syntax\s*\n\s*```lua\n)(.*?)(\n\s*```)'
    def replace_match(match):
        prefix = match.group(1)  # up to opening ```
        inner = match.group(2)   # the lua code
        suffix = match.group(3)  # closing ```
        # Format the inner code: we assume it's a single line call
        # But there could be multiple lines? We'll process each line.
        lines = inner.splitlines()
        formatted_lines = []
        for line in lines:
            stripped = line.strip()
            if stripped:
                formatted_lines.append(format_lua_call(line))
            else:
                formatted_lines.append(line)
        new_inner = '\n'.join(formatted_lines)
        return prefix + new_inner + suffix
    new_content = re.sub(pattern, replace_match, content, flags=re.DOTALL)
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated: {filepath}')
    else:
        print(f'No change: {filepath}')

def main():
    # Find all .mdx files under content/docs
    base_dir = r'C:\Users\Tron\Documents\GIT\Vital.site\content\docs'
    pattern = os.path.join(base_dir, '**', '*.mdx')
    files = glob.glob(pattern, recursive=True)
    for f in files:
        process_file(f)

if __name__ == '__main__':
    main()