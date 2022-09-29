All Icon types:
                                      
```js
import Icon, { ICONS_TYPES, LABEL_POSITION_TYPES } from 'components/Icon';

const wrapItemStyle = {
    "display": "flex",
    "flexDirection": "row",
    "flexWrap": "wrap",
    "justifyContent": "flex-start",
    "alignContent": "center",
    "alignItems": "center",
};
const itemStyle = {
    "width": "270px",
    "margin": "5px",
    "padding": "5px",
    "border": "1px solid #000",
};

<div style={wrapItemStyle}>
{
    Object.values(ICONS_TYPES).map(item => 
        <div style={itemStyle} key={item}>
            <Icon {...{
              size: 25,
              label: `ICONS_TYPES.${item}`,
              labelPosition: LABEL_POSITION_TYPES.down,
              type: ICONS_TYPES[item],
            }} />
      </div>
    )
}
</div>
```


Icon base example:
                                      
```js
import Icon, { ICONS_TYPES } from 'components/Icon';

<Icon {...{
  size: 18,
  type: ICONS_TYPES.edit,
  onClick: (...args) => console.log('onClick', ...args),
}} />
```
