##  AntvX6

#### 依赖整理

```json
{
  "@antv/x6": "^2.0.0",
  "@antv/x6-plugin-clipboard": "^2.0.0", // 如果使用剪切板功能，需要安装此包
  "@antv/x6-plugin-history": "^2.0.0", // 如果使用撤销重做功能，需要安装此包
  "@antv/x6-plugin-keyboard": "^2.0.0", // 如果使用快捷键功能，需要安装此包
  "@antv/x6-plugin-minimap": "^2.0.0", // 如果使用小地图功能，需要安装此包
  "@antv/x6-plugin-scroller": "^2.0.0", // 如果使用滚动画布功能，需要安装此包
  "@antv/x6-plugin-selection": "^2.0.0", // 如果使用框选功能，需要安装此包
  "@antv/x6-plugin-snapline": "^2.0.0", // 如果使用对齐线功能，需要安装此包
  "@antv/x6-plugin-dnd": "^2.0.0", // 如果使用 dnd 功能，需要安装此包
  "@antv/x6-plugin-stencil": "^2.0.0", // 如果使用 stencil 功能，需要安装此包
  "@antv/x6-plugin-transform": "^2.0.0", // 如果使用图形变换功能，需要安装此包
  "@antv/x6-plugin-export": "^2.0.0", // 如果使用图片导出功能，需要安装此包
  "@antv/x6-react-components": "^2.0.0", // 如果使用配套 UI 组件，需要安装此包
  "@antv/x6-react-shape": "^2.0.0", // 如果使用 react 渲染功能，需要安装此包
  "@antv/x6-vue-shape": "^2.0.0" // 如果使用 vue 渲染功能，需要安装此包
}
```

#### 踩坑记录

- vite项目下，安装引入@antv/x6-vue-shape会报错 只安装@antv/x6正常，安装x6-vue-shape后会报错

```js
import { Graph } from “@antv/x6”;
```

```
Uncaught TypeError: Cannot read properties of undefined (reading 'ToolItem')；
```


[参考](https://blog.csdn.net/qq_44721831/article/details/122715788)


#### 流程图

`Graph` 为 对象实例 - 配置画布相关参数

`createNode`:

|选项     |类型	        |默认值  |  必选	|  描述  |
| ------ | :----------: | ----: |:-------|-------|
|id      |string	|	|	| 节点/边的唯一标识，推荐使用具备业务意义的 ID，默认使用自动生成的 UUID。|
|markup  |Markup        |	|	| 节点/边的 SVG/HTML 片段。|
|attrs   |Attr.CellAttrs|	|	| 节点/边属性样式。|
|shape   |string        |	|	| 渲染节点/边的图形。节点对应的默认值为 rect，边对应的默认值为 edge。|
|view	 |string        |	|	| 渲染节点/边的视图。|
|zIndex	 |number        |	|	| 节点/边在画布中的层级，默认根据节点/边添加顺序自动确定。|
|visible |boolean       | true	|	| 节点/边是否可见。|
|parent  |string        |	|	| 父节点。|
|children|string[]      |	|	| 子节点/边。|
|data	 |any	        |	|	| 节点/边关联的业务数据。|
|tools	 |ToolItem ToolItem[]  Tools| |	| 工具选项。|



#### ER 图 