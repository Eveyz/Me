var Contact = React.createClass({
  getInitialState() {
    return({
      qualify: true,
      from: 'amy',
      to: 'amy',
      message: '',
      color: '#2ecc71',
      match_case: [],
      conflict_cases1: [],
      conflict_cases2: [],
      conflict_name1: '',
      conflict_name2: '',
      show: false
    })
  },

  handleSelect(selected, type) {
    if(type == "from") {
      this.setState({from: selected});
    } else {
      this.setState({to: selected});
    }
    this.setState({show: false});
    this.setState({message: ''});
  },

  checkQualification: function() {
    let sender = this.state.from;
    let receiver = this.state.to;
    let getUrl = '/welcomepages/check_contact_qualification';
    if (sender == receiver) {
      this.setState({
        message: "Do not send message to yourself!",
        color: '#e67e22',
        show: false,
      });
    } else {
      $.ajax({
        url: getUrl,
        dataType: 'json',
        data: {sender: this.state.from, receiver: this.state.to},
        content: this,
        type: 'POST',
        success: function(data) {
          console.log(data);
          qualify = data["qualify"];
          match_case = data["match_case"];
          conflict_cases1 = data["conflict_cases1"];
          conflict_cases2 = data["conflict_cases2"];
          conflict_name1 = data["conflict_name1"];
          conflict_name2 = data["conflict_name2"];
          this.setState({qualify: qualify});
          if (qualify) {
            this.setState({
              message: sender + " contact " + receiver + " successfully!",
              color: '#2ecc71',
              show: false
            });
          } else {
            this.setState({
              message: sender + " cannot contact " + receiver + "!",
              color: '#e74c3c',
              match_case: match_case,
              conflict_cases1: conflict_cases1,
              conflict_cases2: conflict_cases2,
              conflict_name1: conflict_name1,
              conflict_name2: conflict_name2,
              show: true
            });
          }
          // console.log(qualify);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(getUrl, status, err.toString());
        }.bind(this)
      });
    }
  },

  render: function() {
    const labelStyle = {
      color: '#2c3e50',
      fontWeight: 'bold'
    };

    const messageBoxStyle = {
      backgroundColor: '#e74c3c'
    };

    const messageStyle = {
      color: 'white',
      fontWeight: 'bold',
      padding: '10px 20px 10px 20px',
      backgroundColor: this.state.color
    };

    const message = <div style={messageStyle} className="text-center">{this.state.message}</div>;

    const renderMessage = this.state.message == '' ? null : message;

    let single_list = this.state.match_case;
    // single_list.push(this.state.match_case);

    let total_list = <div>
                        <hr/>
                        <h4>Conflict Cases</h4>
                        <List list={single_list} type="#2ecc71" side={this.state.conflict_name1}/>
                        <br/>
                        <List list={this.state.conflict_cases1.concat(this.state.conflict_cases2)} type="#e67e22" side={this.state.conflict_name2}/>
                      </div>

    let conflict_list = this.state.show ? total_list : null;

    return(
      <div className="small-9 small-centered columns">
        <h2 style={{color: "#8e44ad"}}>Contact Simulation</h2>
        <hr/>
        {renderMessage}
        <br/>
        <div className="row">
          <div className="small-6 columns">
            <div className="row">
              <div className="small-2 columns">
                <label className="text-right middle"><span style={labelStyle}>From:</span></label>
              </div>
              <div className="small-10 columns">
                <SelectBox list={this.props.contact_list} selectOption={this.handleSelect} type="from"/>
              </div>
            </div>
          </div>
          <div className="small-6 columns">
            <div className="row">
              <div className="small-2 columns">
                <label className="text-right middle"><span style={labelStyle}>To:</span></label>
              </div>
              <div className="small-10 columns">
                <SelectBox list={this.props.contact_list} selectOption={this.handleSelect} type="to"/>
              </div>
            </div>
          </div>
        </div>
        <br/>
        <button className="button primary small-12 columns" onClick={this.checkQualification}>Contact</button>
        <br/>
        <br/>
        {conflict_list}
        <br/>
      </div>
    )
  }
});

var SelectBox = React.createClass({
  handleSelect(e) {
    selected = e.target.value;
    this.props.selectOption(selected, this.props.type);
  },

  render: function() {
    let contact_list = this.props.list;
    const list = contact_list.map(function(personnel, index) {
      return <SingleOption name={personnel} key={index} />
    });
    return (
      <select onChange={this.handleSelect} >{list}</select>
    )
  }
});

var SingleOption = React.createClass({
  render: function() {
    return (
      <option value={this.props.name}>{this.props.name}</option>
    )
  }
});

var List = React.createClass({
  render() {
    type = this.props.type;
    side = this.props.side;
    const list = this.props.list.map(function(item, index) {
      return <Item data={item} key={index} type={type} side={side}/>
    });
    return(
      <table>
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Personnel</th>
            <th>C1</th>
            <th>C2</th>
            <th>Start</th>
            <th>Completion</th>
          </tr>
        </thead>
        <tbody>
          {list}
        </tbody>
      </table>
    )
  }
});

var Item = React.createClass({
  render() {
    listStyle = {
      backgroundColor: this.props.type,
      listStyleType: 'none',
      color: 'white',
      fontWeight: 'bold',
      padding: '10px 0 10px 0',
      marginTop: '5px'
    };
    let completion = this.props.data.completion ? this.props.data.completion : <i className="fa fa-times" aria-hidden="true" style={{color: '#e74c3c'}}></i>;
    return(
      <tr>
        <td>{this.props.data.id}</td>
        <td>{this.props.side}</td>
        <td>{this.props.data.c1}</td>
        <td>{this.props.data.c2}</td>
        <td>{this.props.data.start}</td>
        <td>{completion}</td>
      </tr>
    )
  }
});
