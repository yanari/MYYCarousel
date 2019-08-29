## Props

| Prop               | Required | Description                                                                                                                     | Type   | Default |
|--------------------|----------|---------------------------------------------------------------------------------------------------------------------------------|--------|---------|
| arrows             |    No    | ```{left: {label: symbol or component to be used as the left arrow, margin: margin between arrow and items, size: size of arrows}}``` | Object |    -    |
| hasDots            |    No    | Determines if has dots below                                                                                                    |  bool  |  false  |
| itemMargin         |    No    | Margin between every item                                                                                                       | number |    8    |
| itemRenderer       |    Yes   | Function which returns what is inside each item                                                                                 |  func  |    -    |
| items              |    Yes   | List of items                                                                                                                   | Object |    -    |
| itemPreviewSize    |    No   | ```{left: size of item preview on left, right: size of item preview on right}```                                                      | Object |    -    |
| previewIsClickable |    No    | If item preview is clickable                                                                                                    |  bool  |  false  |
| startIndex         |    No    | Start index                                                                                                                     | number |    0    |
