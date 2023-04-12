import { useState } from "react";
import axios from "axios";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';


function TableRow({ team, name, onDelete }) {
  let row = team.map(value => <td>{value}</td>);

  return (
    <tr>
      {row}
      <td>
        <button className="btn btn-danger btn-sm " onClick={() => onDelete(name)}>Delete</button>
      </td>
    </tr>
  );
}

function AddTeamForm({ fields, objfields, types, onSubmit }) {
  let inputs = fields.map(function(field, idx) {
    if(types[idx] === "text"){ return(
    <div class="form-group">
      <label>
        {field}
      </label>
      <input class="form-control" name={objfields[idx]} type={types[idx]}  required/>
      <div class="invalid-feedback">
        Invalid value.
      </div>
    </div>
    )}
    else{
      return(
        <div class="form-group">
          <label>
            {field}
          </label>
          <input class="form-control" name={objfields[idx]} type={types[idx]} min="0" required/>
          <div class="invalid-feedback">
            Must be positive.
          </div>
        </div>
        )
    }
  
});
  return (
    <div>
      <form method="post" onSubmit={onSubmit}>
        {inputs}
        <button class="btn btn-primary" type="submit">Add Team</button>
      </form>
    </div>
  );
}

function ButtonRun({ onClick }) {
  return (
  <div>
    <button class="btn btn-success" onClick={onClick}>Get Probabilities</button>
  </div>);
}

function TeamsTable({ fields, teams, onDelete }) {
  let headers = fields.map((field) => <th scope="col">{field}</th>);

  let listact = [];
  for (let [name, team] of teams) {
    listact.push(
      <TableRow team={team} name={name} onDelete={onDelete} />
    );
  }
  if(listact.length > 0){
    return (

      <div class="table-responsive pl-2 pr-2">
        <table class="table table-dark table-striped rounded">
          <tr>{headers}</tr>
          {listact}
        </table>
      </div>
    );
  }
  return (
    <div>
    </div>
  );
}


function LeagueInfoForm({ fields, objfields, types, onSubmit }) {
  let inputs = fields.map(function(field, idx) {
    if(types[idx] === "text"){ return(
    <div class="form-group">
      <label>
        {field}
      </label>
      <input class="form-control" name={objfields[idx]} type={types[idx]}  required/>
      <div class="invalid-feedback">
        Invalid value.
      </div>
    </div>
    )}
    else{
      return(
        <div class="form-group">
          <label>
            {field}
          </label>
          <input class="form-control" name={objfields[idx]} type={types[idx]}  min="0" required/>
          <div class="invalid-feedback">
            Must be positive.
          </div>
        </div>
        )
    }
  
});
  return (
    <div>
      <form class="needs-validation" method="post" onSubmit={onSubmit} novalidate>
        {inputs}
        <button class="btn btn-primary" type="submit">Set League Info</button>
      </form>
    </div>
  );
}

function Header(){
  return (
    <div class="container-fluid">
      <h1 className="text-white text-uppercase text-center my-4">League Predictions</h1>
      <h2 className="text-white text-center my-4">Probabilities of winning the league</h2>
    </div>
  );
}

function LeagueInfo({leagueinfo}){
  if(leagueinfo){
    return(
      <ul class="list-inline pl-2">
        <li class="list-inline-item text-white">&bull; League Name: {leagueinfo.name}</li>
        <li class="list-inline-item text-white">&bull; Description: {leagueinfo.desc}</li>
        <li class="list-inline-item text-white">&bull; Number of Games: {leagueinfo.total_games}</li>
      </ul>
    )
  }
  else{
    return(
      <div>
    </div>
    )
  }
}
function Probabilities({probabs}){
  let info = [];
  for(let [name, probab] of probabs){
    info.push(<li class="list-inline-item bg-white ml-2 mr-2 p-2 rounded" key={name}>{name}: {probab}</li>)
  }
  if(info.length > 0){
    return(
      <div class="container">
        <ul class="list-inline">
        {info}
        </ul>
        
      </div>
    )
  }
  else{
    return(
      <div>
    </div>    )
  }
}

function Latest(){
  let [Latest, setLatest] = useState([]);
  let [collapsed, setCollapsed] = useState(1);
  function handleUpdate(){
    axios
    .get("/api/league_probs/")
    .then((res) => {
      console.log(res.data);
      setLatest(res.data);
    })
    .catch((err) => console.log(err))
    
  }
  let headers = [];
  for (let title of ["Team Name", "Wins", "Draws", "Losses", "Probab"]){
    headers.push(<th scope="col">{title}</th>)
  }
  function getRows(leagueRow){
    let rows = [];
    for(let row of leagueRow.rows){
      rows.push(<tr>
        <td>{row.team_name}</td>
        <td>{row.wins}</td>
        <td>{row.draws}</td>
        <td>{row.losses}</td>
        <td>{row.probab}</td>
      </tr>)
    }
    return(rows)
  }
  function ToogleShowButton({index}){
    let [clicked, setClicked] = useState(0);
    let label = 'Show more';
    if(clicked === 0){
      label = 'Show more';
    }
    else{
      label = 'Show less';
    }
    function handleClick(event){
      let element = document.getElementById("idx"+index);
      if (element.classList.contains('collapsing')) {
        return;
      }
      setClicked(1-clicked)
      // Send    
      }
  
    return(<button onClick={(handleClick)}  class="btn btn-primary" type="button" data-toggle="collapse" data-target={"#idx"+index} aria-expanded="false" aria-controls={"idx"+index}>
    {label}
  </button>)
  }
  let panels = Latest.map((leagueRow, index) => 
  <div class="bg-white m-3 p-1 rounded">
    <ul class="list-inline p-0 m-0">
    <li class="list-inline-item bg-info m-2 p-2 rounded">League: {leagueRow.name}</li>
    <li class="list-inline-item bg-info m-2 p-2 rounded">Description: {leagueRow.description}</li>
    <li class="list-inline-item bg-info m-2 p-2 rounded">Total games: {leagueRow.total_games}</li>
    <li class="list-inline-item  m-2 p-2 rounded"><ToogleShowButton index={index}/></li>
    </ul>
    
    <div class="collapse " id={"idx"+index}>
        <div class="card card-body">
        <table class="table">
          <thead>
            {headers}
          </thead>
          <tbody>
            {getRows(leagueRow)}
          </tbody>
          </table>
        </div>
    </div>

  </div>)
  let label = 'See latest calculations';;
  if(collapsed === 1){
    label = 'See latest calculations';
  }
  else{
    label = 'Collapse';
  }
  function onClick(){
    if(document.getElementById("collapseExample").classList.contains("collapsing")){
      return;
    }
    handleUpdate();
    setCollapsed(1-collapsed);
  }
  
  return(
    <div>
      <button class="btn btn-success m-3" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample" onClick={onClick}>
        {label}
      </button>
      <div class="collapse" id="collapseExample">
      {panels}
      </div>
      

      
    </div>
  )
}


export default function App() {
  let [teams, setTeams] = useState(new Map());
  let [leagueInfo, setInfo] = useState();
  let [probab, setProbab] = useState(new Map());

  let fields = [
    "Team name",
    "Games played",
    "Wins",
    "Draws",
    "Losses",
    "Points"
  ];
  let form_fields = [
    "Team name",
    "Wins",
    "Draws",
    "Losses",
  ];
  let form_objfields = [
    "name",
    "wins",
    "draws",
    "losses",
  ];
  let dataTypes = ["text", "number", "number", "number"];

  let leagueinfo_fields = [
    "League Name",
    "Description",
    "Number of Games"
  ]
  let leagueinfo_objfields = [
    "name",
    "desc",
    "total_games"
  ]
  let leagueinfo_dataTypes = ["text", "text", "number"];

  function handleAdd(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    let obj = Object.fromEntries(formData.entries());
    let gp = parseInt(obj.wins) + parseInt(obj.losses) +parseInt(obj.draws);
    let points = parseInt(obj.wins)*3 + parseInt(obj.losses)*0 +parseInt(obj.draws)*1;
    let team = [obj.name, gp, parseInt(obj.wins), parseInt(obj.draws), parseInt(obj.losses), points]
    if(parseInt(obj.wins) < 0 || parseInt(obj.losses) < 0 || parseInt(obj.draws) < 0){
      alert('Wins, Losses, draws must be positive.');
      return;
    }

    let newTeams = new Map(teams);
    newTeams.set(obj.name, team);
    setTeams(newTeams);
  }
  function handleAddLeagueInfo(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    form.classList.add('was-validated');
    let obj = Object.fromEntries(formData.entries());
    obj.total_games = parseInt(obj.total_games);
    if(obj.total_games <0){
      alert('Total games must be positive');
      return;
    }
    setInfo(obj);
    console.log(leagueInfo);

  }
  function handleDelete(name) {
    let newTeams = new Map(teams);
    newTeams.delete(name);

    setTeams(newTeams);
  }
  function run() {
    let data = {};
    if(!leagueInfo){
      alert('You must add League Info.');
      return;
    }
    for(let [name, team] of teams){
      if(team[1]>leagueInfo.total_games){
        alert('Team ' + name + ' number of games is more than league total games.');
        return;
      }
    }
    data["name"] = leagueInfo.name;
    data["description"] = leagueInfo.desc;
    data["total_games"] = leagueInfo.total_games;
    data["rows"] = [];
    for(let [name, team] of teams){
      let row = {};
      row["team_name"] = name;
      row["wins"] = team[2];
      row["draws"] = team[3];
      row["losses"] = team[4];
      row["probab"] = 0.0;
      data["rows"].push(row);

    }
    axios
      .post("/api/calculate/", data)
      .then((res) => {
        let newProbab = new Map();
        for(let row of res.data["rows"]){
          newProbab.set(row["team_name"], row["probab"]);
        }
        setProbab(newProbab);
      })
      .catch((err) => console.log(err))
      console.log(probab);
  }
  function save() {
    let data = {};
    data["name"] = leagueInfo.name;
    data["description"] = leagueInfo.desc;
    data["total_games"] = leagueInfo.total_games;
    data["rows"] = [];
    for(let [name, team] of teams){
      let row = {};
      row["team_name"] = name;
      row["wins"] = team[2];
      row["draws"] = team[3];
      row["losses"] = team[4];
      row["probab"] = probab.get(name);
      data["rows"].push(row);

    }
    axios
      .post("/api/league_probs/", data)
      .then((res) => {
      })
      .catch((err) => console.log(err))
      console.log(probab);
  }

  return (
    <div class="container">
      <div class="container">
        <div class="row"><Header/></div>
        <div class="row p-3 text-white">
          This app, given the league table at a certain point of the season,
          calculates the probabilities that each team will win the league.
          It does so in a very crude way, assuming for each team  equal 
          probabilities of wins, losses and draws. Even so it gives more information
          beyond the simple matematical deterministic calculation. Beeing a random 
          sampling, each time you press "Get Probabilities" you will get different
          results, and it may occur that teams with equal points have different probabilities.
          Click "See latest calculations" to view probabilities on other leagues.
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <div style={{height:"450px"}} class="pb-2">
              <div class="h-25 bg-dark rounded border border-white overflow-auto" >
                <h5 class="p-2 text-light">League Info</h5>
                <LeagueInfo leagueinfo={leagueInfo}/>
              </div>
              <div class="h-50 bg-dark rounded border border-white overflow-auto">
                <h5 class="p-2 text-light">League Table</h5>
                <TeamsTable
                  fields={fields}
                  teams={teams}
                  onDelete={handleDelete}
                  />
              </div>
              <div class="h-25 bg-dark rounded border border-white overflow-auto">
                <h5 class="p-2 text-light">Probabilities</h5>
                <Probabilities probabs={probab}/>
              </div>

            </div>
            
          </div>
          <div class="col-lg-2">
            <AddTeamForm
            fields={form_fields}
            objfields={form_objfields}
            types={dataTypes}
            onSubmit={handleAdd}
            />
          </div>
          <div class="col-lg-2">
            <LeagueInfoForm
            fields={leagueinfo_fields}
            objfields={leagueinfo_objfields}
            types={leagueinfo_dataTypes}
            onSubmit={handleAddLeagueInfo}
            />
          </div>
        </div> 
      </div>
      
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-2">
             <ButtonRun onClick={run} />
          </div>
          <div class="col-2">
             <button class="btn btn-success"  onClick={save}>Save Results</button>
          </div>
        </div>
      </div>
      
      <Latest/>

    </div>
  );
}
