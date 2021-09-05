import { RenderableProps } from "preact";

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function Search({
  value,
  onChange,
  children,
}: RenderableProps<SearchProps>) {
  return (
    <div id="search">
      <p>
        <label for="search-input">{children}</label>
      </p>
      <p>
        <input
          id="search-input"
          type="search"
          value={value}
          onInput={({ currentTarget }) => onChange(currentTarget.value)}
        />
      </p>
    </div>
  );
}
