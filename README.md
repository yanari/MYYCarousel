## Props

| Prop | Required | Description | Type | Default |
|------| :-----: |-------------|------|---------|
| arrowConfig | No | ```{left: {label: symbol or component to be used as the left arrow, margin: margin between arrow and items, width: size of arrows}}``` | Object | null |
| hasDots | No | Determines if has dots below | bool | false |
| itemMargin | No | Margin between every item | number | 8 |
| itemPreviewConfig | No | ```{isClickable: if item preview is clickable (goes to either next or previous item), widthLeft: size of item preview on left, widthRight: size of item preview on right}``` | Object | - |
| itemRenderer | Yes | Function which returns what should be inside each item (takes one argument => data) | func | - |
| items | Yes | List of items | Object | - |
| startIndex | No | Start index | number | 0 |
