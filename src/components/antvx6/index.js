import { Export } from "@antv/x6-plugin-export"

// 初始化
export function preWork() {
  // 这里协助演示的代码，在实际项目中根据实际情况进行调整
  const container = document.getElementById("container");
  const stencilContainer = document.createElement("div");
  stencilContainer.id = "stencil";
  const graphContainer = document.createElement("div");
  graphContainer.id = "graph-container";
  graphContainer.style.width = "calc(100% - 180px)";
  container.appendChild(stencilContainer);
  container.appendChild(graphContainer);
}

export function ExportJSON(graph) {
  let json = graph.use(new Export());
  console.log(json);
}

// 导出为json数据
export function importJSON(graph) {
  let json = graph.toJSON();
  console.log(json);
}

export function selectCell(graph){
  const cells =graph.getSelectedCells()
  console.log(cells);
  return cells
}

// 手动删除选中的节点
export function delCells(graph) {
  const cell = graph.getSelectedCells()
  graph.cut(cell)
}

// 手动复制节点
export function copyCells(graph) {
  // 复制
const cells =graph.getSelectedCells()
if(cells&&cells.length){
    const Id = cells[0].id
    const cell = graph.getCellById(Id)
    if(cell.isEdge()){
        //连接线不可复制、清除
        graph.cleanClipboard()
    }else{
        graph.copy(cells,{offset:30,useLocalStorage:true})
    }
}
 
 // 粘贴
if(!graph.isClipboardEmpty()){
    const cells =graph.paste({offset:32})
    graph.cleanSelection()
    graph.select(cells)
}
return false
}


export function setSelectCells(graph,id = "4d0bae60-5b66-43c4-9c52-1315a7d875ae"){
  console.log(id)
  graph.select(id)
}