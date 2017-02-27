var Contact = React.createClass({
  getInitialState() {
    return({
      qualify: true,
      from: 'amy',
      to: 'amy',
      message: '',
      color: '#2ecc71'
    })
  },

  handleSelect(selected, type) {
    if(type == "from") {
      this.setState({from: selected});
    } else {
      this.setState({to: selected});
    }
  },

  checkQualification: function() {
    let sender = this.state.from;
    let receiver = this.state.to;
    let getUrl = '/welcomepages/check_contact_qualification';
    if (sender == receiver) {
      this.setState({
        message: "Do not send message to yourself!",
        color: '#e67e22'
      });
    } else {
      $.ajax({
        url: getUrl,
        dataType: 'json',
        data: {sender: this.state.from, receiver: this.state.to},
        content: this,
        type: 'POST',
        success: function(qualify) {
          this.setState({qualify: qualify});
          if (qualify) {
            this.setState({
              message: sender + " contact " + receiver + " successfully!",
              color: '#2ecc71'
            });
          } else {
            this.setState({
              message: sender + " cannot contact " + receiver + "!",
              color: '#e74c3c'
            });
          }
          console.log(qualify);
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

    return(
      <div className="small-9 small-centered columns">
        <h1 style={{color: "#8e44ad"}}>Contact Simulation</h1>
        {renderMessage}
        <br/>
        <div className="row">
          <div className="small-6 columns">
            <div className="row">
              <div className="small-2 columns">
                <label className="text-right middle"><span style={labelStyle}>From:</span></label>
              </div>
              <div className="small-10 columns">
                <SelectBox contact_list={this.props.contact_list} selectOption={this.handleSelect} type="from"/>
              </div>
            </div>
          </div>
          <div className="small-6 columns">
            <div className="row">
              <div className="small-2 columns">
                <label className="text-right middle"><span style={labelStyle}>To:</span></label>
              </div>
              <div className="small-10 columns">
                <SelectBox contact_list={this.props.contact_list} selectOption={this.handleSelect} type="to"/>
              </div>
            </div>
          </div>
        </div>
        <button className="button success" onClick={this.checkQualification}>Contact</button>
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
    let contact_list = this.props.contact_list;
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