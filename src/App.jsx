import { useState } from 'react'

class Len{

  constructor(row_, col_){
    this.row = row_;
    this.col = col_;
  }

}

class TileState{

  constructor(state_, number_){
    this.state = state_;
    this.number = number_;
  }

}
class StateList{

  constructor(row_,col_){
    this.row = row_;
    this.col = col_;
  }

  init(){
    this.seed = this.calcSeedByRandomNumber();
    this.members = this.calcStateListFromSeed();
    return;
  }
  copy(){
    let stateListCopy = new StateList(this.row, this.col);
    stateListCopy.seed = this.seed;
    stateListCopy.members = this.members.slice();
    return stateListCopy;
  }

  calcSeedByRandomNumber(){
    const maxNum = 1 << (this.row * this.col);
    return Math.floor(Math.random()*maxNum);
  }

  calcStateListFromSeed(){

    let statusListInit = [];
    for(let i=0; i<this.row; i++){
      let statusListRow = [];
      for(let j=0; j<this.col; j++){
        //const state = State(false);

        const state = this.calcBitState(i,j); 
        statusListRow.push(state);
      }
      statusListInit.push(statusListRow);
    }
    return statusListInit;

  }
  calcSeedFromStatList(){

    let seed = 0;
    for(let i=0; i<this.row; i++){
      for(let j=0; j<this.col; j++){
        if(this.members[i][j]){
          seed += 1 << (i*this.row + j);
        }
      }
    }
    return;

  }

  isWithinArea(i,j){
    const iJudge = i>=0 && i<this.row;
    const jJudge = j>=0 && j<this.col;
    return iJudge && jJudge;
  }
  calcNumber(i,j){
    return i*this.col + j;
  }
  calcBitState(i,j){
    const targetBit = (this.seed >> this.calcNumber(i,j)) & 1
    return targetBit === 1; 
  }

  updateMembers(i,j){

    // paramter
    const DELTA_LIST = [
      [0,0],[-1,0],[0,-1],[1,0],[0,1]
    ];

    // update
    for(const delta of DELTA_LIST){
      const iNext = i + delta[0];
      const jNext = j + delta[1];
      if(!this.isWithinArea(iNext,jNext)) continue;
      this.members[iNext][jNext] = !this.members[iNext][jNext];
    }
    return;

  }
  updateMembersBySeed(seed){

    const cp = this.copy();
    cp.seed = seed;
    this.members = cp.calcStateListFromSeed();;
    return;
  }
  judgeClear(){

    for(let i=0; i<this.row; i++){
      for(let j=0; j<this.col; j++){
        if(!this.members[i][j]) return false;
      }
    }
    return true;

  }

}

function Tile({status, number, clickHandler}){

  function getClassName(status_){

    // paramter
    const bgClass = {
      false : "bg-light",
      true : "bg-danger"
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

function Form({len,submitHandler}){

  return (
    <>
      <form onSubmit={submitHandler}>
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
    </>
  )

}
function Board({statusList,clickHandler}){

  const statusListM = statusList.members

  return(
    <>
    {statusListM.map((valueList,index)=>{
        return(
          <div className="row" key={index}>
          {valueList.map((value,index2)=>{
            return(
              <Tile status={value} number={[index,index2]} key={index2} clickHandler={clickHandler}/>
            )
          })}
          </div>
        )
    })}
    </>
  );

}


function Game(){

  // init parameter
  const ROW_INIT = 3;
  const COL_INIT = 3;

  // use state
  const [len, setLen] = useState(new Len(ROW_INIT,COL_INIT));
  let statusListInit = new StateList(ROW_INIT,COL_INIT);
  statusListInit.init();
  const [statusList, setStatusList] = useState(statusListInit);

  // click handler
  function clickHandler(i,j){

    // copy & change
    let nextStatusList = statusList.copy();
    nextStatusList.updateMembers(i,j);

    // update
    setStatusList(nextStatusList);

    // judge clear
    if(nextStatusList.judgeClear()){
      alert("クリア");
    }
  }

  // submit handler
  function submitHandler(e){

    // prevent default
    e.preventDefault();

    // reset len
    const nextLen = new Len(
      Number(e.target.col.value),
      Number(e.target.row.value)
    )
    setLen(nextLen);

    // reset statusList
    let nextStatusList = new StateList(nextLen.row,nextLen.col);
    nextStatusList.init();
    setStatusList(nextStatusList);

  }

  return(
    <>
      <br/>
      <Form len={len} submitHandler={submitHandler} />
      <br/>
      <Board statusList={statusList} clickHandler={clickHandler} />
      <br/>
      <div>{`random: ${statusList.seed}`}</div>
    </>

  )

}

function App() {

  return (
    <>
      <div className="containter">
        <div className="mx-auto w-75">
          <h1>Tile Game</h1>
          <Game />
        </div>
      </div>
    </>
  )
}

export default App
