import { useState } from 'react'

function Tile({status, number, clickHandler}){

  function getClassName(status_){

    // paramter
    const bgClass = {
      false : "bg-secondary",
      true : "bg-primary"
    }
    let classList = [];
    classList.push("col");
    classList.push("btn");
    classList.push(bgClass[status_]);
    const className = "col btn" + " " + bgClass[status_];
    return className;    

  }

  return(
    <>
      <div className={getClassName(status)} onClick={()=>clickHandler(number[0],number[1])}>{number}</div>
    </>

  )


}

function Form(){


}


function Game(){

  // init parameter
  const ROW_INIT = 3;
  const COL_INIT = 3;
  const LEN_INIT = {
    "row" : ROW_INIT,
    "col" : COL_INIT
  }
  const [len, setLen] = useState(LEN_INIT);

  // status init
  function getInitStatusList(row, col){
    let statusListInit = [];
    for(let i=0; i<row; i++){
      let statusListRow = [];
      for(let j=0; j<col; j++){
        statusListRow.push(false);
      }
      statusListInit.push(statusListRow);
    }
    return statusListInit;

  }

  const statusListInit = getInitStatusList(len.row,len.col);
  const [statusList, setStatusList] = useState(statusListInit);

  function isWithinArea(i,j){
    const iJudge = i>=0 && i<len.row;
    const jJudge = j>=0 && j<len.col;
    return iJudge && jJudge;
  }

  function clickHandler(i,j){

    // paramter
    const deltaList = [
      [0,0],[-1,0],[0,-1],[1,0],[0,1]
    ];

    // copy
    let nextStatusList = statusList.slice();
    // inverse
    for(const delta of deltaList){
      const iNext = i + delta[0];
      const jNext = j + delta[1];
      if(!isWithinArea(iNext,jNext)) continue;
      nextStatusList[iNext][jNext] = !nextStatusList[iNext][jNext];
    }
    // update
    setStatusList(nextStatusList);
  }

  function handleSubmit(e){
    e.preventDefault();
    // reset len
    const nextLen = {
      "row" : Number(e.target.col.value),
      "col" : Number(e.target.row.value)
    }
    setLen(nextLen);
    // reset statusList
    const nextStatusList = getInitStatusList(nextLen.row, nextLen.col);
    setStatusList(nextStatusList);
  }


  let content = statusList.map((valueList,index)=>{
      return(
        <div className="row" key={index}>
        {valueList.map((value,index2)=>{
          return(
            <Tile status={value} number={[index,index2]} key={index2} clickHandler={clickHandler}/>
          )
        })}
        </div>
      )
      //return getRowContent(valueList)
  });

  return(
    <>
      <br/>
      <form onSubmit={handleSubmit}>
        <label>
          行
          <input id="row" name="row" type="number" defaultValue={len.row} />
        </label>
        <label>
          列
          <input id="col" name="col" type="number" defaultValue={len.col} />
        </label>
        <button className="btn btn-secondary" type="submit">リセット</button>
      </form>
      <br/>
      {content}
    </>

  )

}

function App() {

  return (
    <>
      <div className="containter">
          <h1>Tile Game</h1>
          <Game />
      </div>
    </>
  )
}

export default App
